var EXPORTED_SYMBOLS = [
    'gHistCleanAddGlob',
    'gHistCleanGetGlobs',
    'gHistCleansetGlobs',
    ];

var gPrefBranch = Components.classes["@mozilla.org/preferences-service;1"]
    .getService(Components.interfaces.nsIPrefService)
    .getBranch("extensions.histclean.");

var gHistCleanGlobs = null;

function gHistCleanAddGlob(aGlob) {
  var globs = gHistCleanGetGlobs();
  globs.push(aGlob);
  gHistCleanSetGlobs(globs);
}

function gHistCleanGetGlobs() {
  if (null == gHistCleanGlobs) {
    gHistCleanGlobs = JSON.parse(gPrefBranch.getCharPref('globs') || '');
  }
  return gHistCleanGlobs;
}

function gHistCleanSetGlobs(aGlobs) {
  gHistCleanGlobs = aGlobs;
  return gPrefBranch.setCharPref('globs', JSON.stringify(gHistCleanGlobs));
}
