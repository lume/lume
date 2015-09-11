(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.boxer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * Equivalent of an Engine in the Worker Thread. Used to synchronize and manage
 * time across different Threads.
 *
 * @class  Clock
 * @constructor
 * @private
 */
function Clock () {
    this._time = 0;
    this._frame = 0;
    this._timerQueue = [];
    this._updatingIndex = 0;

    this._scale = 1;
    this._scaledTime = this._time;
}

/**
 * Sets the scale at which the clock time is passing.
 * Useful for slow-motion or fast-forward effects.
 *
 * `1` means no time scaling ("realtime"),
 * `2` means the clock time is passing twice as fast,
 * `0.5` means the clock time is passing two times slower than the "actual"
 * time at which the Clock is being updated via `.step`.
 *
 * Initally the clock time is not being scaled (factor `1`).
 *
 * @method  setScale
 * @chainable
 *
 * @param {Number} scale    The scale at which the clock time is passing.
 *
 * @return {Clock} this
 */
Clock.prototype.setScale = function setScale (scale) {
    this._scale = scale;
    return this;
};

/**
 * @method  getScale
 *
 * @return {Number} scale    The scale at which the clock time is passing.
 */
Clock.prototype.getScale = function getScale () {
    return this._scale;
};

/**
 * Updates the internal clock time.
 *
 * @method  step
 * @chainable
 *
 * @param  {Number} time high resolution timestamp used for invoking the
 *                       `update` method on all registered objects
 * @return {Clock}       this
 */
Clock.prototype.step = function step (time) {
    this._frame++;

    this._scaledTime = this._scaledTime + (time - this._time)*this._scale;
    this._time = time;

    for (var i = 0; i < this._timerQueue.length; i++) {
        if (this._timerQueue[i](this._scaledTime)) {
            this._timerQueue.splice(i, 1);
        }
    }
    return this;
};

/**
 * Returns the internal clock time.
 *
 * @method  now
 *
 * @return  {Number} time high resolution timestamp used for invoking the
 *                       `update` method on all registered objects
 */
Clock.prototype.now = function now () {
    return this._scaledTime;
};

/**
 * Returns the internal clock time.
 *
 * @method  getTime
 * @deprecated Use #now instead
 *
 * @return  {Number} time high resolution timestamp used for invoking the
 *                       `update` method on all registered objects
 */
Clock.prototype.getTime = Clock.prototype.now;

/**
 * Returns the number of frames elapsed so far.
 *
 * @method getFrame
 *
 * @return {Number} frames
 */
Clock.prototype.getFrame = function getFrame () {
    return this._frame;
};

/**
 * Wraps a function to be invoked after a certain amount of time.
 * After a set duration has passed, it executes the function and
 * removes it as a listener to 'prerender'.
 *
 * @method setTimeout
 *
 * @param {Function} callback function to be run after a specified duration
 * @param {Number} delay milliseconds from now to execute the function
 *
 * @return {Function} timer function used for Clock#clearTimer
 */
Clock.prototype.setTimeout = function (callback, delay) {
    var params = Array.prototype.slice.call(arguments, 2);
    var startedAt = this._time;
    var timer = function(time) {
        if (time - startedAt >= delay) {
            callback.apply(null, params);
            return true;
        }
        return false;
    };
    this._timerQueue.push(timer);
    return timer;
};


/**
 * Wraps a function to be invoked after a certain amount of time.
 *  After a set duration has passed, it executes the function and
 *  resets the execution time.
 *
 * @method setInterval
 *
 * @param {Function} callback function to be run after a specified duration
 * @param {Number} delay interval to execute function in milliseconds
 *
 * @return {Function} timer function used for Clock#clearTimer
 */
Clock.prototype.setInterval = function setInterval(callback, delay) {
    var params = Array.prototype.slice.call(arguments, 2);
    var startedAt = this._time;
    var timer = function(time) {
        if (time - startedAt >= delay) {
            callback.apply(null, params);
            startedAt = time;
        }
        return false;
    };
    this._timerQueue.push(timer);
    return timer;
};

/**
 * Removes previously via `Clock#setTimeout` or `Clock#setInterval`
 * registered callback function
 *
 * @method clearTimer
 * @chainable
 *
 * @param  {Function} timer  previously by `Clock#setTimeout` or
 *                              `Clock#setInterval` returned callback function
 * @return {Clock}              this
 */
Clock.prototype.clearTimer = function (timer) {
    var index = this._timerQueue.indexOf(timer);
    if (index !== -1) {
        this._timerQueue.splice(index, 1);
    }
    return this;
};

module.exports = Clock;

},{}],2:[function(require,module,exports){
var Clock = require('./Clock');

var Engine = function(){
    this._clock = new Clock();
    this._worker = null;
}

Engine.prototype.init = function(worker){
    window.requestAnimationFrame(this.tick.bind(this));
    if(worker){
        this._worker = worker;
    }
}

Engine.prototype.tick = function(time){

    this._clock.step(time);
    this.time = this._clock.now();

    if(this._worker){
        this._worker.postMessage({frame:this.time});
    }

    window.requestAnimationFrame(this.tick.bind(this));

}


/**
 * Returns the instance of clock used by the FamousEngine.
 *
 * @method
 *
 * @return {Clock} Engine's clock
 */
Engine.prototype.getClock = function() {
    return this._clock;
};

module.exports = new Engine();

},{"./Clock":1}],3:[function(require,module,exports){
var Node = function(conf){
    if(conf){
        this.setProperties(conf);
    } else {
        this.setDefaults();
    }
}

Node.prototype.setDefaults = function(conf){
    this.position = [0,0,0];
    this.origin = [0.0,0.0,0.0];
    this.align = [0.0,0.0,0.0];
    this.size = [0,0,0];
    this.opacity = 1.0;
};

Node.prototype.setProperties = function(conf){
    this.position = conf.position || [0,0,0];
    this.origin = conf.origin || [0.0,0.0,0.0];
    this.align = conf.align || [0.0,0.0,0.0];
    this.size = conf.size || [0,0,0];
    this.opacity = conf.opacity || 1.0;
};

Node.prototype.getProperties = function(){
    return {
        position: this.position,
        origin: this.origin,
        align: this.align,
        size: this.size,
        opacity: this.opacity
    }
};

Node.prototype.setPosition = function(pos){
    this.position = pos;
}

Node.prototype.getPosition = function(){
    return this.position;
}

Node.prototype.setSize = function(size){
    this.size = size;
}

Node.prototype.getSize = function(){
    return this.size;
}

Node.prototype.setOrigin = function(origin){
    this.origin = origin;
}

Node.prototype.getOrigin = function(){
    return this.origin;
}

Node.prototype.setAlign = function(align){
    this.align = align;
}

Node.prototype.getAlign = function(){
    return this.align;
}

Node.prototype.setOpacity = function(opacity){
    this.opacity = opacity;
}

Node.prototype.getOpacity = function(){
    return this.opacity;
}

module.exports = Node;

},{}],4:[function(require,module,exports){
var Scene = function(graph){
    this.graph = graph || {};
    this.length = 0;
}

Scene.prototype.addChild = function(node){
    this.length++;
    node.id = 'id-'+this.length;
    this.graph[node.id] = node;
}


Scene.prototype.fetchNode = function(id) {
    return this.graph[id];
}

Scene.prototype.find = function(query) {
    var queryArray = [];
    for(q in query){
        for(prop in this.graph) {
            for(p in this.graph[prop]){
                if (p === q && this.graph[prop][p] === query[q]) {
                    queryArray.push(this.graph[prop]);
                }
            }
        }
    }
    return queryArray;
}

Scene.prototype.findOne = function(query) {

    for(q in query){
        for(prop in this.graph) {
            for(p in this.graph[prop]){
                if (p === q && this.graph[prop][p] === query[q]) {
                    return this.graph[prop];
                }
            }
        }
    }

}

Scene.prototype.update = function(tick){
    //console.log(tick);
}

module.exports = new Scene();

},{}],5:[function(require,module,exports){
module.exports = {
    Clock: require('./Clock'),
    Engine: require('./Engine'),
    Scene: require('./Scene'),
    Node: require('./Node')
};

},{"./Clock":1,"./Engine":2,"./Node":3,"./Scene":4}],6:[function(require,module,exports){
module.exports = {
    core: require('./core'),
    transitions: require('./transitions')
};

},{"./core":5,"./transitions":9}],7:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jshint -W008 */

'use strict';

/**
 * A library of curves which map an animation explicitly as a function of time.
 *
 * @namespace
 * @property {Function} linear
 * @property {Function} easeIn
 * @property {Function} easeOut
 * @property {Function} easeInOut
 * @property {Function} easeOutBounce
 * @property {Function} spring
 * @property {Function} inQuad
 * @property {Function} outQuad
 * @property {Function} inOutQuad
 * @property {Function} inCubic
 * @property {Function} outCubic
 * @property {Function} inOutCubic
 * @property {Function} inQuart
 * @property {Function} outQuart
 * @property {Function} inOutQuart
 * @property {Function} inQuint
 * @property {Function} outQuint
 * @property {Function} inOutQuint
 * @property {Function} inSine
 * @property {Function} outSine
 * @property {Function} inOutSine
 * @property {Function} inExpo
 * @property {Function} outExpo
 * @property {Function} inOutExp
 * @property {Function} inCirc
 * @property {Function} outCirc
 * @property {Function} inOutCirc
 * @property {Function} inElastic
 * @property {Function} outElastic
 * @property {Function} inOutElastic
 * @property {Function} inBounce
 * @property {Function} outBounce
 * @property {Function} inOutBounce
 * @property {Function} flat            - Useful for delaying the execution of
 *                                        a subsequent transition.
 */
