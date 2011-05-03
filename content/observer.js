var EXPORTED_SYMBOLS = ['gHistCleanObserverInit'];

var gHistoryService = Components
    .classes["@mozilla.org/browser/nav-history-service;1"]
    .getService(Components.interfaces.nsINavHistoryService);

var gInitDone = false;
function gHistCleanObserverInit() {
  if (gInitDone) return;
  gInitDone = true;

  gHistoryService.addObserver(observer, false);
}

// https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsINavHistoryObserver
var observer = {
  onBeforeDeleteURI: function(aUri) { },
  onBeginUpdateBatch: function() { },
  onClearHistory: function() { },
  onDeleteURI: function(aUri) {
    Components.utils.reportError('onDeleteURI...');
  },
  onDeleteVisits: function(aUri, aVisitTime) { },
  onEndUpdateBatch: function() { },
  onPageChanged: function(aUri, aWhat, aValue) { },
  onTitleChanged: function(aUri, aPageTitle) { },
  onVisit: function(
      aUri, aVisitID, aTime, aSessionID, aReferringID, aTransitionType, aAdded
  ) {
    Components.utils.reportError('visit...');
    onUri(aUri);
  }
};

function onUri(aUri) {
  Components.utils.reportError('Saw a URI: ' + aUri.spec);
}
