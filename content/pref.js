var EXPORTED_SYMBOLS = [
    'gHistCleanAddPatternStr',
    'gHistCleanGetPatterns',
    'gHistCleanSetPatterns',
    'gHistCleanSetPatternStrs',
    ];

var gPrefBranch = Components.classes["@mozilla.org/preferences-service;1"]
    .getService(Components.interfaces.nsIPrefService)
    .getBranch("extensions.histclean.");

var gHistCleanPatterns = null;

function gHistCleanAddPatternStr(aPatternStr) {
  if (!aPatternStr) return;

  var patterns = gHistCleanGetPatterns(); // in case it's the first access
  var pattern = new RegExp(aPatternStr);
  Components.utils.reportError(patterns+'\n');
  Components.utils.reportError(patternsToStrs(patterns)+'\n');
  Components.utils.reportError(pattern.source+'\n');
  if (-1 !== patternsToStrs(patterns).indexOf(pattern.source)) return;

  patterns.push(pattern);
  gHistCleanSetPatterns(patterns);
}

function gHistCleanGetPatterns() {
  if (null == gHistCleanPatterns) {
    var src = gPrefBranch.getCharPref('patterns');
    gHistCleanPatterns = strsToPatterns(JSON.parse(src));
  }
  return gHistCleanPatterns;
}

function gHistCleanSetPatterns(aPatterns) {
  gHistCleanPatterns = aPatterns;
  var src = JSON.stringify(patternsToStrs(gHistCleanPatterns));
  gPrefBranch.setCharPref('patterns', src);
}

function gHistCleanSetPatternStrs(aPatternStrs) {
  gHistCleanPatterns = strsToPatterns(aPatternStrs);
  var src = JSON.stringify(patternsToStrs(gHistCleanPatterns));
  gPrefBranch.setCharPref('patterns', src);
}

function patternsToStrs(patterns) {
  return patterns.map(function(pattern) { return pattern.source; });
}
function strsToPatterns(strs) {
  return strs.map(function(str) { return new RegExp(str); });
}
