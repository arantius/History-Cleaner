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
    openDialog(
        null, 'chrome://histclean/content/add-pattern.xul',
        null, null, aUri.spec.replace(/([?\\])/g, '\\$1'));
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
  Components.utils.reportError('Saw a URI: ' + aUri.spec);
  var patterns = gHistCleanGetPatterns();
  for (var i = 0, pattern = null; pattern = patterns[i]; i++) {
    if (aUri.spec.match(pattern)) {
      Components.utils.reportError('and it matches: ' + pattern);
      gHistCleanRemoveUri(aUri);
      break;
    }
  }
}

// http://goo.gl/UpWa0
function openDialog(parentWindow, url, windowName, features) {
    var array = Components.classes["@mozilla.org/array;1"]
        .createInstance(Components.interfaces.nsIMutableArray);
    for (var i = 4; i < arguments.length; i++) {
        var variant = Components.classes["@mozilla.org/variant;1"]
            .createInstance(Components.interfaces.nsIWritableVariant);
        variant.setFromVariant(arguments[i]);
        array.appendElement(variant, false);
    }

    var watcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
        .getService(Components.interfaces.nsIWindowWatcher);
    return watcher.openWindow(parentWindow, url, windowName, features, array);
}
