function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload !== 'function') {
    window.onload = func;
  } else {
    window.onload = function () {
      oldonload();
      func();
    };
  }
}

addLoadEvent(function () {
  try {
    TagCanvas.textFont = 'Helvetica';
    TagCanvas.textColour = '#333';
    TagCanvas.textHeight = 15;
    TagCanvas.outlineColour = '#E2E1C1';
    TagCanvas.maxSpeed = 0.02;
    TagCanvas.freezeActive = false;
    TagCanvas.outlineMethod = 'block';
    TagCanvas.minBrightness = 0.2;
    TagCanvas.depth = 0.92;
    TagCanvas.pulsateTo = 0.6;
    TagCanvas.initial = [0.45, -0.28];
    TagCanvas.decel = 0.99;
    TagCanvas.reverse = true;
    TagCanvas.hideTags = false;
    TagCanvas.shadow = '#ccf';
    TagCanvas.shadowBlur = 3;
    TagCanvas.weight = false;
    TagCanvas.imageScale = null;
    TagCanvas.fadeIn = 1000;
    TagCanvas.clickToFront = 600;
    TagCanvas.lock = false;
    TagCanvas.Start('resCanvas');
    TagCanvas.Resume('resCanvas');
    TagCanvas.SetSpeed('resCanvas', [0.45, -0.28]);
    TagCanvas.tc['resCanvas'].Wheel(true);
  } catch (e) {
    var container = document.getElementById('myCanvasContainer');
    if (container) container.classList.add('tag-canvas-fallback');
  }
});
