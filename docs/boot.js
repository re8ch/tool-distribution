// Runs synchronously in <head>: paint the stored navigator theme before first render.
(function () {
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem('re8ch-product-theme'); } catch (error) { stored = null; }
  var dark;
  if (stored === 'dark' || stored === 'light') dark = stored === 'dark';
  else if (stored === 'auto') { var hour = new Date().getHours(); dark = hour < 7 || hour >= 19; }
  else dark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.dataset.theme = dark ? 'dark' : 'light';
})();
