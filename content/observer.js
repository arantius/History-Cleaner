var EXPORTED_SYMBOLS = ['gHistCleanObserverInit', 'gHistCleanRemoveUri'];

Components.utils.import('chrome://histclean/content/pref.js');

var gHistoryService = Components
    .classes["@mozilla.org/browser/nav-history-service;1"]
    .getService(Components.interfaces.nsINavHistoryService);

var gInitDone = false;
var gLocalClearing = false;

// https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsINavHistoryObserver
var observer = {
  onBeforeDeleteURI: function(aUri) { },
  onBeginUpdateBatch: function() { },
  onClearHistory: function() { },
  onDeleteURI: function(aUri) {
    if (gLocalClearing) return;
    var s = Components.stack
    while (s) {
      if (s.name == 'onxblkeypress'
          && s.filename == 'chrome://global/content/bindings/autocomplete.xml'
      ) {
        // Deletion from awesome bar.
        openDialog(
            'chrome://histclean/content/add-pattern.xul',
            'resizable=no',
            aUri.spec.replace(/([?\\])/g, '\\$1')
            );
        return;
      }
      s = s.caller;
    }
  },
  onDeleteVisits: function(aUri, aVisitTime) { },
  onEndUpdateBatch: function() { },
  onPageChanged: function(aUri, aWhat, aValue) { },
  onTitleChanged: function(aUri, aPageTitle) { },
  onVisit: function(
      aUri, aVisitID, aTime, aSessionID, aReferringID, aTransitionType, aAdded
  ) {
    onUri(aUri);
  }
};

function gHistCleanObserverInit() {
  if (gInitDone) return;
  gInitDone = true;

  gHistoryService.addObserver(observer, false);
}

function gHistCleanRemoveUri(aUri) {
  gLocalClearing = true;
  gHistoryService.removePage(aUri);
  gLocalClearing = false;
}

function onUri(aUri) {
  var patterns = gHistCleanGetPatterns();
  for (var i = 0, pattern = null; pattern = patterns[i]; i++) {
    if (aUri.spec.match(pattern)) {
      gHistCleanRemoveUri(aUri);
      break;
    }
  }
}

// http://goo.gl/UpWa0
function openDialog(url, features) {
  var array = Components.classes["@mozilla.org/array;1"]
      .createInstance(Components.interfaces.nsIMutableArray);
  for (var i = 2; i < arguments.length; i++) {
      var variant = Components.classes["@mozilla.org/variant;1"]
          .createInstance(Components.interfaces.nsIWritableVariant);
      variant.setFromVariant(arguments[i]);
      array.appendElement(variant, false);
  }

  var watcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
      .getService(Components.interfaces.nsIWindowWatcher);
  return watcher.openWindow(
      null /* parentWindow */, url, null /* windowName */, features, array);
}
