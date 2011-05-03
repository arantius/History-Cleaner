var EXPORTED_SYMBOLS = [
    'gHistCleanAddPatternStr',
    'gHistCleanGetPatterns',
    'gHistCleansetPatterns',
    ];

var gPrefBranch = Components.classes["@mozilla.org/preferences-service;1"]
    .getService(Components.interfaces.nsIPrefService)
    .getBranch("extensions.histclean.");

var gHistCleanPatterns = null;

function gHistCleanAddPatternStr(aPatternStr) {
  var patterns = gHistCleanGetPatterns(); // in case it's the first access
  patterns.push(new RegExp('^' + aPatternStr + '$'));
  gHistCleanSetPatterns(patterns);
}

function gHistCleanGetPatterns() {
  if (null == gHistCleanPatterns) {
    var src = gPrefBranch.getCharPref('patterns');
    gHistCleanPatterns = JSON.parse(src).map(
        function(pattern) { return new RegExp(pattern); });
  }
  return gHistCleanPatterns;
}

function gHistCleanSetPatterns(aPatterns) {
  gHistCleanPatterns = aPatterns;
  var src = JSON.stringify(gHistCleanPatterns.map(
      function(pattern) { return pattern.source; }));
  gPrefBranch.setCharPref('patterns', src);
}
