// original authors below, modified to use ES6 exports and support mocks

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

var raf = {
    requestAnimationFrame: window.requestAnimationFrame
        && window.requestAnimationFrame.bind(window)
};

var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !raf.requestAnimationFrame; ++x) {
    raf.requestAnimationFrame = raf[vendors[x]+'RequestAnimationFrame']
        && raf[vendors[x]+'RequestAnimationFrame'].bind(window);
    raf.cancelAnimationFrame = raf[vendors[x]+'CancelAnimationFrame'] 
        && raf[vendors[x]+'CancelAnimationFrame'].bind(window)
                || raf[vendors[x]+'CancelRequestAnimationFrame']
                    && raf[vendors[x]+'CancelRequestAnimationFrame'].bind(window);
}

if (!raf.requestAnimationFrame)
    raf.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

if (!raf.cancelAnimationFrame)
    raf.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };

raf.real_requestAnimationFrame = raf.requestAnimationFrame;

raf.callbacks = [];
raf.mock_requestAnimationFrame = function(callback) {
    this.callbacks.push(callback);
}
raf.mock = function(mock) {
    this.requestAnimationFrame = mock ? this.mock_requestAnimationFrame : this.real_requestAnimationFrame;
};
raf.step = function() {
    var toRun = this.callbacks;
    this.callbacks = [];
    toRun.forEach(function(cb) { cb(performance.now()); });
}

// XXX
if (!window.performance)
  window.performance = {
    now: function() { return Date.now(); }
  };

export default raf;