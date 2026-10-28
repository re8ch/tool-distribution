// Shared page behaviour: copy buttons and footer theme sync.
(function () {
  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-copy], [data-copy-target]');
    if (!button || !navigator.clipboard) return;
    var target = button.dataset.copyTarget && document.getElementById(button.dataset.copyTarget);
    var text = button.dataset.copy || (target ? target.textContent.trim() : '');
    if (!text) return;
    navigator.clipboard.writeText(text).then(function () {
      var label = button.textContent;
      button.textContent = 'Copied';
      setTimeout(function () { button.textContent = label; }, 1400);
    }).catch(function () {});
  });

  // The navigator owns the theme control; mirror its result onto the footer.
  var root = document.documentElement;
  function syncFooter() {
    document.querySelectorAll('re8ch-footer').forEach(function (footer) {
      if (footer.getAttribute('theme') !== root.dataset.theme) footer.setAttribute('theme', root.dataset.theme || 'light');
    });
  }
  new MutationObserver(syncFooter).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  syncFooter();
})();
