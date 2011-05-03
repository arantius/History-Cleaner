Components.utils.import('chrome://histclean/content/observer.js');
Components.utils.import('chrome://histclean/content/pref.js');

window.addEventListener('load', function() {
  if (!window.arguments) return;
  var patternBox = document.getElementById('pattern');
  patternBox.value = window.arguments[0];
}, false);

function addPattern() {
  var progressMeter = document.getElementById('progressmeter');
  progressMeter.removeAttribute('collapsed');
  var patternBox = document.getElementById('pattern');

  var patternStr = '^' + patternBox.value + '$';
  // TODO: Web worker?
  setTimeout(function() {
    gHistCleanAddPatternStr(patternStr);
    clearAllEntriesForPatternStr(patternStr);
    window.close();
  }, 25);

  return false;
}

function clearAllEntriesForPatternStr(aPatternStr) {
  var pattern = new RegExp(aPatternStr);
  var historyService = Components
      .classes["@mozilla.org/browser/nav-history-service;1"]
      .getService(Components.interfaces.nsINavHistoryService);
  var ioService = Components.classes["@mozilla.org/network/io-service;1"]
      .getService(Components.interfaces.nsIIOService);

  var results = historyService.executeQuery(
      historyService.getNewQuery(), historyService.getNewQueryOptions()).root;
  results.containerOpen = true;
  try {
    for (var i = 0, result = null; i < results.childCount; i++) {
      result = results.getChild(i);
      // This uri is actually a url.
      if (result.uri.match(pattern)) {
        gHistCleanRemoveUri(ioService.newURI(result.uri, null, null));
      }
    }
  } catch (e) { /* just make sure we close the container */ }
  results.containerOpen = false;
}