var Curves = {
    linear: function(t) {
        return t;
    },

    easeIn: function(t) {
        return t*t;
    },

    easeOut: function(t) {
        return t*(2-t);
    },

    easeInOut: function(t) {
        if (t <= 0.5) return 2*t*t;
        else return -2*t*t + 4*t - 1;
    },

    easeOutBounce: function(t) {
        return t*(3 - 2*t);
    },

    spring: function(t) {
        return (1 - t) * Math.sin(6 * Math.PI * t) + t;
    },

    inQuad: function(t) {
        return t*t;
    },

    outQuad: function(t) {
        return -(t-=1)*t+1;
    },

    inOutQuad: function(t) {
        if ((t/=.5) < 1) return .5*t*t;
        return -.5*((--t)*(t-2) - 1);
    },

    inCubic: function(t) {
        return t*t*t;
    },

    outCubic: function(t) {
        return ((--t)*t*t + 1);
    },

    inOutCubic: function(t) {
        if ((t/=.5) < 1) return .5*t*t*t;
        return .5*((t-=2)*t*t + 2);
    },

    inQuart: function(t) {
        return t*t*t*t;
    },

    outQuart: function(t) {
        return -((--t)*t*t*t - 1);
    },

    inOutQuart: function(t) {
        if ((t/=.5) < 1) return .5*t*t*t*t;
        return -.5 * ((t-=2)*t*t*t - 2);
    },

    inQuint: function(t) {
        return t*t*t*t*t;
    },

    outQuint: function(t) {
        return ((--t)*t*t*t*t + 1);
    },

    inOutQuint: function(t) {
        if ((t/=.5) < 1) return .5*t*t*t*t*t;
        return .5*((t-=2)*t*t*t*t + 2);
    },

    inSine: function(t) {
        return -1.0*Math.cos(t * (Math.PI/2)) + 1.0;
    },

    outSine: function(t) {
        return Math.sin(t * (Math.PI/2));
    },

    inOutSine: function(t) {
        return -.5*(Math.cos(Math.PI*t) - 1);
    },

    inExpo: function(t) {
        return (t===0) ? 0.0 : Math.pow(2, 10 * (t - 1));
    },

    outExpo: function(t) {
        return (t===1.0) ? 1.0 : (-Math.pow(2, -10 * t) + 1);
    },

    inOutExpo: function(t) {
        if (t===0) return 0.0;
        if (t===1.0) return 1.0;
        if ((t/=.5) < 1) return .5 * Math.pow(2, 10 * (t - 1));
        return .5 * (-Math.pow(2, -10 * --t) + 2);
    },

    inCirc: function(t) {
        return -(Math.sqrt(1 - t*t) - 1);
    },

    outCirc: function(t) {
        return Math.sqrt(1 - (--t)*t);
    },

    inOutCirc: function(t) {
        if ((t/=.5) < 1) return -.5 * (Math.sqrt(1 - t*t) - 1);
        return .5 * (Math.sqrt(1 - (t-=2)*t) + 1);
    },

    inElastic: function(t) {
        var s=1.70158;var p=0;var a=1.0;
        if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
        s = p/(2*Math.PI) * Math.asin(1.0/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/ p));
    },

    outElastic: function(t) {
        var s=1.70158;var p=0;var a=1.0;
        if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
        s = p/(2*Math.PI) * Math.asin(1.0/a);
        return a*Math.pow(2,-10*t) * Math.sin((t-s)*(2*Math.PI)/p) + 1.0;
    },

    inOutElastic: function(t) {
        var s=1.70158;var p=0;var a=1.0;
        if (t===0) return 0.0;  if ((t/=.5)===2) return 1.0;  if (!p) p=(.3*1.5);
        s = p/(2*Math.PI) * Math.asin(1.0/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/p));
        return a*Math.pow(2,-10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/p)*.5 + 1.0;
    },

    inBack: function(t, s) {
        if (s === undefined) s = 1.70158;
        return t*t*((s+1)*t - s);
    },

    outBack: function(t, s) {
        if (s === undefined) s = 1.70158;
        return ((--t)*t*((s+1)*t + s) + 1);
    },

    inOutBack: function(t, s) {
        if (s === undefined) s = 1.70158;
        if ((t/=.5) < 1) return .5*(t*t*(((s*=(1.525))+1)*t - s));
        return .5*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
    },

    inBounce: function(t) {
        return 1.0 - Curves.outBounce(1.0-t);
    },

    outBounce: function(t) {
        if (t < (1/2.75)) {
            return (7.5625*t*t);
        }
        else if (t < (2/2.75)) {
            return (7.5625*(t-=(1.5/2.75))*t + .75);
        }
        else if (t < (2.5/2.75)) {
            return (7.5625*(t-=(2.25/2.75))*t + .9375);
        }
        else {
            return (7.5625*(t-=(2.625/2.75))*t + .984375);
        }
    },

    inOutBounce: function(t) {
        if (t < .5) return Curves.inBounce(t*2) * .5;
        return Curves.outBounce(t*2-1.0) * .5 + .5;
    },

    flat: function() {
        return 0;
    }
};

module.exports = Curves;

},{}],8:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var Curves = require('./Curves');
var Engine = require('../core/Engine');

/**
 * A state maintainer for a smooth transition between
 *    numerically-specified states. Example numeric states include floats and
 *    arrays of floats objects.
 *
 * An initial state is set with the constructor or using
 *     {@link Transitionable#from}. Subsequent transitions consist of an
 *     intermediate state, easing curve, duration and callback. The final state
 *     of each transition is the initial state of the subsequent one. Calls to
 *     {@link Transitionable#get} provide the interpolated state along the way.
 *
 * Note that there is no event loop here - calls to {@link Transitionable#get}
 *    are the only way to find state projected to the current (or provided)
 *    time and are the only way to trigger callbacks and mutate the internal
 *    transition queue.
 *
 * @example
 * var t = new Transitionable([0, 0]);
 * t
 *     .to([100, 0], 'linear', 1000)
 *     .delay(1000)
 *     .to([200, 0], 'outBounce', 1000);
 *
 * var div = document.createElement('div');
 * div.style.background = 'blue';
 * div.style.width = '100px';
 * div.style.height = '100px';
 * document.body.appendChild(div);
 *
 * div.addEventListener('click', function() {
 *     t.isPaused() ? t.resume() : t.pause();
 * });
 *
 * requestAnimationFrame(function loop() {
 *     div.style.transform = 'translateX(' + t.get()[0] + 'px)' + ' translateY(' + t.get()[1] + 'px)';
 *     requestAnimationFrame(loop);
 * });
 *
 * @class Transitionable
 * @constructor
 * @param {Number|Array.Number} initialState    initial state to transition
 *                                              from - equivalent to a pursuant
 *                                              invocation of
 *                                              {@link Transitionable#from}
 */
function Transitionable(initialState) {
    this._queue = [];
    this._from = null;
    this._state = null;
    this._startedAt = null;
    this._pausedAt = null;
    if (initialState != null) this.from(initialState);
}

/**
 * Internal Clock used for determining the current time for the ongoing
 * transitions.
 *
 * @type {Performance|Date|Clock}
 */

Transitionable.Clock = Engine.getClock();

/**
 * Registers a transition to be pushed onto the internal queue.
 *
 * @method to
 * @chainable
 *
 * @param  {Number|Array.Number}    finalState              final state to
 *                                                          transiton to
 * @param  {String|Function}        [curve=Curves.linear]   easing function
 *                                                          used for
 *                                                          interpolating
 *                                                          [0, 1]
 * @param  {Number}                 [duration=100]          duration of
 *                                                          transition
 * @param  {Function}               [callback]              callback function
 *                                                          to be called after
 *                                                          the transition is
 *                                                          complete
 * @param  {String}                 [method]                method used for
 *                                                          interpolation
 *                                                          (e.g. slerp)
 * @return {Transitionable}         this
 */
Transitionable.prototype.to = function to(finalState, curve, duration, callback, method) {
    curve = curve != null && curve.constructor === String ? Curves[curve] : curve;
    if (this._queue.length === 0) {
        this._startedAt = this.constructor.Clock.now();
        this._pausedAt = null;
    }
    this._queue.push(
        finalState,
        curve != null ? curve : Curves.linear,
        duration != null ? duration : 100,
        callback,
        method
    );
    return this;
};

/**
 * Resets the transition queue to a stable initial state.
 *
 * @method from
 * @chainable
 *
 * @param  {Number|Array.Number}    initialState    initial state to
 *                                                  transition from
 * @return {Transitionable}         this
 */
Transitionable.prototype.from = function from(initialState) {
    this._state = initialState;
    this._from = this._sync(null, this._state);
    this._queue.length = 0;
    this._startedAt = this.constructor.Clock.now();
    this._pausedAt = null;
    return this;
};

/**
 * Delays the execution of the subsequent transition for a certain period of
 * time.
 *
 * @method delay
 * @chainable
 *
 * @param {Number}      duration    delay time in ms
 * @param {Function}    [callback]  Zero-argument function to call on observed
 *                                  completion (t=1)
 * @return {Transitionable}         this
 */
Transitionable.prototype.delay = function delay(duration, callback) {
    var endState = this._queue.length > 0 ? this._queue[this._queue.length - 5] : this._state;
    return this.to(endState, Curves.flat, duration, callback);
};

/**
 * Overrides current transition.
 *
 * @method override
 * @chainable
 *
 * @param  {Number|Array.Number}    [finalState]    final state to transiton to
 * @param  {String|Function}        [curve]         easing function used for
 *                                                  interpolating [0, 1]
 * @param  {Number}                 [duration]      duration of transition
 * @param  {Function}               [callback]      callback function to be
 *                                                  called after the transition
 *                                                  is complete
 * @param {String}                  [method]        optional method used for
 *                                                  interpolating between the
 *                                                  values. Set to `slerp` for
 *                                                  spherical linear
 *                                                  interpolation.
 * @return {Transitionable}         this
 */
Transitionable.prototype.override = function override(finalState, curve, duration, callback, method) {
    if (this._queue.length > 0) {
        if (finalState != null) this._queue[0] = finalState;
        if (curve != null)      this._queue[1] = curve.constructor === String ? Curves[curve] : curve;
        if (duration != null)   this._queue[2] = duration;
        if (callback != null)   this._queue[3] = callback;
        if (method != null)     this._queue[4] = method;
    }
    return this;
};


/**
 * Used for interpolating between the start and end state of the currently
 * running transition
 *
 * @method  _interpolate
 * @private
 *
 * @param  {Object|Array|Number} output     Where to write to (in order to avoid
 *                                          object allocation and therefore GC).
 * @param  {Object|Array|Number} from       Start state of current transition.
 * @param  {Object|Array|Number} to         End state of current transition.
 * @param  {Number} progress                Progress of the current transition,
 *                                          in [0, 1]
 * @param  {String} method                  Method used for interpolation (e.g.
 *                                          slerp)
 * @return {Object|Array|Number}            output
 */
Transitionable.prototype._interpolate = function _interpolate(output, from, to, progress, method) {
    if (to instanceof Object) {
        if (method === 'slerp') {
            var x, y, z, w;
            var qx, qy, qz, qw;
            var omega, cosomega, sinomega, scaleFrom, scaleTo;

            x = from[0];
            y = from[1];
            z = from[2];
            w = from[3];

            qx = to[0];
            qy = to[1];
            qz = to[2];
            qw = to[3];

            if (progress === 1) {
                output[0] = qx;
                output[1] = qy;
                output[2] = qz;
                output[3] = qw;
                return output;
            }

            cosomega = w * qw + x * qx + y * qy + z * qz;
            if ((1.0 - cosomega) > 1e-5) {
                omega = Math.acos(cosomega);
                sinomega = Math.sin(omega);
                scaleFrom = Math.sin((1.0 - progress) * omega) / sinomega;
                scaleTo = Math.sin(progress * omega) / sinomega;
            }
            else {
                scaleFrom = 1.0 - progress;
                scaleTo = progress;
            }

            output[0] = x * scaleFrom + qx * scaleTo;
            output[1] = y * scaleFrom + qy * scaleTo;
            output[2] = z * scaleFrom + qz * scaleTo;
            output[3] = w * scaleFrom + qw * scaleTo;
        }
        else if (to instanceof Array) {
            for (var i = 0, len = to.length; i < len; i++) {
                output[i] = this._interpolate(output[i], from[i], to[i], progress, method);
            }
        }
        else {
            for (var key in to) {
                output[key] = this._interpolate(output[key], from[key], to[key], progress, method);
            }
        }
    }
    else {
        output = from + progress * (to - from);
    }
    return output;
};


/**
 * Internal helper method used for synchronizing the current, absolute state of
 * a transition to a given output array, object literal or number. Supports
 * nested state objects by through recursion.
 *
 * @method  _sync
 * @private
 *
 * @param  {Number|Array|Object} output     Where to write to (in order to avoid
 *                                          object allocation and therefore GC).
 * @param  {Number|Array|Object} input      Input state to proxy onto the
 *                                          output.
 * @return {Number|Array|Object} output     Passed in output object.
 */
Transitionable.prototype._sync = function _sync(output, input) {
    if (typeof input === 'number') output = input;
    else if (input instanceof Array) {
        if (output == null) output = [];
        for (var i = 0, len = input.length; i < len; i++) {
            output[i] = _sync(output[i], input[i]);
        }
    }
    else if (input instanceof Object) {
        if (output == null) output = {};
        for (var key in input) {
            output[key] = _sync(output[key], input[key]);
        }
    }
    return output;
};

