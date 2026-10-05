// Inlined into <head> by the build so the chosen palette is applied before first paint.
// Order of precedence: ?theme=grey|blue in the URL, then the visitor's last choice, then the default.
(function () {
  var root = document.documentElement;
  var allowed = ['grey', 'blue'];
  var key = 'mazzy-theme';
  var theme = null;
  root.classList.add('js');
  try {
    var fromUrl = new URLSearchParams(window.location.search).get('theme');
    if (allowed.indexOf(fromUrl) > -1) {
      theme = fromUrl;
      window.localStorage.setItem(key, fromUrl);
    } else {
      theme = window.localStorage.getItem(key);
    }
  } catch (e) {
    /* storage unavailable: fall back to the default palette */
  }
  if (allowed.indexOf(theme) > -1) root.setAttribute('data-theme', theme);
})();
