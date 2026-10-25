(function () {
function start() {
    if (!document.getElementById('resCanvas')) {
        var tags = [{"name":"context","url":"/tags/context/"},{"name":"Reduction","url":"/tags/Reduction/"},{"name":"Iterative-Generation","url":"/tags/Iterative-Generation/"},{"name":"structured-state","url":"/tags/structured-state/"}];
        var selectors = [".sidebar-tag-cloud-host"];
        var mount = null;
        for (var i = 0; i < selectors.length && !mount; i++) {
            try { mount = document.querySelector(selectors[i]); } catch (e) { mount = null; }
        }
        if (!mount || !tags.length) return;
        var container = document.createElement('div');
        container.id = 'myCanvasContainer';
        container.className = 'widget tagcloud hexo-tag-cloud';
        var canvas = document.createElement('canvas');
        canvas.id = 'resCanvas';
        canvas.width = 250;
        canvas.height = 250;
        canvas.style.width = '100%';
        for (var j = 0; j < tags.length; j++) {
            var a = document.createElement('a');
            a.href = tags[j].url;
            a.textContent = tags[j].name;
            canvas.appendChild(a);
        }
        container.appendChild(canvas);
        mount.appendChild(container);
    }
    if (!document.getElementById('resCanvas') || typeof TagCanvas === 'undefined') return;
    try {
        TagCanvas.textFont = "Microsoft YaHei, sans-serif";
        TagCanvas.textColour = "#666";
        TagCanvas.textHeight = 15;
        TagCanvas.outlineColour = "transparent";
        TagCanvas.maxSpeed = 0.03;
        TagCanvas.freezeActive = false;
        TagCanvas.outlineMethod = 'block';
        TagCanvas.minBrightness = 0.2;
        TagCanvas.depth = 0.92;
        TagCanvas.pulsateTo = 0.6;
        TagCanvas.initial = [0.1, -0.1];
        TagCanvas.decel = 0.98;
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
        TagCanvas.tc['resCanvas'].Wheel(true);
    } catch (e) {
        var container = document.getElementById('myCanvasContainer');
        if (container) container.style.display = 'none';
    }
}
if (document.readyState === 'complete') {
    start();
} else {
    window.addEventListener('load', start);
}
})();