/**
 * Get interpolated state of current action at provided time. If the last
 *    action has completed, invoke its callback.
 *
 * @method get
 *
 * @param {Number=} t               Evaluate the curve at a normalized version
 *                                  of this time. If omitted, use current time
 *                                  (Unix epoch time retrieved from Clock).
 * @return {Number|Array.Number}    Beginning state interpolated to this point
 *                                  in time.
 */
Transitionable.prototype.get = function get(t) {
    if (this._queue.length === 0) return this._state;

    t = this._pausedAt ? this._pausedAt : t;
    t = t ? t : this.constructor.Clock.now();

    var progress = (t - this._startedAt) / this._queue[2];
    this._state = this._interpolate(
        this._state,
        this._from,
        this._queue[0],
        this._queue[1](progress > 1 ? 1 : progress),
        this._queue[4]
    );
    var state = this._state;
    if (progress >= 1) {
        this._startedAt = this._startedAt + this._queue[2];
        this._from = this._sync(this._from, this._state);
        this._queue.shift();
        this._queue.shift();
        this._queue.shift();
        var callback = this._queue.shift();
        this._queue.shift();
        if (callback) callback();
    }
    return progress > 1 ? this.get() : state;
};

/**
 * Is there at least one transition pending completion?
 *
 * @method isActive
 *
 * @return {Boolean}    Boolean indicating whether there is at least one pending
 *                      transition. Paused transitions are still being
 *                      considered active.
 */
Transitionable.prototype.isActive = function isActive() {
    return this._queue.length > 0;
};

/**
 * Halt transition at current state and erase all pending actions.
 *
 * @method halt
 * @chainable
 *
 * @return {Transitionable} this
 */
Transitionable.prototype.halt = function halt() {
    return this.from(this.get());
};

/**
 * Pause transition. This will not erase any actions.
 *
 * @method pause
 * @chainable
 *
 * @return {Transitionable} this
 */
Transitionable.prototype.pause = function pause() {
    this._pausedAt = this.constructor.Clock.now();
    return this;
};

/**
 * Has the current action been paused?
 *
 * @method isPaused
 * @chainable
 *
 * @return {Boolean} if the current action has been paused
 */
Transitionable.prototype.isPaused = function isPaused() {
    return !!this._pausedAt;
};

/**
 * Resume a previously paused transition.
 *
 * @method resume
 * @chainable
 *
 * @return {Transitionable} this
 */
Transitionable.prototype.resume = function resume() {
    var diff = this._pausedAt - this._startedAt;
    this._startedAt = this.constructor.Clock.now() - diff;
    this._pausedAt = null;
    return this;
};

/**
 * Cancel all transitions and reset to a stable state
 *
 * @method reset
 * @chainable
 * @deprecated Use `.from` instead!
 *
 * @param {Number|Array.Number|Object.<number, number>} start
 *    stable state to set to
 * @return {Transitionable}                             this
 */
Transitionable.prototype.reset = function(start) {
    return this.from(start);
};

/**
 * Add transition to end state to the queue of pending transitions. Special
 *    Use: calling without a transition resets the object to that state with
 *    no pending actions
 *
 * @method set
 * @chainable
 * @deprecated Use `.to` instead!
 *
 * @param {Number|FamousEngineMatrix|Array.Number|Object.<number, number>} state
 *    end state to which we interpolate
 * @param {transition=} transition object of type {duration: number, curve:
 *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
 *    instantaneous.
 * @param {function()=} callback Zero-argument function to call on observed
 *    completion (t=1)
 * @return {Transitionable} this
 */
Transitionable.prototype.set = function(state, transition, callback) {
    if (transition == null) {
        this.from(state);
        if (callback) callback();
    }
    else {
        this.to(state, transition.curve, transition.duration, callback, transition.method);
    }
    return this;
};

