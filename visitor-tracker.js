(() => {
  const trackedHosts = new Set(['jiacheng.website', 'www.jiacheng.website']);

  if (!trackedHosts.has(window.location.hostname) || document.querySelector('.visitor-panel')) {
    return;
  }

  fetch('https://itongue.cn/api/jiacheng-visitors', {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    keepalive: true
  }).catch(() => {
    // Visitor statistics must never interrupt page rendering or navigation.
  });
})();
