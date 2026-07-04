(function () {
  function initSidebarTagCloud() {
    var canvas = document.getElementById('sidebarTagCanvas');
    var list = document.getElementById('sidebarTagList');
    var wrap = document.getElementById('sidebarTagCanvasWrap');

    if (!canvas || !list || !wrap || typeof TagCanvas === 'undefined') return;

    try {
      TagCanvas.Start('sidebarTagCanvas', 'sidebarTagList', {
        textFont: 'Lato, Microsoft YaHei, sans-serif',
        textColour: '#333333',
        textHeight: 14,
        outlineColour: '#e2e1c1',
        outlineMethod: 'block',
        maxSpeed: 0.035,
        minBrightness: 0.22,
        depth: 0.92,
        initial: [0.08, -0.08],
        decel: 0.98,
        reverse: true,
        hideTags: true,
        shadow: '#d7e3f2',
        shadowBlur: 2,
        wheelZoom: false,
        freezeActive: true,
        clickToFront: 500,
        fadeIn: 800
      });
      wrap.classList.add('is-canvas-ready');
    } catch (error) {
      wrap.classList.add('is-fallback');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebarTagCloud);
  } else {
    initSidebarTagCloud();
  }
}());