module.exports = Transitionable;

},{"../core/Engine":2,"./Curves":7}],9:[function(require,module,exports){
module.exports = {
    Curves: require('./Curves'),
    Transitionable: require('./Transitionable')
};

},{"./Curves":7,"./Transitionable":8}]},{},[6])(6)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9jb3JlL0Nsb2NrLmpzIiwic3JjL2NvcmUvRW5naW5lLmpzIiwic3JjL2NvcmUvTm9kZS5qcyIsInNyYy9jb3JlL1NjZW5lLmpzIiwic3JjL2NvcmUvaW5kZXguanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdHJhbnNpdGlvbnMvQ3VydmVzLmpzIiwic3JjL3RyYW5zaXRpb25zL1RyYW5zaXRpb25hYmxlLmpzIiwic3JjL3RyYW5zaXRpb25zL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBGYW1vdXMgSW5kdXN0cmllcyBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRXF1aXZhbGVudCBvZiBhbiBFbmdpbmUgaW4gdGhlIFdvcmtlciBUaHJlYWQuIFVzZWQgdG8gc3luY2hyb25pemUgYW5kIG1hbmFnZVxuICogdGltZSBhY3Jvc3MgZGlmZmVyZW50IFRocmVhZHMuXG4gKlxuICogQGNsYXNzICBDbG9ja1xuICogQGNvbnN0cnVjdG9yXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBDbG9jayAoKSB7XG4gICAgdGhpcy5fdGltZSA9IDA7XG4gICAgdGhpcy5fZnJhbWUgPSAwO1xuICAgIHRoaXMuX3RpbWVyUXVldWUgPSBbXTtcbiAgICB0aGlzLl91cGRhdGluZ0luZGV4ID0gMDtcblxuICAgIHRoaXMuX3NjYWxlID0gMTtcbiAgICB0aGlzLl9zY2FsZWRUaW1lID0gdGhpcy5fdGltZTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBzY2FsZSBhdCB3aGljaCB0aGUgY2xvY2sgdGltZSBpcyBwYXNzaW5nLlxuICogVXNlZnVsIGZvciBzbG93LW1vdGlvbiBvciBmYXN0LWZvcndhcmQgZWZmZWN0cy5cbiAqXG4gKiBgMWAgbWVhbnMgbm8gdGltZSBzY2FsaW5nIChcInJlYWx0aW1lXCIpLFxuICogYDJgIG1lYW5zIHRoZSBjbG9jayB0aW1lIGlzIHBhc3NpbmcgdHdpY2UgYXMgZmFzdCxcbiAqIGAwLjVgIG1lYW5zIHRoZSBjbG9jayB0aW1lIGlzIHBhc3NpbmcgdHdvIHRpbWVzIHNsb3dlciB0aGFuIHRoZSBcImFjdHVhbFwiXG4gKiB0aW1lIGF0IHdoaWNoIHRoZSBDbG9jayBpcyBiZWluZyB1cGRhdGVkIHZpYSBgLnN0ZXBgLlxuICpcbiAqIEluaXRhbGx5IHRoZSBjbG9jayB0aW1lIGlzIG5vdCBiZWluZyBzY2FsZWQgKGZhY3RvciBgMWApLlxuICpcbiAqIEBtZXRob2QgIHNldFNjYWxlXG4gKiBAY2hhaW5hYmxlXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHNjYWxlICAgIFRoZSBzY2FsZSBhdCB3aGljaCB0aGUgY2xvY2sgdGltZSBpcyBwYXNzaW5nLlxuICpcbiAqIEByZXR1cm4ge0Nsb2NrfSB0aGlzXG4gKi9cbkNsb2NrLnByb3RvdHlwZS5zZXRTY2FsZSA9IGZ1bmN0aW9uIHNldFNjYWxlIChzY2FsZSkge1xuICAgIHRoaXMuX3NjYWxlID0gc2NhbGU7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEBtZXRob2QgIGdldFNjYWxlXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBzY2FsZSAgICBUaGUgc2NhbGUgYXQgd2hpY2ggdGhlIGNsb2NrIHRpbWUgaXMgcGFzc2luZy5cbiAqL1xuQ2xvY2sucHJvdG90eXBlLmdldFNjYWxlID0gZnVuY3Rpb24gZ2V0U2NhbGUgKCkge1xuICAgIHJldHVybiB0aGlzLl9zY2FsZTtcbn07XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgaW50ZXJuYWwgY2xvY2sgdGltZS5cbiAqXG4gKiBAbWV0aG9kICBzdGVwXG4gKiBAY2hhaW5hYmxlXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfSB0aW1lIGhpZ2ggcmVzb2x1dGlvbiB0aW1lc3RhbXAgdXNlZCBmb3IgaW52b2tpbmcgdGhlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgYHVwZGF0ZWAgbWV0aG9kIG9uIGFsbCByZWdpc3RlcmVkIG9iamVjdHNcbiAqIEByZXR1cm4ge0Nsb2NrfSAgICAgICB0aGlzXG4gKi9cbkNsb2NrLnByb3RvdHlwZS5zdGVwID0gZnVuY3Rpb24gc3RlcCAodGltZSkge1xuICAgIHRoaXMuX2ZyYW1lKys7XG5cbiAgICB0aGlzLl9zY2FsZWRUaW1lID0gdGhpcy5fc2NhbGVkVGltZSArICh0aW1lIC0gdGhpcy5fdGltZSkqdGhpcy5fc2NhbGU7XG4gICAgdGhpcy5fdGltZSA9IHRpbWU7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3RpbWVyUXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuX3RpbWVyUXVldWVbaV0odGhpcy5fc2NhbGVkVGltZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX3RpbWVyUXVldWUuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpbnRlcm5hbCBjbG9jayB0aW1lLlxuICpcbiAqIEBtZXRob2QgIG5vd1xuICpcbiAqIEByZXR1cm4gIHtOdW1iZXJ9IHRpbWUgaGlnaCByZXNvbHV0aW9uIHRpbWVzdGFtcCB1c2VkIGZvciBpbnZva2luZyB0aGVcbiAqICAgICAgICAgICAgICAgICAgICAgICBgdXBkYXRlYCBtZXRob2Qgb24gYWxsIHJlZ2lzdGVyZWQgb2JqZWN0c1xuICovXG5DbG9jay5wcm90b3R5cGUubm93ID0gZnVuY3Rpb24gbm93ICgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2NhbGVkVGltZTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgaW50ZXJuYWwgY2xvY2sgdGltZS5cbiAqXG4gKiBAbWV0aG9kICBnZXRUaW1lXG4gKiBAZGVwcmVjYXRlZCBVc2UgI25vdyBpbnN0ZWFkXG4gKlxuICogQHJldHVybiAge051bWJlcn0gdGltZSBoaWdoIHJlc29sdXRpb24gdGltZXN0YW1wIHVzZWQgZm9yIGludm9raW5nIHRoZVxuICogICAgICAgICAgICAgICAgICAgICAgIGB1cGRhdGVgIG1ldGhvZCBvbiBhbGwgcmVnaXN0ZXJlZCBvYmplY3RzXG4gKi9cbkNsb2NrLnByb3RvdHlwZS5nZXRUaW1lID0gQ2xvY2sucHJvdG90eXBlLm5vdztcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZnJhbWVzIGVsYXBzZWQgc28gZmFyLlxuICpcbiAqIEBtZXRob2QgZ2V0RnJhbWVcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IGZyYW1lc1xuICovXG5DbG9jay5wcm90b3R5cGUuZ2V0RnJhbWUgPSBmdW5jdGlvbiBnZXRGcmFtZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZyYW1lO1xufTtcblxuLyoqXG4gKiBXcmFwcyBhIGZ1bmN0aW9uIHRvIGJlIGludm9rZWQgYWZ0ZXIgYSBjZXJ0YWluIGFtb3VudCBvZiB0aW1lLlxuICogQWZ0ZXIgYSBzZXQgZHVyYXRpb24gaGFzIHBhc3NlZCwgaXQgZXhlY3V0ZXMgdGhlIGZ1bmN0aW9uIGFuZFxuICogcmVtb3ZlcyBpdCBhcyBhIGxpc3RlbmVyIHRvICdwcmVyZW5kZXInLlxuICpcbiAqIEBtZXRob2Qgc2V0VGltZW91dFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIHJ1biBhZnRlciBhIHNwZWNpZmllZCBkdXJhdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IGRlbGF5IG1pbGxpc2Vjb25kcyBmcm9tIG5vdyB0byBleGVjdXRlIHRoZSBmdW5jdGlvblxuICpcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aW1lciBmdW5jdGlvbiB1c2VkIGZvciBDbG9jayNjbGVhclRpbWVyXG4gKi9cbkNsb2NrLnByb3RvdHlwZS5zZXRUaW1lb3V0ID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBkZWxheSkge1xuICAgIHZhciBwYXJhbXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBzdGFydGVkQXQgPSB0aGlzLl90aW1lO1xuICAgIHZhciB0aW1lciA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICAgICAgaWYgKHRpbWUgLSBzdGFydGVkQXQgPj0gZGVsYXkpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KG51bGwsIHBhcmFtcyk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICB0aGlzLl90aW1lclF1ZXVlLnB1c2godGltZXIpO1xuICAgIHJldHVybiB0aW1lcjtcbn07XG5cblxuLyoqXG4gKiBXcmFwcyBhIGZ1bmN0aW9uIHRvIGJlIGludm9rZWQgYWZ0ZXIgYSBjZXJ0YWluIGFtb3VudCBvZiB0aW1lLlxuICogIEFmdGVyIGEgc2V0IGR1cmF0aW9uIGhhcyBwYXNzZWQsIGl0IGV4ZWN1dGVzIHRoZSBmdW5jdGlvbiBhbmRcbiAqICByZXNldHMgdGhlIGV4ZWN1dGlvbiB0aW1lLlxuICpcbiAqIEBtZXRob2Qgc2V0SW50ZXJ2YWxcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBydW4gYWZ0ZXIgYSBzcGVjaWZpZWQgZHVyYXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheSBpbnRlcnZhbCB0byBleGVjdXRlIGZ1bmN0aW9uIGluIG1pbGxpc2Vjb25kc1xuICpcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aW1lciBmdW5jdGlvbiB1c2VkIGZvciBDbG9jayNjbGVhclRpbWVyXG4gKi9cbkNsb2NrLnByb3RvdHlwZS5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uIHNldEludGVydmFsKGNhbGxiYWNrLCBkZWxheSkge1xuICAgIHZhciBwYXJhbXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBzdGFydGVkQXQgPSB0aGlzLl90aW1lO1xuICAgIHZhciB0aW1lciA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICAgICAgaWYgKHRpbWUgLSBzdGFydGVkQXQgPj0gZGVsYXkpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KG51bGwsIHBhcmFtcyk7XG4gICAgICAgICAgICBzdGFydGVkQXQgPSB0aW1lO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIHRoaXMuX3RpbWVyUXVldWUucHVzaCh0aW1lcik7XG4gICAgcmV0dXJuIHRpbWVyO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHByZXZpb3VzbHkgdmlhIGBDbG9jayNzZXRUaW1lb3V0YCBvciBgQ2xvY2sjc2V0SW50ZXJ2YWxgXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKlxuICogQG1ldGhvZCBjbGVhclRpbWVyXG4gKiBAY2hhaW5hYmxlXG4gKlxuICogQHBhcmFtICB7RnVuY3Rpb259IHRpbWVyICBwcmV2aW91c2x5IGJ5IGBDbG9jayNzZXRUaW1lb3V0YCBvclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgQ2xvY2sjc2V0SW50ZXJ2YWxgIHJldHVybmVkIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKiBAcmV0dXJuIHtDbG9ja30gICAgICAgICAgICAgIHRoaXNcbiAqL1xuQ2xvY2sucHJvdG90eXBlLmNsZWFyVGltZXIgPSBmdW5jdGlvbiAodGltZXIpIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLl90aW1lclF1ZXVlLmluZGV4T2YodGltZXIpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5fdGltZXJRdWV1ZS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xvY2s7XG4iLCJ2YXIgQ2xvY2sgPSByZXF1aXJlKCcuL0Nsb2NrJyk7XG5cbnZhciBFbmdpbmUgPSBmdW5jdGlvbigpe1xuICAgIHRoaXMuX2Nsb2NrID0gbmV3IENsb2NrKCk7XG4gICAgdGhpcy5fd29ya2VyID0gbnVsbDtcbn1cblxuRW5naW5lLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24od29ya2VyKXtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcbiAgICBpZih3b3JrZXIpe1xuICAgICAgICB0aGlzLl93b3JrZXIgPSB3b3JrZXI7XG4gICAgfVxufVxuXG5FbmdpbmUucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbih0aW1lKXtcblxuICAgIHRoaXMuX2Nsb2NrLnN0ZXAodGltZSk7XG4gICAgdGhpcy50aW1lID0gdGhpcy5fY2xvY2subm93KCk7XG5cbiAgICBpZih0aGlzLl93b3JrZXIpe1xuICAgICAgICB0aGlzLl93b3JrZXIucG9zdE1lc3NhZ2Uoe2ZyYW1lOnRoaXMudGltZX0pO1xuICAgIH1cblxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xuXG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpbnN0YW5jZSBvZiBjbG9jayB1c2VkIGJ5IHRoZSBGYW1vdXNFbmdpbmUuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge0Nsb2NrfSBFbmdpbmUncyBjbG9ja1xuICovXG5FbmdpbmUucHJvdG90eXBlLmdldENsb2NrID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nsb2NrO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRW5naW5lKCk7XG4iLCJ2YXIgTm9kZSA9IGZ1bmN0aW9uKGNvbmYpe1xuICAgIGlmKGNvbmYpe1xuICAgICAgICB0aGlzLnNldFByb3BlcnRpZXMoY29uZik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXREZWZhdWx0cygpO1xuICAgIH1cbn1cblxuTm9kZS5wcm90b3R5cGUuc2V0RGVmYXVsdHMgPSBmdW5jdGlvbihjb25mKXtcbiAgICB0aGlzLnBvc2l0aW9uID0gWzAsMCwwXTtcbiAgICB0aGlzLm9yaWdpbiA9IFswLjAsMC4wLDAuMF07XG4gICAgdGhpcy5hbGlnbiA9IFswLjAsMC4wLDAuMF07XG4gICAgdGhpcy5zaXplID0gWzAsMCwwXTtcbiAgICB0aGlzLm9wYWNpdHkgPSAxLjA7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRQcm9wZXJ0aWVzID0gZnVuY3Rpb24oY29uZil7XG4gICAgdGhpcy5wb3NpdGlvbiA9IGNvbmYucG9zaXRpb24gfHwgWzAsMCwwXTtcbiAgICB0aGlzLm9yaWdpbiA9IGNvbmYub3JpZ2luIHx8IFswLjAsMC4wLDAuMF07XG4gICAgdGhpcy5hbGlnbiA9IGNvbmYuYWxpZ24gfHwgWzAuMCwwLjAsMC4wXTtcbiAgICB0aGlzLnNpemUgPSBjb25mLnNpemUgfHwgWzAsMCwwXTtcbiAgICB0aGlzLm9wYWNpdHkgPSBjb25mLm9wYWNpdHkgfHwgMS4wO1xufTtcblxuTm9kZS5wcm90b3R5cGUuZ2V0UHJvcGVydGllcyA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcG9zaXRpb246IHRoaXMucG9zaXRpb24sXG4gICAgICAgIG9yaWdpbjogdGhpcy5vcmlnaW4sXG4gICAgICAgIGFsaWduOiB0aGlzLmFsaWduLFxuICAgICAgICBzaXplOiB0aGlzLnNpemUsXG4gICAgICAgIG9wYWNpdHk6IHRoaXMub3BhY2l0eVxuICAgIH1cbn07XG5cbk5vZGUucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24ocG9zKXtcbiAgICB0aGlzLnBvc2l0aW9uID0gcG9zO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb247XG59XG5cbk5vZGUucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbihzaXplKXtcbiAgICB0aGlzLnNpemUgPSBzaXplO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5nZXRTaXplID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy5zaXplO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5zZXRPcmlnaW4gPSBmdW5jdGlvbihvcmlnaW4pe1xuICAgIHRoaXMub3JpZ2luID0gb3JpZ2luO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5nZXRPcmlnaW4gPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzLm9yaWdpbjtcbn1cblxuTm9kZS5wcm90b3R5cGUuc2V0QWxpZ24gPSBmdW5jdGlvbihhbGlnbil7XG4gICAgdGhpcy5hbGlnbiA9IGFsaWduO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5nZXRBbGlnbiA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMuYWxpZ247XG59XG5cbk5vZGUucHJvdG90eXBlLnNldE9wYWNpdHkgPSBmdW5jdGlvbihvcGFjaXR5KXtcbiAgICB0aGlzLm9wYWNpdHkgPSBvcGFjaXR5O1xufVxuXG5Ob2RlLnByb3RvdHlwZS5nZXRPcGFjaXR5ID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy5vcGFjaXR5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5vZGU7XG4iLCJ2YXIgU2NlbmUgPSBmdW5jdGlvbihncmFwaCl7XG4gICAgdGhpcy5ncmFwaCA9IGdyYXBoIHx8IHt9O1xuICAgIHRoaXMubGVuZ3RoID0gMDtcbn1cblxuU2NlbmUucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24obm9kZSl7XG4gICAgdGhpcy5sZW5ndGgrKztcbiAgICBub2RlLmlkID0gJ2lkLScrdGhpcy5sZW5ndGg7XG4gICAgdGhpcy5ncmFwaFtub2RlLmlkXSA9IG5vZGU7XG59XG5cblxuU2NlbmUucHJvdG90eXBlLmZldGNoTm9kZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhcGhbaWRdO1xufVxuXG5TY2VuZS5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uKHF1ZXJ5KSB7XG4gICAgdmFyIHF1ZXJ5QXJyYXkgPSBbXTtcbiAgICBmb3IocSBpbiBxdWVyeSl7XG4gICAgICAgIGZvcihwcm9wIGluIHRoaXMuZ3JhcGgpIHtcbiAgICAgICAgICAgIGZvcihwIGluIHRoaXMuZ3JhcGhbcHJvcF0pe1xuICAgICAgICAgICAgICAgIGlmIChwID09PSBxICYmIHRoaXMuZ3JhcGhbcHJvcF1bcF0gPT09IHF1ZXJ5W3FdKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5QXJyYXkucHVzaCh0aGlzLmdyYXBoW3Byb3BdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHF1ZXJ5QXJyYXk7XG59XG5cblNjZW5lLnByb3RvdHlwZS5maW5kT25lID0gZnVuY3Rpb24ocXVlcnkpIHtcblxuICAgIGZvcihxIGluIHF1ZXJ5KXtcbiAgICAgICAgZm9yKHByb3AgaW4gdGhpcy5ncmFwaCkge1xuICAgICAgICAgICAgZm9yKHAgaW4gdGhpcy5ncmFwaFtwcm9wXSl7XG4gICAgICAgICAgICAgICAgaWYgKHAgPT09IHEgJiYgdGhpcy5ncmFwaFtwcm9wXVtwXSA9PT0gcXVlcnlbcV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ3JhcGhbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59XG5cblNjZW5lLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0aWNrKXtcbiAgICAvL2NvbnNvbGUubG9nKHRpY2spO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBTY2VuZSgpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgQ2xvY2s6IHJlcXVpcmUoJy4vQ2xvY2snKSxcbiAgICBFbmdpbmU6IHJlcXVpcmUoJy4vRW5naW5lJyksXG4gICAgU2NlbmU6IHJlcXVpcmUoJy4vU2NlbmUnKSxcbiAgICBOb2RlOiByZXF1aXJlKCcuL05vZGUnKVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNvcmU6IHJlcXVpcmUoJy4vY29yZScpLFxuICAgIHRyYW5zaXRpb25zOiByZXF1aXJlKCcuL3RyYW5zaXRpb25zJylcbn07XG4iLCIvKipcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBGYW1vdXMgSW5kdXN0cmllcyBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKmpzaGludCAtVzAwOCAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSBsaWJyYXJ5IG9mIGN1cnZlcyB3aGljaCBtYXAgYW4gYW5pbWF0aW9uIGV4cGxpY2l0bHkgYXMgYSBmdW5jdGlvbiBvZiB0aW1lLlxuICpcbiAqIEBuYW1lc3BhY2VcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGxpbmVhclxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZWFzZUluXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBlYXNlT3V0XG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBlYXNlSW5PdXRcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGVhc2VPdXRCb3VuY2VcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IHNwcmluZ1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5RdWFkXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBvdXRRdWFkXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbk91dFF1YWRcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluQ3ViaWNcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IG91dEN1YmljXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbk91dEN1YmljXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpblF1YXJ0XG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBvdXRRdWFydFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5PdXRRdWFydFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5RdWludFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gb3V0UXVpbnRcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluT3V0UXVpbnRcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluU2luZVxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gb3V0U2luZVxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5PdXRTaW5lXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbkV4cG9cbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IG91dEV4cG9cbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluT3V0RXhwXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbkNpcmNcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IG91dENpcmNcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluT3V0Q2lyY1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5FbGFzdGljXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBvdXRFbGFzdGljXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbk91dEVsYXN0aWNcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluQm91bmNlXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBvdXRCb3VuY2VcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluT3V0Qm91bmNlXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBmbGF0ICAgICAgICAgICAgLSBVc2VmdWwgZm9yIGRlbGF5aW5nIHRoZSBleGVjdXRpb24gb2ZcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEgc3Vic2VxdWVudCB0cmFuc2l0aW9uLlxuICovXG52YXIgQ3VydmVzID0ge1xuICAgIGxpbmVhcjogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9LFxuXG4gICAgZWFzZUluOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiB0KnQ7XG4gICAgfSxcblxuICAgIGVhc2VPdXQ6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHQqKDItdCk7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dDogZnVuY3Rpb24odCkge1xuICAgICAgICBpZiAodCA8PSAwLjUpIHJldHVybiAyKnQqdDtcbiAgICAgICAgZWxzZSByZXR1cm4gLTIqdCp0ICsgNCp0IC0gMTtcbiAgICB9LFxuXG4gICAgZWFzZU91dEJvdW5jZTogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdCooMyAtIDIqdCk7XG4gICAgfSxcblxuICAgIHNwcmluZzogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gKDEgLSB0KSAqIE1hdGguc2luKDYgKiBNYXRoLlBJICogdCkgKyB0O1xuICAgIH0sXG5cbiAgICBpblF1YWQ6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHQqdDtcbiAgICB9LFxuXG4gICAgb3V0UXVhZDogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gLSh0LT0xKSp0KzE7XG4gICAgfSxcblxuICAgIGluT3V0UXVhZDogZnVuY3Rpb24odCkge1xuICAgICAgICBpZiAoKHQvPS41KSA8IDEpIHJldHVybiAuNSp0KnQ7XG4gICAgICAgIHJldHVybiAtLjUqKCgtLXQpKih0LTIpIC0gMSk7XG4gICAgfSxcblxuICAgIGluQ3ViaWM6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHQqdCp0O1xuICAgIH0sXG5cbiAgICBvdXRDdWJpYzogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gKCgtLXQpKnQqdCArIDEpO1xuICAgIH0sXG5cbiAgICBpbk91dEN1YmljOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIGlmICgodC89LjUpIDwgMSkgcmV0dXJuIC41KnQqdCp0O1xuICAgICAgICByZXR1cm4gLjUqKCh0LT0yKSp0KnQgKyAyKTtcbiAgICB9LFxuXG4gICAgaW5RdWFydDogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdCp0KnQqdDtcbiAgICB9LFxuXG4gICAgb3V0UXVhcnQ6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIC0oKC0tdCkqdCp0KnQgLSAxKTtcbiAgICB9LFxuXG4gICAgaW5PdXRRdWFydDogZnVuY3Rpb24odCkge1xuICAgICAgICBpZiAoKHQvPS41KSA8IDEpIHJldHVybiAuNSp0KnQqdCp0O1xuICAgICAgICByZXR1cm4gLS41ICogKCh0LT0yKSp0KnQqdCAtIDIpO1xuICAgIH0sXG5cbiAgICBpblF1aW50OiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiB0KnQqdCp0KnQ7XG4gICAgfSxcblxuICAgIG91dFF1aW50OiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAoKC0tdCkqdCp0KnQqdCArIDEpO1xuICAgIH0sXG5cbiAgICBpbk91dFF1aW50OiBmdW5jdGlvbih0KSB7XG4gICAgICAgIGlmICgodC89LjUpIDwgMSkgcmV0dXJuIC41KnQqdCp0KnQqdDtcbiAgICAgICAgcmV0dXJuIC41KigodC09MikqdCp0KnQqdCArIDIpO1xuICAgIH0sXG5cbiAgICBpblNpbmU6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIC0xLjAqTWF0aC5jb3ModCAqIChNYXRoLlBJLzIpKSArIDEuMDtcbiAgICB9LFxuXG4gICAgb3V0U2luZTogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zaW4odCAqIChNYXRoLlBJLzIpKTtcbiAgICB9LFxuXG4gICAgaW5PdXRTaW5lOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAtLjUqKE1hdGguY29zKE1hdGguUEkqdCkgLSAxKTtcbiAgICB9LFxuXG4gICAgaW5FeHBvOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAodD09PTApID8gMC4wIDogTWF0aC5wb3coMiwgMTAgKiAodCAtIDEpKTtcbiAgICB9LFxuXG4gICAgb3V0RXhwbzogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gKHQ9PT0xLjApID8gMS4wIDogKC1NYXRoLnBvdygyLCAtMTAgKiB0KSArIDEpO1xuICAgIH0sXG5cbiAgICBpbk91dEV4cG86IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgaWYgKHQ9PT0wKSByZXR1cm4gMC4wO1xuICAgICAgICBpZiAodD09PTEuMCkgcmV0dXJuIDEuMDtcbiAgICAgICAgaWYgKCh0Lz0uNSkgPCAxKSByZXR1cm4gLjUgKiBNYXRoLnBvdygyLCAxMCAqICh0IC0gMSkpO1xuICAgICAgICByZXR1cm4gLjUgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tdCkgKyAyKTtcbiAgICB9LFxuXG4gICAgaW5DaXJjOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAtKE1hdGguc3FydCgxIC0gdCp0KSAtIDEpO1xuICAgIH0sXG5cbiAgICBvdXRDaXJjOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoMSAtICgtLXQpKnQpO1xuICAgIH0sXG5cbiAgICBpbk91dENpcmM6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgaWYgKCh0Lz0uNSkgPCAxKSByZXR1cm4gLS41ICogKE1hdGguc3FydCgxIC0gdCp0KSAtIDEpO1xuICAgICAgICByZXR1cm4gLjUgKiAoTWF0aC5zcXJ0KDEgLSAodC09MikqdCkgKyAxKTtcbiAgICB9LFxuXG4gICAgaW5FbGFzdGljOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHZhciBzPTEuNzAxNTg7dmFyIHA9MDt2YXIgYT0xLjA7XG4gICAgICAgIGlmICh0PT09MCkgcmV0dXJuIDAuMDsgIGlmICh0PT09MSkgcmV0dXJuIDEuMDsgIGlmICghcCkgcD0uMztcbiAgICAgICAgcyA9IHAvKDIqTWF0aC5QSSkgKiBNYXRoLmFzaW4oMS4wL2EpO1xuICAgICAgICByZXR1cm4gLShhKk1hdGgucG93KDIsMTAqKHQtPTEpKSAqIE1hdGguc2luKCh0LXMpKigyKk1hdGguUEkpLyBwKSk7XG4gICAgfSxcblxuICAgIG91dEVsYXN0aWM6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgdmFyIHM9MS43MDE1ODt2YXIgcD0wO3ZhciBhPTEuMDtcbiAgICAgICAgaWYgKHQ9PT0wKSByZXR1cm4gMC4wOyAgaWYgKHQ9PT0xKSByZXR1cm4gMS4wOyAgaWYgKCFwKSBwPS4zO1xuICAgICAgICBzID0gcC8oMipNYXRoLlBJKSAqIE1hdGguYXNpbigxLjAvYSk7XG4gICAgICAgIHJldHVybiBhKk1hdGgucG93KDIsLTEwKnQpICogTWF0aC5zaW4oKHQtcykqKDIqTWF0aC5QSSkvcCkgKyAxLjA7XG4gICAgfSxcblxuICAgIGluT3V0RWxhc3RpYzogZnVuY3Rpb24odCkge1xuICAgICAgICB2YXIgcz0xLjcwMTU4O3ZhciBwPTA7dmFyIGE9MS4wO1xuICAgICAgICBpZiAodD09PTApIHJldHVybiAwLjA7ICBpZiAoKHQvPS41KT09PTIpIHJldHVybiAxLjA7ICBpZiAoIXApIHA9KC4zKjEuNSk7XG4gICAgICAgIHMgPSBwLygyKk1hdGguUEkpICogTWF0aC5hc2luKDEuMC9hKTtcbiAgICAgICAgaWYgKHQgPCAxKSByZXR1cm4gLS41KihhKk1hdGgucG93KDIsMTAqKHQtPTEpKSAqIE1hdGguc2luKCh0LXMpKigyKk1hdGguUEkpL3ApKTtcbiAgICAgICAgcmV0dXJuIGEqTWF0aC5wb3coMiwtMTAqKHQtPTEpKSAqIE1hdGguc2luKCh0LXMpKigyKk1hdGguUEkpL3ApKi41ICsgMS4wO1xuICAgIH0sXG5cbiAgICBpbkJhY2s6IGZ1bmN0aW9uKHQsIHMpIHtcbiAgICAgICAgaWYgKHMgPT09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XG4gICAgICAgIHJldHVybiB0KnQqKChzKzEpKnQgLSBzKTtcbiAgICB9LFxuXG4gICAgb3V0QmFjazogZnVuY3Rpb24odCwgcykge1xuICAgICAgICBpZiAocyA9PT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODtcbiAgICAgICAgcmV0dXJuICgoLS10KSp0KigocysxKSp0ICsgcykgKyAxKTtcbiAgICB9LFxuXG4gICAgaW5PdXRCYWNrOiBmdW5jdGlvbih0LCBzKSB7XG4gICAgICAgIGlmIChzID09PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xuICAgICAgICBpZiAoKHQvPS41KSA8IDEpIHJldHVybiAuNSoodCp0KigoKHMqPSgxLjUyNSkpKzEpKnQgLSBzKSk7XG4gICAgICAgIHJldHVybiAuNSooKHQtPTIpKnQqKCgocyo9KDEuNTI1KSkrMSkqdCArIHMpICsgMik7XG4gICAgfSxcblxuICAgIGluQm91bmNlOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAxLjAgLSBDdXJ2ZXMub3V0Qm91bmNlKDEuMC10KTtcbiAgICB9LFxuXG4gICAgb3V0Qm91bmNlOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIGlmICh0IDwgKDEvMi43NSkpIHtcbiAgICAgICAgICAgIHJldHVybiAoNy41NjI1KnQqdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodCA8ICgyLzIuNzUpKSB7XG4gICAgICAgICAgICByZXR1cm4gKDcuNTYyNSoodC09KDEuNS8yLjc1KSkqdCArIC43NSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodCA8ICgyLjUvMi43NSkpIHtcbiAgICAgICAgICAgIHJldHVybiAoNy41NjI1Kih0LT0oMi4yNS8yLjc1KSkqdCArIC45Mzc1KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoNy41NjI1Kih0LT0oMi42MjUvMi43NSkpKnQgKyAuOTg0Mzc1KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbk91dEJvdW5jZTogZnVuY3Rpb24odCkge1xuICAgICAgICBpZiAodCA8IC41KSByZXR1cm4gQ3VydmVzLmluQm91bmNlKHQqMikgKiAuNTtcbiAgICAgICAgcmV0dXJuIEN1cnZlcy5vdXRCb3VuY2UodCoyLTEuMCkgKiAuNSArIC41O1xuICAgIH0sXG5cbiAgICBmbGF0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDdXJ2ZXM7XG4iLCIvKipcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBGYW1vdXMgSW5kdXN0cmllcyBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBDdXJ2ZXMgPSByZXF1aXJlKCcuL0N1cnZlcycpO1xudmFyIEVuZ2luZSA9IHJlcXVpcmUoJy4uL2NvcmUvRW5naW5lJyk7XG5cbi8qKlxuICogQSBzdGF0ZSBtYWludGFpbmVyIGZvciBhIHNtb290aCB0cmFuc2l0aW9uIGJldHdlZW5cbiAqICAgIG51bWVyaWNhbGx5LXNwZWNpZmllZCBzdGF0ZXMuIEV4YW1wbGUgbnVtZXJpYyBzdGF0ZXMgaW5jbHVkZSBmbG9hdHMgYW5kXG4gKiAgICBhcnJheXMgb2YgZmxvYXRzIG9iamVjdHMuXG4gKlxuICogQW4gaW5pdGlhbCBzdGF0ZSBpcyBzZXQgd2l0aCB0aGUgY29uc3RydWN0b3Igb3IgdXNpbmdcbiAqICAgICB7QGxpbmsgVHJhbnNpdGlvbmFibGUjZnJvbX0uIFN1YnNlcXVlbnQgdHJhbnNpdGlvbnMgY29uc2lzdCBvZiBhblxuICogICAgIGludGVybWVkaWF0ZSBzdGF0ZSwgZWFzaW5nIGN1cnZlLCBkdXJhdGlvbiBhbmQgY2FsbGJhY2suIFRoZSBmaW5hbCBzdGF0ZVxuICogICAgIG9mIGVhY2ggdHJhbnNpdGlvbiBpcyB0aGUgaW5pdGlhbCBzdGF0ZSBvZiB0aGUgc3Vic2VxdWVudCBvbmUuIENhbGxzIHRvXG4gKiAgICAge0BsaW5rIFRyYW5zaXRpb25hYmxlI2dldH0gcHJvdmlkZSB0aGUgaW50ZXJwb2xhdGVkIHN0YXRlIGFsb25nIHRoZSB3YXkuXG4gKlxuICogTm90ZSB0aGF0IHRoZXJlIGlzIG5vIGV2ZW50IGxvb3AgaGVyZSAtIGNhbGxzIHRvIHtAbGluayBUcmFuc2l0aW9uYWJsZSNnZXR9XG4gKiAgICBhcmUgdGhlIG9ubHkgd2F5IHRvIGZpbmQgc3RhdGUgcHJvamVjdGVkIHRvIHRoZSBjdXJyZW50IChvciBwcm92aWRlZClcbiAqICAgIHRpbWUgYW5kIGFyZSB0aGUgb25seSB3YXkgdG8gdHJpZ2dlciBjYWxsYmFja3MgYW5kIG11dGF0ZSB0aGUgaW50ZXJuYWxcbiAqICAgIHRyYW5zaXRpb24gcXVldWUuXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciB0ID0gbmV3IFRyYW5zaXRpb25hYmxlKFswLCAwXSk7XG4gKiB0XG4gKiAgICAgLnRvKFsxMDAsIDBdLCAnbGluZWFyJywgMTAwMClcbiAqICAgICAuZGVsYXkoMTAwMClcbiAqICAgICAudG8oWzIwMCwgMF0sICdvdXRCb3VuY2UnLCAxMDAwKTtcbiAqXG4gKiB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gKiBkaXYuc3R5bGUuYmFja2dyb3VuZCA9ICdibHVlJztcbiAqIGRpdi5zdHlsZS53aWR0aCA9ICcxMDBweCc7XG4gKiBkaXYuc3R5bGUuaGVpZ2h0ID0gJzEwMHB4JztcbiAqIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAqXG4gKiBkaXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAqICAgICB0LmlzUGF1c2VkKCkgPyB0LnJlc3VtZSgpIDogdC5wYXVzZSgpO1xuICogfSk7XG4gKlxuICogcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uIGxvb3AoKSB7XG4gKiAgICAgZGl2LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKCcgKyB0LmdldCgpWzBdICsgJ3B4KScgKyAnIHRyYW5zbGF0ZVkoJyArIHQuZ2V0KClbMV0gKyAncHgpJztcbiAqICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gKiB9KTtcbiAqXG4gKiBAY2xhc3MgVHJhbnNpdGlvbmFibGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtOdW1iZXJ8QXJyYXkuTnVtYmVyfSBpbml0aWFsU3RhdGUgICAgaW5pdGlhbCBzdGF0ZSB0byB0cmFuc2l0aW9uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIC0gZXF1aXZhbGVudCB0byBhIHB1cnN1YW50XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZvY2F0aW9uIG9mXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7QGxpbmsgVHJhbnNpdGlvbmFibGUjZnJvbX1cbiAqL1xuZnVuY3Rpb24gVHJhbnNpdGlvbmFibGUoaW5pdGlhbFN0YXRlKSB7XG4gICAgdGhpcy5fcXVldWUgPSBbXTtcbiAgICB0aGlzLl9mcm9tID0gbnVsbDtcbiAgICB0aGlzLl9zdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5fc3RhcnRlZEF0ID0gbnVsbDtcbiAgICB0aGlzLl9wYXVzZWRBdCA9IG51bGw7XG4gICAgaWYgKGluaXRpYWxTdGF0ZSAhPSBudWxsKSB0aGlzLmZyb20oaW5pdGlhbFN0YXRlKTtcbn1cblxuLyoqXG4gKiBJbnRlcm5hbCBDbG9jayB1c2VkIGZvciBkZXRlcm1pbmluZyB0aGUgY3VycmVudCB0aW1lIGZvciB0aGUgb25nb2luZ1xuICogdHJhbnNpdGlvbnMuXG4gKlxuICogQHR5cGUge1BlcmZvcm1hbmNlfERhdGV8Q2xvY2t9XG4gKi9cblxuVHJhbnNpdGlvbmFibGUuQ2xvY2sgPSBFbmdpbmUuZ2V0Q2xvY2soKTtcblxuLyoqXG4gKiBSZWdpc3RlcnMgYSB0cmFuc2l0aW9uIHRvIGJlIHB1c2hlZCBvbnRvIHRoZSBpbnRlcm5hbCBxdWV1ZS5cbiAqXG4gKiBAbWV0aG9kIHRvXG4gKiBAY2hhaW5hYmxlXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfEFycmF5Lk51bWJlcn0gICAgZmluYWxTdGF0ZSAgICAgICAgICAgICAgZmluYWwgc3RhdGUgdG9cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRvbiB0b1xuICogQHBhcmFtICB7U3RyaW5nfEZ1bmN0aW9ufSAgICAgICAgW2N1cnZlPUN1cnZlcy5saW5lYXJdICAgZWFzaW5nIGZ1bmN0aW9uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VkIGZvclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwb2xhdGluZ1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWzAsIDFdXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbZHVyYXRpb249MTAwXSAgICAgICAgICBkdXJhdGlvbiBvZlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvblxuICogQHBhcmFtICB7RnVuY3Rpb259ICAgICAgICAgICAgICAgW2NhbGxiYWNrXSAgICAgICAgICAgICAgY2FsbGJhY2sgZnVuY3Rpb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGJlIGNhbGxlZCBhZnRlclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHRyYW5zaXRpb24gaXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgICAgICAgICBbbWV0aG9kXSAgICAgICAgICAgICAgICBtZXRob2QgdXNlZCBmb3JcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVycG9sYXRpb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlLmcuIHNsZXJwKVxuICogQHJldHVybiB7VHJhbnNpdGlvbmFibGV9ICAgICAgICAgdGhpc1xuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUudG8gPSBmdW5jdGlvbiB0byhmaW5hbFN0YXRlLCBjdXJ2ZSwgZHVyYXRpb24sIGNhbGxiYWNrLCBtZXRob2QpIHtcbiAgICBjdXJ2ZSA9IGN1cnZlICE9IG51bGwgJiYgY3VydmUuY29uc3RydWN0b3IgPT09IFN0cmluZyA/IEN1cnZlc1tjdXJ2ZV0gOiBjdXJ2ZTtcbiAgICBpZiAodGhpcy5fcXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX3N0YXJ0ZWRBdCA9IHRoaXMuY29uc3RydWN0b3IuQ2xvY2subm93KCk7XG4gICAgICAgIHRoaXMuX3BhdXNlZEF0ID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5fcXVldWUucHVzaChcbiAgICAgICAgZmluYWxTdGF0ZSxcbiAgICAgICAgY3VydmUgIT0gbnVsbCA/IGN1cnZlIDogQ3VydmVzLmxpbmVhcixcbiAgICAgICAgZHVyYXRpb24gIT0gbnVsbCA/IGR1cmF0aW9uIDogMTAwLFxuICAgICAgICBjYWxsYmFjayxcbiAgICAgICAgbWV0aG9kXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVzZXRzIHRoZSB0cmFuc2l0aW9uIHF1ZXVlIHRvIGEgc3RhYmxlIGluaXRpYWwgc3RhdGUuXG4gKlxuICogQG1ldGhvZCBmcm9tXG4gKiBAY2hhaW5hYmxlXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfEFycmF5Lk51bWJlcn0gICAgaW5pdGlhbFN0YXRlICAgIGluaXRpYWwgc3RhdGUgdG9cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uIGZyb21cbiAqIEByZXR1cm4ge1RyYW5zaXRpb25hYmxlfSAgICAgICAgIHRoaXNcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLmZyb20gPSBmdW5jdGlvbiBmcm9tKGluaXRpYWxTdGF0ZSkge1xuICAgIHRoaXMuX3N0YXRlID0gaW5pdGlhbFN0YXRlO1xuICAgIHRoaXMuX2Zyb20gPSB0aGlzLl9zeW5jKG51bGwsIHRoaXMuX3N0YXRlKTtcbiAgICB0aGlzLl9xdWV1ZS5sZW5ndGggPSAwO1xuICAgIHRoaXMuX3N0YXJ0ZWRBdCA9IHRoaXMuY29uc3RydWN0b3IuQ2xvY2subm93KCk7XG4gICAgdGhpcy5fcGF1c2VkQXQgPSBudWxsO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBEZWxheXMgdGhlIGV4ZWN1dGlvbiBvZiB0aGUgc3Vic2VxdWVudCB0cmFuc2l0aW9uIGZvciBhIGNlcnRhaW4gcGVyaW9kIG9mXG4gKiB0aW1lLlxuICpcbiAqIEBtZXRob2QgZGVsYXlcbiAqIEBjaGFpbmFibGVcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gICAgICBkdXJhdGlvbiAgICBkZWxheSB0aW1lIGluIG1zXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICBbY2FsbGJhY2tdICBaZXJvLWFyZ3VtZW50IGZ1bmN0aW9uIHRvIGNhbGwgb24gb2JzZXJ2ZWRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb24gKHQ9MSlcbiAqIEByZXR1cm4ge1RyYW5zaXRpb25hYmxlfSAgICAgICAgIHRoaXNcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLmRlbGF5ID0gZnVuY3Rpb24gZGVsYXkoZHVyYXRpb24sIGNhbGxiYWNrKSB7XG4gICAgdmFyIGVuZFN0YXRlID0gdGhpcy5fcXVldWUubGVuZ3RoID4gMCA/IHRoaXMuX3F1ZXVlW3RoaXMuX3F1ZXVlLmxlbmd0aCAtIDVdIDogdGhpcy5fc3RhdGU7XG4gICAgcmV0dXJuIHRoaXMudG8oZW5kU3RhdGUsIEN1cnZlcy5mbGF0LCBkdXJhdGlvbiwgY2FsbGJhY2spO1xufTtcblxuLyoqXG4gKiBPdmVycmlkZXMgY3VycmVudCB0cmFuc2l0aW9uLlxuICpcbiAqIEBtZXRob2Qgb3ZlcnJpZGVcbiAqIEBjaGFpbmFibGVcbiAqXG4gKiBAcGFyYW0gIHtOdW1iZXJ8QXJyYXkuTnVtYmVyfSAgICBbZmluYWxTdGF0ZV0gICAgZmluYWwgc3RhdGUgdG8gdHJhbnNpdG9uIHRvXG4gKiBAcGFyYW0gIHtTdHJpbmd8RnVuY3Rpb259ICAgICAgICBbY3VydmVdICAgICAgICAgZWFzaW5nIGZ1bmN0aW9uIHVzZWQgZm9yXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwb2xhdGluZyBbMCwgMV1cbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgICAgICAgIFtkdXJhdGlvbl0gICAgICBkdXJhdGlvbiBvZiB0cmFuc2l0aW9uXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgICAgICAgICAgICBbY2FsbGJhY2tdICAgICAgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsZWQgYWZ0ZXIgdGhlIHRyYW5zaXRpb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcyBjb21wbGV0ZVxuICogQHBhcmFtIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgW21ldGhvZF0gICAgICAgIG9wdGlvbmFsIG1ldGhvZCB1c2VkIGZvclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVycG9sYXRpbmcgYmV0d2VlbiB0aGVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMuIFNldCB0byBgc2xlcnBgIGZvclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwaGVyaWNhbCBsaW5lYXJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnBvbGF0aW9uLlxuICogQHJldHVybiB7VHJhbnNpdGlvbmFibGV9ICAgICAgICAgdGhpc1xuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUub3ZlcnJpZGUgPSBmdW5jdGlvbiBvdmVycmlkZShmaW5hbFN0YXRlLCBjdXJ2ZSwgZHVyYXRpb24sIGNhbGxiYWNrLCBtZXRob2QpIHtcbiAgICBpZiAodGhpcy5fcXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoZmluYWxTdGF0ZSAhPSBudWxsKSB0aGlzLl9xdWV1ZVswXSA9IGZpbmFsU3RhdGU7XG4gICAgICAgIGlmIChjdXJ2ZSAhPSBudWxsKSAgICAgIHRoaXMuX3F1ZXVlWzFdID0gY3VydmUuY29uc3RydWN0b3IgPT09IFN0cmluZyA/IEN1cnZlc1tjdXJ2ZV0gOiBjdXJ2ZTtcbiAgICAgICAgaWYgKGR1cmF0aW9uICE9IG51bGwpICAgdGhpcy5fcXVldWVbMl0gPSBkdXJhdGlvbjtcbiAgICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpICAgdGhpcy5fcXVldWVbM10gPSBjYWxsYmFjaztcbiAgICAgICAgaWYgKG1ldGhvZCAhPSBudWxsKSAgICAgdGhpcy5fcXVldWVbNF0gPSBtZXRob2Q7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFVzZWQgZm9yIGludGVycG9sYXRpbmcgYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCBzdGF0ZSBvZiB0aGUgY3VycmVudGx5XG4gKiBydW5uaW5nIHRyYW5zaXRpb25cbiAqXG4gKiBAbWV0aG9kICBfaW50ZXJwb2xhdGVcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fEFycmF5fE51bWJlcn0gb3V0cHV0ICAgICBXaGVyZSB0byB3cml0ZSB0byAoaW4gb3JkZXIgdG8gYXZvaWRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0IGFsbG9jYXRpb24gYW5kIHRoZXJlZm9yZSBHQykuXG4gKiBAcGFyYW0gIHtPYmplY3R8QXJyYXl8TnVtYmVyfSBmcm9tICAgICAgIFN0YXJ0IHN0YXRlIG9mIGN1cnJlbnQgdHJhbnNpdGlvbi5cbiAqIEBwYXJhbSAge09iamVjdHxBcnJheXxOdW1iZXJ9IHRvICAgICAgICAgRW5kIHN0YXRlIG9mIGN1cnJlbnQgdHJhbnNpdGlvbi5cbiAqIEBwYXJhbSAge051bWJlcn0gcHJvZ3Jlc3MgICAgICAgICAgICAgICAgUHJvZ3Jlc3Mgb2YgdGhlIGN1cnJlbnQgdHJhbnNpdGlvbixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW4gWzAsIDFdXG4gKiBAcGFyYW0gIHtTdHJpbmd9IG1ldGhvZCAgICAgICAgICAgICAgICAgIE1ldGhvZCB1c2VkIGZvciBpbnRlcnBvbGF0aW9uIChlLmcuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsZXJwKVxuICogQHJldHVybiB7T2JqZWN0fEFycmF5fE51bWJlcn0gICAgICAgICAgICBvdXRwdXRcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLl9pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uIF9pbnRlcnBvbGF0ZShvdXRwdXQsIGZyb20sIHRvLCBwcm9ncmVzcywgbWV0aG9kKSB7XG4gICAgaWYgKHRvIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09ICdzbGVycCcpIHtcbiAgICAgICAgICAgIHZhciB4LCB5LCB6LCB3O1xuICAgICAgICAgICAgdmFyIHF4LCBxeSwgcXosIHF3O1xuICAgICAgICAgICAgdmFyIG9tZWdhLCBjb3NvbWVnYSwgc2lub21lZ2EsIHNjYWxlRnJvbSwgc2NhbGVUbztcblxuICAgICAgICAgICAgeCA9IGZyb21bMF07XG4gICAgICAgICAgICB5ID0gZnJvbVsxXTtcbiAgICAgICAgICAgIHogPSBmcm9tWzJdO1xuICAgICAgICAgICAgdyA9IGZyb21bM107XG5cbiAgICAgICAgICAgIHF4ID0gdG9bMF07XG4gICAgICAgICAgICBxeSA9IHRvWzFdO1xuICAgICAgICAgICAgcXogPSB0b1syXTtcbiAgICAgICAgICAgIHF3ID0gdG9bM107XG5cbiAgICAgICAgICAgIGlmIChwcm9ncmVzcyA9PT0gMSkge1xuICAgICAgICAgICAgICAgIG91dHB1dFswXSA9IHF4O1xuICAgICAgICAgICAgICAgIG91dHB1dFsxXSA9IHF5O1xuICAgICAgICAgICAgICAgIG91dHB1dFsyXSA9IHF6O1xuICAgICAgICAgICAgICAgIG91dHB1dFszXSA9IHF3O1xuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvc29tZWdhID0gdyAqIHF3ICsgeCAqIHF4ICsgeSAqIHF5ICsgeiAqIHF6O1xuICAgICAgICAgICAgaWYgKCgxLjAgLSBjb3NvbWVnYSkgPiAxZS01KSB7XG4gICAgICAgICAgICAgICAgb21lZ2EgPSBNYXRoLmFjb3MoY29zb21lZ2EpO1xuICAgICAgICAgICAgICAgIHNpbm9tZWdhID0gTWF0aC5zaW4ob21lZ2EpO1xuICAgICAgICAgICAgICAgIHNjYWxlRnJvbSA9IE1hdGguc2luKCgxLjAgLSBwcm9ncmVzcykgKiBvbWVnYSkgLyBzaW5vbWVnYTtcbiAgICAgICAgICAgICAgICBzY2FsZVRvID0gTWF0aC5zaW4ocHJvZ3Jlc3MgKiBvbWVnYSkgLyBzaW5vbWVnYTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNjYWxlRnJvbSA9IDEuMCAtIHByb2dyZXNzO1xuICAgICAgICAgICAgICAgIHNjYWxlVG8gPSBwcm9ncmVzcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3V0cHV0WzBdID0geCAqIHNjYWxlRnJvbSArIHF4ICogc2NhbGVUbztcbiAgICAgICAgICAgIG91dHB1dFsxXSA9IHkgKiBzY2FsZUZyb20gKyBxeSAqIHNjYWxlVG87XG4gICAgICAgICAgICBvdXRwdXRbMl0gPSB6ICogc2NhbGVGcm9tICsgcXogKiBzY2FsZVRvO1xuICAgICAgICAgICAgb3V0cHV0WzNdID0gdyAqIHNjYWxlRnJvbSArIHF3ICogc2NhbGVUbztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0byBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdG8ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRbaV0gPSB0aGlzLl9pbnRlcnBvbGF0ZShvdXRwdXRbaV0sIGZyb21baV0sIHRvW2ldLCBwcm9ncmVzcywgbWV0aG9kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0bykge1xuICAgICAgICAgICAgICAgIG91dHB1dFtrZXldID0gdGhpcy5faW50ZXJwb2xhdGUob3V0cHV0W2tleV0sIGZyb21ba2V5XSwgdG9ba2V5XSwgcHJvZ3Jlc3MsIG1ldGhvZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IGZyb20gKyBwcm9ncmVzcyAqICh0byAtIGZyb20pO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuXG4vKipcbiAqIEludGVybmFsIGhlbHBlciBtZXRob2QgdXNlZCBmb3Igc3luY2hyb25pemluZyB0aGUgY3VycmVudCwgYWJzb2x1dGUgc3RhdGUgb2ZcbiAqIGEgdHJhbnNpdGlvbiB0byBhIGdpdmVuIG91dHB1dCBhcnJheSwgb2JqZWN0IGxpdGVyYWwgb3IgbnVtYmVyLiBTdXBwb3J0c1xuICogbmVzdGVkIHN0YXRlIG9iamVjdHMgYnkgdGhyb3VnaCByZWN1cnNpb24uXG4gKlxuICogQG1ldGhvZCAgX3N5bmNcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfEFycmF5fE9iamVjdH0gb3V0cHV0ICAgICBXaGVyZSB0byB3cml0ZSB0byAoaW4gb3JkZXIgdG8gYXZvaWRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0IGFsbG9jYXRpb24gYW5kIHRoZXJlZm9yZSBHQykuXG4gKiBAcGFyYW0gIHtOdW1iZXJ8QXJyYXl8T2JqZWN0fSBpbnB1dCAgICAgIElucHV0IHN0YXRlIHRvIHByb3h5IG9udG8gdGhlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5cbiAqIEByZXR1cm4ge051bWJlcnxBcnJheXxPYmplY3R9IG91dHB1dCAgICAgUGFzc2VkIGluIG91dHB1dCBvYmplY3QuXG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5fc3luYyA9IGZ1bmN0aW9uIF9zeW5jKG91dHB1dCwgaW5wdXQpIHtcbiAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJykgb3V0cHV0ID0gaW5wdXQ7XG4gICAgZWxzZSBpZiAoaW5wdXQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBpZiAob3V0cHV0ID09IG51bGwpIG91dHB1dCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gaW5wdXQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIG91dHB1dFtpXSA9IF9zeW5jKG91dHB1dFtpXSwgaW5wdXRbaV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGlucHV0IGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgIGlmIChvdXRwdXQgPT0gbnVsbCkgb3V0cHV0ID0ge307XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBpbnB1dCkge1xuICAgICAgICAgICAgb3V0cHV0W2tleV0gPSBfc3luYyhvdXRwdXRba2V5XSwgaW5wdXRba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogR2V0IGludGVycG9sYXRlZCBzdGF0ZSBvZiBjdXJyZW50IGFjdGlvbiBhdCBwcm92aWRlZCB0aW1lLiBJZiB0aGUgbGFzdFxuICogICAgYWN0aW9uIGhhcyBjb21wbGV0ZWQsIGludm9rZSBpdHMgY2FsbGJhY2suXG4gKlxuICogQG1ldGhvZCBnZXRcbiAqXG4gKiBAcGFyYW0ge051bWJlcj19IHQgICAgICAgICAgICAgICBFdmFsdWF0ZSB0aGUgY3VydmUgYXQgYSBub3JtYWxpemVkIHZlcnNpb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mIHRoaXMgdGltZS4gSWYgb21pdHRlZCwgdXNlIGN1cnJlbnQgdGltZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKFVuaXggZXBvY2ggdGltZSByZXRyaWV2ZWQgZnJvbSBDbG9jaykuXG4gKiBAcmV0dXJuIHtOdW1iZXJ8QXJyYXkuTnVtYmVyfSAgICBCZWdpbm5pbmcgc3RhdGUgaW50ZXJwb2xhdGVkIHRvIHRoaXMgcG9pbnRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIHRpbWUuXG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQodCkge1xuICAgIGlmICh0aGlzLl9xdWV1ZS5sZW5ndGggPT09IDApIHJldHVybiB0aGlzLl9zdGF0ZTtcblxuICAgIHQgPSB0aGlzLl9wYXVzZWRBdCA/IHRoaXMuX3BhdXNlZEF0IDogdDtcbiAgICB0ID0gdCA/IHQgOiB0aGlzLmNvbnN0cnVjdG9yLkNsb2NrLm5vdygpO1xuXG4gICAgdmFyIHByb2dyZXNzID0gKHQgLSB0aGlzLl9zdGFydGVkQXQpIC8gdGhpcy5fcXVldWVbMl07XG4gICAgdGhpcy5fc3RhdGUgPSB0aGlzLl9pbnRlcnBvbGF0ZShcbiAgICAgICAgdGhpcy5fc3RhdGUsXG4gICAgICAgIHRoaXMuX2Zyb20sXG4gICAgICAgIHRoaXMuX3F1ZXVlWzBdLFxuICAgICAgICB0aGlzLl9xdWV1ZVsxXShwcm9ncmVzcyA+IDEgPyAxIDogcHJvZ3Jlc3MpLFxuICAgICAgICB0aGlzLl9xdWV1ZVs0XVxuICAgICk7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fc3RhdGU7XG4gICAgaWYgKHByb2dyZXNzID49IDEpIHtcbiAgICAgICAgdGhpcy5fc3RhcnRlZEF0ID0gdGhpcy5fc3RhcnRlZEF0ICsgdGhpcy5fcXVldWVbMl07XG4gICAgICAgIHRoaXMuX2Zyb20gPSB0aGlzLl9zeW5jKHRoaXMuX2Zyb20sIHRoaXMuX3N0YXRlKTtcbiAgICAgICAgdGhpcy5fcXVldWUuc2hpZnQoKTtcbiAgICAgICAgdGhpcy5fcXVldWUuc2hpZnQoKTtcbiAgICAgICAgdGhpcy5fcXVldWUuc2hpZnQoKTtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGhpcy5fcXVldWUuc2hpZnQoKTtcbiAgICAgICAgdGhpcy5fcXVldWUuc2hpZnQoKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgIH1cbiAgICByZXR1cm4gcHJvZ3Jlc3MgPiAxID8gdGhpcy5nZXQoKSA6IHN0YXRlO1xufTtcblxuLyoqXG4gKiBJcyB0aGVyZSBhdCBsZWFzdCBvbmUgdHJhbnNpdGlvbiBwZW5kaW5nIGNvbXBsZXRpb24/XG4gKlxuICogQG1ldGhvZCBpc0FjdGl2ZVxuICpcbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgIEJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSBwZW5kaW5nXG4gKiAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLiBQYXVzZWQgdHJhbnNpdGlvbnMgYXJlIHN0aWxsIGJlaW5nXG4gKiAgICAgICAgICAgICAgICAgICAgICBjb25zaWRlcmVkIGFjdGl2ZS5cbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLmlzQWN0aXZlID0gZnVuY3Rpb24gaXNBY3RpdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXVlLmxlbmd0aCA+IDA7XG59O1xuXG4vKipcbiAqIEhhbHQgdHJhbnNpdGlvbiBhdCBjdXJyZW50IHN0YXRlIGFuZCBlcmFzZSBhbGwgcGVuZGluZyBhY3Rpb25zLlxuICpcbiAqIEBtZXRob2QgaGFsdFxuICogQGNoYWluYWJsZVxuICpcbiAqIEByZXR1cm4ge1RyYW5zaXRpb25hYmxlfSB0aGlzXG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5oYWx0ID0gZnVuY3Rpb24gaGFsdCgpIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tKHRoaXMuZ2V0KCkpO1xufTtcblxuLyoqXG4gKiBQYXVzZSB0cmFuc2l0aW9uLiBUaGlzIHdpbGwgbm90IGVyYXNlIGFueSBhY3Rpb25zLlxuICpcbiAqIEBtZXRob2QgcGF1c2VcbiAqIEBjaGFpbmFibGVcbiAqXG4gKiBAcmV0dXJuIHtUcmFuc2l0aW9uYWJsZX0gdGhpc1xuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiBwYXVzZSgpIHtcbiAgICB0aGlzLl9wYXVzZWRBdCA9IHRoaXMuY29uc3RydWN0b3IuQ2xvY2subm93KCk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEhhcyB0aGUgY3VycmVudCBhY3Rpb24gYmVlbiBwYXVzZWQ/XG4gKlxuICogQG1ldGhvZCBpc1BhdXNlZFxuICogQGNoYWluYWJsZVxuICpcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGlmIHRoZSBjdXJyZW50IGFjdGlvbiBoYXMgYmVlbiBwYXVzZWRcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLmlzUGF1c2VkID0gZnVuY3Rpb24gaXNQYXVzZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fcGF1c2VkQXQ7XG59O1xuXG4vKipcbiAqIFJlc3VtZSBhIHByZXZpb3VzbHkgcGF1c2VkIHRyYW5zaXRpb24uXG4gKlxuICogQG1ldGhvZCByZXN1bWVcbiAqIEBjaGFpbmFibGVcbiAqXG4gKiBAcmV0dXJuIHtUcmFuc2l0aW9uYWJsZX0gdGhpc1xuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24gcmVzdW1lKCkge1xuICAgIHZhciBkaWZmID0gdGhpcy5fcGF1c2VkQXQgLSB0aGlzLl9zdGFydGVkQXQ7XG4gICAgdGhpcy5fc3RhcnRlZEF0ID0gdGhpcy5jb25zdHJ1Y3Rvci5DbG9jay5ub3coKSAtIGRpZmY7XG4gICAgdGhpcy5fcGF1c2VkQXQgPSBudWxsO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDYW5jZWwgYWxsIHRyYW5zaXRpb25zIGFuZCByZXNldCB0byBhIHN0YWJsZSBzdGF0ZVxuICpcbiAqIEBtZXRob2QgcmVzZXRcbiAqIEBjaGFpbmFibGVcbiAqIEBkZXByZWNhdGVkIFVzZSBgLmZyb21gIGluc3RlYWQhXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ8QXJyYXkuTnVtYmVyfE9iamVjdC48bnVtYmVyLCBudW1iZXI+fSBzdGFydFxuICogICAgc3RhYmxlIHN0YXRlIHRvIHNldCB0b1xuICogQHJldHVybiB7VHJhbnNpdGlvbmFibGV9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzXG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbShzdGFydCk7XG59O1xuXG4vKipcbiAqIEFkZCB0cmFuc2l0aW9uIHRvIGVuZCBzdGF0ZSB0byB0aGUgcXVldWUgb2YgcGVuZGluZyB0cmFuc2l0aW9ucy4gU3BlY2lhbFxuICogICAgVXNlOiBjYWxsaW5nIHdpdGhvdXQgYSB0cmFuc2l0aW9uIHJlc2V0cyB0aGUgb2JqZWN0IHRvIHRoYXQgc3RhdGUgd2l0aFxuICogICAgbm8gcGVuZGluZyBhY3Rpb25zXG4gKlxuICogQG1ldGhvZCBzZXRcbiAqIEBjaGFpbmFibGVcbiAqIEBkZXByZWNhdGVkIFVzZSBgLnRvYCBpbnN0ZWFkIVxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfEZhbW91c0VuZ2luZU1hdHJpeHxBcnJheS5OdW1iZXJ8T2JqZWN0LjxudW1iZXIsIG51bWJlcj59IHN0YXRlXG4gKiAgICBlbmQgc3RhdGUgdG8gd2hpY2ggd2UgaW50ZXJwb2xhdGVcbiAqIEBwYXJhbSB7dHJhbnNpdGlvbj19IHRyYW5zaXRpb24gb2JqZWN0IG9mIHR5cGUge2R1cmF0aW9uOiBudW1iZXIsIGN1cnZlOlxuICogICAgZlswLDFdIC0+IFswLDFdIG9yIG5hbWV9LiBJZiB0cmFuc2l0aW9uIGlzIG9taXR0ZWQsIGNoYW5nZSB3aWxsIGJlXG4gKiAgICBpbnN0YW50YW5lb3VzLlxuICogQHBhcmFtIHtmdW5jdGlvbigpPX0gY2FsbGJhY2sgWmVyby1hcmd1bWVudCBmdW5jdGlvbiB0byBjYWxsIG9uIG9ic2VydmVkXG4gKiAgICBjb21wbGV0aW9uICh0PTEpXG4gKiBAcmV0dXJuIHtUcmFuc2l0aW9uYWJsZX0gdGhpc1xuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oc3RhdGUsIHRyYW5zaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRyYW5zaXRpb24gPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmZyb20oc3RhdGUpO1xuICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLnRvKHN0YXRlLCB0cmFuc2l0aW9uLmN1cnZlLCB0cmFuc2l0aW9uLmR1cmF0aW9uLCBjYWxsYmFjaywgdHJhbnNpdGlvbi5tZXRob2QpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNpdGlvbmFibGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBDdXJ2ZXM6IHJlcXVpcmUoJy4vQ3VydmVzJyksXG4gICAgVHJhbnNpdGlvbmFibGU6IHJlcXVpcmUoJy4vVHJhbnNpdGlvbmFibGUnKVxufTtcbiJdfQ==
