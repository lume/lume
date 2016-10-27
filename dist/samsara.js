(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Samsara"] = factory();
	else
		root["Samsara"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    module.exports = {
	        Core: __webpack_require__(1),
	        DOM: __webpack_require__(35),
	        Events: __webpack_require__(42),
	        Inputs: __webpack_require__(43),
	        Layouts: __webpack_require__(53),
	        Streams: __webpack_require__(63),
	        Camera: __webpack_require__(64)
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    module.exports = {
	        Engine: __webpack_require__(2),
	        Timer: __webpack_require__(10),
	        Transform: __webpack_require__(9),
	        Transitionable: __webpack_require__(11),
	        View: __webpack_require__(25)
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */
	// TODO: cancel RAF when asleep
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(3);
	    var postTickQueue = __webpack_require__(5);
	    var preTickQueue = __webpack_require__(6);
	    var dirtyQueue = __webpack_require__(7);
	    var tickQueue = __webpack_require__(8);
	    var Transform = __webpack_require__(9);
	    var Timer = __webpack_require__(10);

	    var rafId = Number.NaN;
	    var isMobile = /mobi/i.test(window.navigator.userAgent);
	    var orientation = Number.NaN;
	    var windowWidth = Number.NaN;
	    var windowHeight = Number.NaN;

	    // Listen to window resize events
	    window.addEventListener('resize', handleResize, false);

	    /**
	     * Engine is a singleton object that is required to run a Samsara application.
	     *  It is the "heartbeat" of the application, managing the batching of streams
	     *  and creating `RootNodes` and `Contexts` to begin render trees.
	     *
	     *  It also listens and can respond to DOM events on the HTML `<body>` tag
	     *  and `window` object. For instance the `resize` event.
	     *
	     * @class Engine
	     * @namespace Core
	     * @static
	     * @private
	     * @uses Core.EventHandler
	     */
	    var Engine = {};

	    /*
	    * Emitter for resize events when window resizes
	    */
	    Engine.size = new EventHandler();

	    /*
	     * Emitter for layout events when RAF loop starts
	     */
	    Engine.layout = new EventHandler();

	    /**
	     * Updates by a single frame of the application by looping through all function queues.
	     *  This is repeatedly called within a requestAnimationFrame loop until the application
	     *  is receiving no layout changes. At this point the requestAnimationFrame will be
	     *  canceled until the next change.
	     *
	     * @private
	     * @method step
	     */
	    Engine.step = function step() {
	        // browser events and their handlers happen before rendering begins
	        while (preTickQueue.length) (preTickQueue.shift())();

	        for (var i = 0; i < tickQueue.length; i++) tickQueue[i]();

	        // post tick is for resolving larger components from their incoming signals
	        while (postTickQueue.length) (postTickQueue.shift())();

	        while (dirtyQueue.length) (dirtyQueue.shift())();
	    };

	    /**
	     * Initiate the Engine's request animation frame loop.
	     *
	     * @method start
	     * @static
	     */
	    Engine.start = function start() {
	        Engine.step();
	        rafId = window.requestAnimationFrame(start);
	    };

	    /**
	     * Stop the Engine's request animation frame loop.
	     *
	     * @method stop
	     * @static
	     */
	    Engine.stop = function() {
	        window.cancelAnimationFrame(rafId);
	        rafId = Number.NaN;
	    };

	    function firstStart(){
	        preTickQueue.push(handleResize);
	        preTickQueue.push(handleLayout);
	        if (isNaN(rafId)) Engine.start();
	    }

	    /**
	     * Subscribe context to resize events and start the render loop if not running
	     *
	     * @method registerContext
	     * @static
	     */
	    Engine.registerContext = function(context) {
	        context._size.subscribe(Engine.size);
	        context._layout.subscribe(Engine.layout);

	        if (window.Promise) window.Promise.resolve().then(firstStart);
	        else window.requestAnimationFrame(firstStart);
	    };

	    /**
	     * Unsubscribe context from resize events
	     *
	     * @method deregisterContext
	     * @static
	     */
	    Engine.deregisterContext = function(context){
	        context._size.unsubscribe(Engine.size);
	        context._layout.unsubscribe(Engine.layout);
	    };

	    var isResizing = false;
	    var resizeDebounceTime = 150; // introduce lag to detect resize end event. see https://github.com/dmvaldman/samsara/issues/49

	    var resizeEnd = Timer.debounce(function() {
	        dirtyQueue.push(function(){
	            Engine.size.emit('end', 'end');
	            isResizing = false;
	        });
	    }, resizeDebounceTime);

	    // Emit a resize event if the window's height or width has changed
	    function handleResize() {
	        var newHeight = window.innerHeight;
	        var newWidth = window.innerWidth;

	        if (isMobile) {
	            var newOrientation = newHeight > newWidth;
	            // if width hasn't changed, this indicated "split-screen" view on some iOS devices,
	            // which should trigger a `resize` event
	            if (orientation === newOrientation && newWidth === windowWidth)
	                return false;

	            orientation = newOrientation;

	            // Landscape/Portrait resize events are discrete on mobile
	            // so don't fire updates
	            Engine.size.emit('start');
	            dirtyQueue.push(function(){
	                Engine.size.emit('end', 'end');
	            });
	        }
	        else {
	            if (newWidth === windowWidth && newHeight === windowHeight)
	                return false;

	            windowWidth = newWidth;
	            windowHeight = newHeight;

	            if (!isResizing){
	                Engine.size.emit('start');
	                isResizing = true;
	                resizeEnd();
	            }
	            else {
	                postTickQueue.push(function(){
	                    Engine.size.emit('update');
	                    resizeEnd();
	                });
	            }
	        }
	    }

	    var layoutSpec = {
	        transform : Transform.identity,
	        opacity : 1,
	        origin : null,
	        align : null,
	        nextSizeTransform : Transform.identity
	    };

	    function handleLayout(){
	        Engine.layout.trigger('start', layoutSpec);
	        dirtyQueue.push(function(){
	            Engine.layout.trigger('end', layoutSpec);
	        });
	    }

	    module.exports = Engine;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventEmitter = __webpack_require__(4);

	    /**
	     * EventHandler extends EventEmitter to provide subscription methods.
	     *  It also includes helper methods on the constructor for setting up Controllers and Views
	     *  with input and output emitters.
	     *
	     *  @example
	     *
	     *      var eventHandlerA = new EventHandler();
	     *      var eventHandlerB = new EventHandler();
	     *
	     *      eventHandlerB.subscribe(eventHandlerA);
	     *
	     *      eventHandlerB.on('name', function(payload){
	     *          console.log(payload) // {data : 0}
	     *      });
	     *
	     *      eventHandlerA.emit('name', {data : 0});
	     *
	     * @class EventHandler
	     * @namespace Events
	     * @extends Events.EventEmitter
	     * @constructor
	     */
	    function EventHandler() {
	        EventEmitter.apply(this, arguments);

	        this.upstream = []; // upstream event handlers
	        this.upstreamListeners = {}; // upstream listeners
	    }

	    EventHandler.prototype = Object.create(EventEmitter.prototype);
	    EventHandler.prototype.constructor = EventHandler;

	    /**
	     * Constructor helper method. Assign an event handler to receive an object's input events.
	     *  Defines `trigger`, `subscribe` and `unsubscribe` methods on the class instance.
	     *
	     * @method setInputHandler
	     * @static
	     * @param object {Object}           Class instance
	     * @param handler {EventHandler}    EventHandler representing an input source
	     */
	    EventHandler.setInputHandler = function setInputHandler(object, handler) {
	        object.trigger = handler.trigger.bind(handler);
	        object.subscribe = handler.subscribe.bind(handler);
	        object.unsubscribe = handler.unsubscribe.bind(handler);
	    };

	    /**
	     * Constructor helper method. Assign an event handler to emit an object's output events.
	     *  Defines `emit`, `on` and `off` methods on the class instance.
	     *
	     * @method setOutputHandler
	     * @static
	     * @param object {Object}           Object to provide on, off and emit methods
	     * @param handler {EventHandler}    Handler assigned event handler
	     */
	    EventHandler.setOutputHandler = function setOutputHandler(object, handler) {
	        handler.bindThis(object);
	        object.emit = handler.emit.bind(handler);
	        object.on = handler.on.bind(handler);
	        object.off = handler.off.bind(handler);
	    };

	    /**
	     * Adds a handler to the `type` channel which will be executed on `emit`.
	     *  Extends EventEmitter's `on` method.
	     *
	     * @method on
	     * @param type {String}             Event channel name
	     * @param handler {Function}        Handler
	     */
	    EventHandler.prototype.on = function on(type, handler) {
	        EventEmitter.prototype.on.apply(this, arguments);
	        if (!(type in this.upstreamListeners)) {
	            var upstreamListener = this.trigger.bind(this, type);
	            this.upstreamListeners[type] = upstreamListener;
	            for (var i = 0; i < this.upstream.length; i++) {
	                this.upstream[i].on(type, upstreamListener);
	            }
	        }
	    };

	    /**
	     * Removes the handler from the `type` channel.
	     *  If a handler is not specified or if there are no remaining handlers of the `type`,
	     *  the EventHandler removes itself from the upstream sources.
	     *
	     * @method off
	     * @param type {String}           Event channel name
	     * @param [handler] {Function}    Handler
	     */
	    EventHandler.prototype.off = function off(type, handler) {
	        var empty = EventEmitter.prototype.off.apply(this, arguments);
	        if (empty && this.upstreamListeners[type]) {
	            var oldUpstreamListener = this.upstreamListeners[type];
	            delete this.upstreamListeners[type];
	            for (var i = 0; i < this.upstream.length; i++) {
	                this.upstream[i].off(type, oldUpstreamListener);
	            }
	        }
	    };

	    /**
	     * Listen for events from an an upstream source.
	     *
	     * @method subscribe
	     * @param source {EventEmitter} Event source
	     */
	    EventHandler.prototype.subscribe = function subscribe(source) {
	        var index = this.upstream.indexOf(source);
	        if (index < 0) {
	            this.upstream.push(source);
	            for (var type in this.upstreamListeners) {
	                source.on(type, this.upstreamListeners[type]);
	            }
	        }
	        return source;
	    };

	    /**
	     * Stop listening to events from an upstream source.
	     *  Undoes work of `subscribe`.
	     *
	     *  If no source is provided, all subscribed sources are unsubscribed from.
	     *
	     * @method unsubscribe
	     * @param [source] {EventEmitter} Event source
	     */
	    EventHandler.prototype.unsubscribe = function unsubscribe(source) {
	        if (!source) {
	            for (var i = 0; i < this.upstream.length; i++)
	                this.unsubscribe(this.upstream[i]);
	        }
	        else {
	            var index = this.upstream.indexOf(source);
	            if (index >= 0) {
	                this.upstream.splice(index, 1);
	                for (var type in this.upstreamListeners) {
	                    source.off(type, this.upstreamListeners[type]);
	                }
	            }
	        }
	    };

	    module.exports = EventHandler;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    /**
	     * EventEmitter represents an asynchronous channel for broadcasting and receiving events.
	     *
	     * @example
	     *
	     *      var eventEmitter = new EventEmitter();
	     *
	     *      eventEmitter.on('send', function(payload){
	     *          console.log(payload) // {data : 0}
	     *      });
	     *
	     *      // sometime later...
	     *      eventEmitter.emit('send', {data : 0});
	     *
	     * @class EventEmitter
	     * @namespace Events
	     * @constructor
	     */
	    function EventEmitter() {
	        this.listeners = {};
	        this._owner = this;
	    }

	    /**
	     * Broadcast an event on the `type` channel with an optional payload. This will call the handlers
	     *  of all EventEmitters listening on the `type` channel with the (optional) data payload
	     *  as its argument.
	     *
	     * @method emit
	     *
	     * @param type {String}     Channel name
	     * @param data {Object}     Payload
	     */
	    EventEmitter.prototype.emit = function emit(type, data) {
	        if (data === false) return; // do not propagate
	        var handlers = this.listeners[type];
	        if (handlers) {
	            for (var i = 0; i < handlers.length; i++)
	                handlers[i].call(this._owner, data);
	        }
	    };

	    /**
	     * Alias for emit.
	     *
	     * @method trigger
	     */
	    EventEmitter.prototype.trigger = EventEmitter.prototype.emit;

	    /**
	     * Adds a handler to the `type` channel which will be executed on `emit`.
	     *
	     * @method on
	     * @param type {String}         Channel name
	     * @param handler {Function}    Callback
	     */
	    EventEmitter.prototype.on = function on(type, handler) {
	        if (!(type in this.listeners)) this.listeners[type] = [];
	        this.listeners[type].push(handler);
	    };

	    /**
	     * Behaves like `EventEmitter.prototype.on`, except the handler is only executed once.
	     *
	     * @method once
	     * @param type {String}         Channel name (e.g., 'click')
	     * @param handler {Function}    Callback
	     */
	    EventEmitter.prototype.once = function once(type, handler){
	        var onceHandler = function(){
	            EventEmitter.prototype.off.call(this._owner, type, onceHandler);
	            handler.apply(this._owner, arguments);
	        }.bind(this);
	        this.on(type, onceHandler);
	    };

	    /**
	     * Removes the `handler` from the `type` channel. This undoes the work of `on`.
	     *  If no type is provided, then all event listeners are removed.
	     *  If a type is provided but no handler, then all listeners of that type are removed.
	     *  If no handlers are left for the specified type returns true, otherwise false.
	     *
	     * @method off
	     * @param [type] {String}         Channel name
	     * @param [handler] {Function}    Callback
	     */
	    EventEmitter.prototype.off = function off(type, handler) {
	        if (!type) {
	            this.listeners = {};
	            return true;
	        }

	        var listener = this.listeners[type];
	        if (listener !== undefined) {
	            if (!handler) this.listeners[type] = []; // remove all listeners of given type
	            else {
	                var index = listener.indexOf(handler);
	                if (index >= 0) listener.splice(index, 1);
	            }
	        }
	        return this.listeners[type].length === 0;
	    };

	    /**
	     * A convenience method to bind the provided object to all added handlers.
	     *
	     * @method bindThis
	     * @param owner {Object}        Bound `this` context
	     */
	    EventEmitter.prototype.bindThis = function bindThis(owner) {
	        this._owner = owner;
	    };

	    module.exports = EventEmitter;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    /**
	     * Queue that batches `update` events.
	     *  This queue is traversed after the `preTickQueue` but before `dirtQueue`
	     *  by the Engine.
	     *
	     *  @private
	     */

	    module.exports = [];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    /**
	     * Queue that batches `start` events.
	     *  This queue is traversed first (but after DOM events are executed) by the Engine.
	     *
	     *  @private
	     */

	    module.exports = [];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    /**
	     * Queue that batches `end` and `dirty` events.
	     *  This queue is traversed after the `postTickQueue` by the Engine.
	     *
	     *  @private
	     */

	    module.exports = [];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    /**
	     * This queue is executed before the postTickQueue and after the preTickQueue.
	     *  however, it differs in that the Engine does not clear the queue.
	     *  This must be done manually.
	     *
	     *  @private
	     */

	    module.exports = [];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     * A library for creating and composing CSS3 matrix transforms.
	     *  A Transform is a 16 element float array `t = [t0, ..., t15]`
	     *  that corresponds to a 4x4 transformation matrix (in row-major order)
	     *
	     *  ```
	     *    ┌               ┐
	     *    │ t0  t1  t2  0 │
	     *    │ t4  t5  t6  0 │
	     *    │ t8  t9  t10 0 │
	     *    │ t12 t13 t14 1 │
	     *    └               ┘
	     *  ```
	     *
	     *  This matrix is a data structure encoding a combination of translation,
	     *  scale, skew and rotation components.
	     *
	     *  Note: these matrices are transposes from their mathematical counterparts.
	     *
	     *  @example
	     *
	     *      var layoutNode = var LayoutNode({
	     *          transform : Transform.translate([100,200,50])
	     *      });
	     *
	     *  @example
	     *
	     *      var transitionable = new Transitionable(0);
	     *
	     *      var transform = transitionable.map(function(value){
	     *          return Transform.scaleX(value);
	     *      });
	     *
	     *      var layoutNode = var LayoutNode({
	     *          transform : transform
	     *      });
	     *
	     *      transitionable.set(100, {duration : 500});
	     *
	     * @class Transform
	     * @static
	     */
	    var Transform = {};

	    /**
	     * Identity transform.
	     *
	     * @property identity {Array}
	     * @static
	     * @final
	     */
	    Transform.identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

	    //TODO: why do inFront/behind need to translate by >1 to overcome DOM order?
	    /**
	     * Transform for moving a renderable in front of another renderable in the z-direction.
	     *
	     * @property inFront {Array}
	     * @static
	     * @final
	     */
	    Transform.inFront = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1.001, 1];

	    /**
	     * Transform for moving a renderable behind another renderable in the z-direction.
	     *
	     * @property behind {Array}
	     * @static
	     * @final
	     */
	    Transform.behind = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1.001, 1];

	    /**
	     * Compose Transform arrays via matrix multiplication.
	     *
	     * @method compose
	     * @static
	     * @param t1 {Transform} Left Transform
	     * @param t2 {Transform} Right Transform
	     * @return {Array}
	     */
	    Transform.compose = function multiply(t1, t2) {
	        if (t1 === Transform.identity) return t2.slice();
	        if (t2 === Transform.identity) return t1.slice();
	        return [
	            t1[0] * t2[0] + t1[4] * t2[1] + t1[8] * t2[2],
	            t1[1] * t2[0] + t1[5] * t2[1] + t1[9] * t2[2],
	            t1[2] * t2[0] + t1[6] * t2[1] + t1[10] * t2[2],
	            0,
	            t1[0] * t2[4] + t1[4] * t2[5] + t1[8] * t2[6],
	            t1[1] * t2[4] + t1[5] * t2[5] + t1[9] * t2[6],
	            t1[2] * t2[4] + t1[6] * t2[5] + t1[10] * t2[6],
	            0,
	            t1[0] * t2[8] + t1[4] * t2[9] + t1[8] * t2[10],
	            t1[1] * t2[8] + t1[5] * t2[9] + t1[9] * t2[10],
	            t1[2] * t2[8] + t1[6] * t2[9] + t1[10] * t2[10],
	            0,
	            t1[0] * t2[12] + t1[4] * t2[13] + t1[8] * t2[14] + t1[12],
	            t1[1] * t2[12] + t1[5] * t2[13] + t1[9] * t2[14] + t1[13],
	            t1[2] * t2[12] + t1[6] * t2[13] + t1[10] * t2[14] + t1[14],
	            1
	        ];
	    };

	    /**
	     * Convenience method to Compose several Transform arrays.
	     *
	     * @method composeMany
	     * @static
	     * @param {...Transform}    Transform arrays
	     * @return {Array}
	     */
	    Transform.composeMany = function composeMany(){
	        if (arguments.length > 2){
	            var first = arguments[0];
	            var second = arguments[1];
	            Array.prototype.shift.call(arguments);
	            arguments[0] = Transform.compose(first, second);
	            return Transform.composeMany.apply(null, arguments);
	        }
	        else return Transform.compose.apply(null, arguments);
	    };

	    /**
	     * Translate a Transform after the Transform is applied.
	     *
	     * @method thenMove
	     * @static
	     * @param t {Transform}     Transform
	     * @param v {Number[]}      Array of [x,y,z] translation components
	     * @return {Array}
	     */
	    Transform.thenMove = function thenMove(t, v) {
	        if (!v[2]) v[2] = 0;
	        return [t[0], t[1], t[2], 0, t[4], t[5], t[6], 0, t[8], t[9], t[10], 0, t[12] + v[0], t[13] + v[1], t[14] + v[2], 1];
	    };

	    /**
	     * Translate a Transform before the Transform is applied.
	     *
	     * @method moveThen
	     * @static
	     * @param v {Number[]}      Array of [x,y,z] translation components
	     * @param t {Transform}     Transform
	     * @return {Array}
	     */
	    Transform.moveThen = function moveThen(v, t) {
	        if (!v[2]) v[2] = 0;
	        var t0 = v[0] * t[0] + v[1] * t[4] + v[2] * t[8];
	        var t1 = v[0] * t[1] + v[1] * t[5] + v[2] * t[9];
	        var t2 = v[0] * t[2] + v[1] * t[6] + v[2] * t[10];
	        return Transform.thenMove(t, [t0, t1, t2]);
	    };

	    /**
	     * Return a Transform which represents translation by a translation vector.
	     *
	     * @method translate
	     * @static
	     * @param v {Number[]}      Translation vector [x,y,z]
	     * @return {Array}
	     */
	    Transform.translate = function translate(v) {
	        var x = v[0] || 0;
	        var y = v[1] || 0;
	        var z = v[2] || 0;
	        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
	    };

	    /**
	     * Return a Transform which represents translation in the x-direction.
	     *
	     * @method translateX
	     * @static
	     * @param x {Number}        Translation amount
	     */
	    Transform.translateX = function translateX(x) {
	        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, 0, 0, 1];
	    };

	    /**
	     * Return a Transform which represents translation in the y-direction.
	     *
	     * @method translateY
	     * @static
	     * @param y {Number}        Translation amount
	     */
	    Transform.translateY = function translateY(y) {
	        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, y, 0, 1];
	    };

	    /**
	     * Return a Transform which represents translation in the z-direction.
	     *
	     * @method translateZ
	     * @static
	     * @param z {Number}        Translation amount
	     */
	    Transform.translateZ = function translateZ(z) {
	        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, z, 1];
	    };

	    /**
	     * Return a Transform which represents a scaling by specified amounts in each dimension.
	     *
	     * @method scale
	     * @static
	     * @param v {Number[]}      Scale vector [x,y,z]
	     * @return {Array}
	     */
	    Transform.scale = function scale(v) {
	        var x = (v[0] !== undefined) ? v[0] : 1;
	        var y = (v[1] !== undefined) ? v[1] : 1;
	        var z = (v[2] !== undefined) ? v[2] : 1;
	        return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform which represents scaling in the x-direction.
	     *
	     * @method scaleX
	     * @static
	     * @param x {Number}        Scale amount
	     */
	    Transform.scaleX = function scaleX(x) {
	        return [x, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform which represents scaling in the y-direction.
	     *
	     * @method scaleY
	     * @static
	     * @param y {Number}        Scale amount
	     */
	    Transform.scaleY = function scaleY(y) {
	        return [1, 0, 0, 0, 0, y, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform which represents scaling in the z-direction.
	     *
	     * @method scaleZ
	     * @static
	     * @param z {Number}        Scale amount
	     */
	    Transform.scaleZ = function scaleZ(z) {
	        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Scale a Transform after the Transform is applied.
	     *
	     * @method thenScale
	     * @static
	     * @param t {Transform}     Transform
	     * @param v {Number[]}      Array of [x,y,z] scale components
	     * @return {Array}
	     */
	    Transform.thenScale = function thenScale(t, v) {
	        var x = (v[0] !== undefined) ? v[0] : 1;
	        var y = (v[1] !== undefined) ? v[1] : 1;
	        var z = (v[2] !== undefined) ? v[2] : 1;
	        return [
	            x * t[0],  y * t[1],  z * t[2],  0,
	            x * t[4],  y * t[5],  z * t[6],  0,
	            x * t[8],  y * t[9],  z * t[10], 0,
	            x * t[12], y * t[13], z * t[14], 1
	        ];
	    };

	    /**
	     * Return a Transform representing a clockwise rotation around the x-axis.
	     *
	     * @method rotateX
	     * @static
	     * @param angle {Number}    Angle in radians
	     * @return {Array}
	     */
	    Transform.rotateX = function rotateX(angle) {
	        var cosTheta = Math.cos(angle);
	        var sinTheta = Math.sin(angle);
	        return [1, 0, 0, 0, 0, cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform representing a clockwise rotation around the y-axis.
	     *
	     * @method rotateY
	     * @static
	     * @param angle {Number}    Angle in radians
	     * @return {Array}
	     */
	    Transform.rotateY = function rotateY(angle) {
	        var cosTheta = Math.cos(angle);
	        var sinTheta = Math.sin(angle);
	        return [cosTheta, 0, -sinTheta, 0, 0, 1, 0, 0, sinTheta, 0, cosTheta, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform representing a clockwise rotation around the z-axis.
	     *
	     * @method rotateX
	     * @static
	     * @param angle {Number}    Angle in radians
	     * @return {Array}
	     */
	    Transform.rotateZ = function rotateZ(theta) {
	        var cosTheta = Math.cos(theta);
	        var sinTheta = Math.sin(theta);
	        return [cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform representation of a skew in the x-direction
	     *
	     * @method skewX
	     * @static
	     * @param angle {Number}    The angle between the top and left sides
	     * @return {Array}
	     */
	    Transform.skewX = function skewX(angle) {
	        return [1, 0, 0, 0, Math.tan(angle), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform representation of a skew in the y-direction
	     *
	     * @method skewY
	     * @static
	     * @param angle {Number}    The angle between the bottom and right sides
	     * @return {Array}
	     */
	    Transform.skewY = function skewY(angle) {
	        return [1, Math.tan(angle), 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform which represents an axis-angle rotation.
	     *
	     * @method rotateAxis
	     * @static
	     * @param v {Number[]}   Unit vector representing the axis to rotate about
	     * @param angle {Number} Radians to rotate clockwise about the axis
	     * @return {Array}
	     */
	    Transform.rotateAxis = function rotateAxis(v, angle) {
	        var sinTheta = Math.sin(angle);
	        var cosTheta = 1 - Math.cos(angle);
	        var verTheta = 1 - cosTheta; // versine of theta

	        var xxV = v[0] * v[0] * verTheta;
	        var xyV = v[0] * v[1] * verTheta;
	        var xzV = v[0] * v[2] * verTheta;
	        var yyV = v[1] * v[1] * verTheta;
	        var yzV = v[1] * v[2] * verTheta;
	        var zzV = v[2] * v[2] * verTheta;
	        var xs = v[0] * sinTheta;
	        var ys = v[1] * sinTheta;
	        var zs = v[2] * sinTheta;

	        return [
	            xxV + cosTheta, xyV + zs, xzV - ys, 0,
	            xyV - zs, yyV + cosTheta, yzV + xs, 0,
	            xzV + ys, yzV - xs, zzV + cosTheta, 0,
	            0, 0, 0, 1
	        ];
	    };

	    /**
	     * Return a Transform which represents a Transform applied about an origin point.
	     *  Useful for rotating and scaling relative to an origin.
	     *
	     * @method aboutOrigin
	     * @static
	     * @param v {Number[]}          Origin point [x,y,z]
	     * @param t {Transform}         Transform
	     * @return {Array}
	     */
	    Transform.aboutOrigin = function aboutOrigin(v, t) {
	        v[2] = v[2] || 0;
	        var t0 = v[0] - (v[0] * t[0] + v[1] * t[4] + v[2] * t[8]);
	        var t1 = v[1] - (v[0] * t[1] + v[1] * t[5] + v[2] * t[9]);
	        var t2 = v[2] - (v[0] * t[2] + v[1] * t[6] + v[2] * t[10]);
	        return Transform.thenMove(t, [t0, t1, t2]);
	    };

	    /**
	     * Return translation vector component of the given Transform.
	     *
	     * @method getTranslate
	     * @static
	     * @param t {Transform}         Transform
	     * @return {Number[]}
	     */
	    Transform.getTranslate = function getTranslate(t) {
	        return [t[12], t[13], t[14]];
	    };

	    /**
	     * Return inverse Transform for given Transform.
	     *   Note: will provide incorrect results if Transform is not invertible.
	     *
	     * @method inverse
	     * @static
	     * @param t {Transform} Transform
	     * @return {Array}
	     */
	    Transform.inverse = function inverse(t) {
	        // only need to consider 3x3 section for affine
	        var c0 = t[5] * t[10] - t[6] * t[9];
	        var c1 = t[4] * t[10] - t[6] * t[8];
	        var c2 = t[4] * t[9]  - t[5] * t[8];
	        var c4 = t[1] * t[10] - t[2] * t[9];
	        var c5 = t[0] * t[10] - t[2] * t[8];
	        var c6 = t[0] * t[9]  - t[1] * t[8];
	        var c8 = t[1] * t[6]  - t[2] * t[5];
	        var c9 = t[0] * t[6]  - t[2] * t[4];
	        var c10 = t[0] * t[5] - t[1] * t[4];
	        var detM = t[0] * c0 - t[1] * c1 + t[2] * c2;
	        var invD = 1 / detM;
	        var result = [
	            invD  * c0, -invD * c4,  invD * c8,  0,
	            -invD * c1,  invD * c5, -invD * c9,  0,
	            invD  * c2, -invD * c6,  invD * c10, 0,
	            0, 0, 0, 1
	        ];
	        result[12] = -t[12] * result[0] - t[13] * result[4] - t[14] * result[8];
	        result[13] = -t[12] * result[1] - t[13] * result[5] - t[14] * result[9];
	        result[14] = -t[12] * result[2] - t[13] * result[6] - t[14] * result[10];
	        return result;
	    };

	    /**
	     * Returns the transpose of a Transform.
	     *
	     * @method transpose
	     * @static
	     * @param t {Transform}     Transform
	     * @return {Array}
	     */
	    Transform.transpose = function transpose(t) {
	        return [t[0], t[4], t[8], t[12], t[1], t[5], t[9], t[13], t[2], t[6], t[10], t[14], t[3], t[7], t[11], t[15]];
	    };

	    function normSquared(v) {
	        return (v.length === 2)
	            ? v[0] * v[0] + v[1] * v[1]
	            : v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
	    }
	    function norm(v) {
	        return Math.sqrt(normSquared(v));
	    }
	    function sign(n) {
	        return (n < 0) ? -1 : 1;
	    }

	    /**
	     * Decompose Transform into separate `translate`, `rotate`, `scale` and `skew` components.
	     *
	     * @method interpret
	     * @static
	     * @private
	     * @param T {Transform}     Transform
	     * @return {Object}
	     */
	    Transform.interpret = function interpret(T) {
	        // QR decomposition via Householder reflections
	        // FIRST ITERATION

	        //default Q1 to the identity matrix;
	        var x = [T[0], T[1], T[2]];                // first column vector
	        var sgn = sign(x[0]);                      // sign of first component of x (for stability)
	        var xNorm = norm(x);                       // norm of first column vector
	        var v = [x[0] + sgn * xNorm, x[1], x[2]];  // v = x + sign(x[0])|x|e1
	        var mult = 2 / normSquared(v);             // mult = 2/v'v

	        //bail out if our Matrix is singular
	        if (mult >= Infinity) {
	            return {
	                translate: Transform.getTranslate(T),
	                rotate: [0, 0, 0],
	                scale: [0, 0, 0],
	                skew: [0, 0, 0]
	            };
	        }

	        //evaluate Q1 = I - 2vv'/v'v
	        var Q1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

	        //diagonals
	        Q1[0]  = 1 - mult * v[0] * v[0];    // 0,0 entry
	        Q1[5]  = 1 - mult * v[1] * v[1];    // 1,1 entry
	        Q1[10] = 1 - mult * v[2] * v[2];    // 2,2 entry

	        //upper diagonal
	        Q1[1] = -mult * v[0] * v[1];        // 0,1 entry
	        Q1[2] = -mult * v[0] * v[2];        // 0,2 entry
	        Q1[6] = -mult * v[1] * v[2];        // 1,2 entry

	        //lower diagonal
	        Q1[4] = Q1[1];                      // 1,0 entry
	        Q1[8] = Q1[2];                      // 2,0 entry
	        Q1[9] = Q1[6];                      // 2,1 entry

	        //reduce first column of M
	        var MQ1 = Transform.compose(Q1, T);

	        // SECOND ITERATION on (1,1) minor
	        var x2 = [MQ1[5], MQ1[6]];
	        var sgn2 = sign(x2[0]);                    // sign of first component of x (for stability)
	        var x2Norm = norm(x2);                     // norm of first column vector
	        var v2 = [x2[0] + sgn2 * x2Norm, x2[1]];   // v = x + sign(x[0])|x|e1
	        var mult2 = 2 / normSquared(v2);           // mult = 2/v'v

	        //evaluate Q2 = I - 2vv'/v'v
	        var Q2 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

	        //diagonal
	        Q2[5]  = 1 - mult2 * v2[0] * v2[0]; // 1,1 entry
	        Q2[10] = 1 - mult2 * v2[1] * v2[1]; // 2,2 entry

	        //off diagonals
	        Q2[6] = -mult2 * v2[0] * v2[1];     // 2,1 entry
	        Q2[9] = Q2[6];                      // 1,2 entry

	        //calc QR decomposition. Q = Q1*Q2, R = Q'*M
	        var Q = Transform.compose(Q2, Q1);      //note: really Q transpose
	        var R = Transform.compose(Q, T);

	        //remove negative scaling
	        var remover = Transform.scale([R[0] < 0 ? -1 : 1, R[5] < 0 ? -1 : 1, R[10] < 0 ? -1 : 1]);
	        R = Transform.compose(R, remover);
	        Q = Transform.compose(remover, Q);

	        // decompose into rotate/scale/skew matrices
	        var result = {};
	        result.translate = Transform.getTranslate(T);
	        result.rotate = [Math.atan2(-Q[6], Q[10]), Math.asin(Q[2]), Math.atan2(-Q[1], Q[0])];
	        if (!result.rotate[0]) {
	            result.rotate[0] = 0;
	            result.rotate[2] = Math.atan2(Q[4], Q[5]);
	        }
	        result.scale = [R[0], R[5], R[10]];
	        result.skew = [Math.atan2(R[9], result.scale[2]), Math.atan2(R[8], result.scale[2]), Math.atan2(R[4], result.scale[0])];

	        // double rotation workaround
	        if (Math.abs(result.rotate[0]) + Math.abs(result.rotate[2]) > 1.5 * Math.PI) {
	            result.rotate[1] = Math.PI - result.rotate[1];

	            if (result.rotate[1] > Math.PI) result.rotate[1] -= 2 * Math.PI;
	            else if (result.rotate[1] < -Math.PI) result.rotate[1] += 2 * Math.PI;

	            if (result.rotate[0] < 0) result.rotate[0] += Math.PI;
	            else result.rotate[0] -= Math.PI;

	            if (result.rotate[2] < 0) result.rotate[2] += Math.PI;
	            else result.rotate[2] -= Math.PI;
	        }

	        return result;
	    };

	    /**
	     * Compose .translate, .rotate, .scale and .skew components into a Transform matrix.
	     *  The "inverse" of .interpret.
	     *
	     * @method build
	     * @static
	     * @private
	     * @param spec {Object} Object with keys "translate, rotate, scale, skew" and their vector values
	     * @return {Array}
	     */
	    Transform.build = function build(spec) {
	        var scaleMatrix = Transform.scale(spec.scale[0], spec.scale[1], spec.scale[2]);
	        var skewMatrix = Transform.skew(spec.skew[0], spec.skew[1], spec.skew[2]);
	        var rotateMatrix = Transform.rotate(spec.rotate[0], spec.rotate[1], spec.rotate[2]);
	        return Transform.thenMove(
	            Transform.compose(Transform.compose(rotateMatrix, skewMatrix), scaleMatrix),
	            spec.translate
	        );
	    };

	    /**
	     * Weighted average between two matrices by averaging their
	     *  translation, rotation, scale, skew components.
	     *  f(M1,M2,t) = (1 - t) * M1 + t * M2
	     *
	     * @method average
	     * @static
	     * @param M1 {Transform}    M1 = f(M1,M2,0) Transform
	     * @param M2 {Transform}    M2 = f(M1,M2,1) Transform
	     * @param [t=1/2] {Number}
	     * @return {Array}
	     */
	    Transform.average = function average(M1, M2, t) {
	        t = (t === undefined) ? 0.5 : t;
	        var specM1 = Transform.interpret(M1);
	        var specM2 = Transform.interpret(M2);

	        var specAvg = {
	            translate: [0, 0, 0],
	            rotate: [0, 0, 0],
	            scale: [0, 0, 0],
	            skew: [0, 0, 0]
	        };

	        for (var i = 0; i < 3; i++) {
	            specAvg.translate[i] = (1 - t) * specM1.translate[i] + t * specM2.translate[i];
	            specAvg.rotate[i] = (1 - t) * specM1.rotate[i] + t * specM2.rotate[i];
	            specAvg.scale[i] = (1 - t) * specM1.scale[i] + t * specM2.scale[i];
	            specAvg.skew[i] = (1 - t) * specM1.skew[i] + t * specM2.skew[i];
	        }

	        return Transform.build(specAvg);
	    };

	    /**
	     * Determine if two Transforms are component-wise equal.
	     *
	     * @method equals
	     * @static
	     * @param a {Transform}     Transform
	     * @param b {Transform}     Transform
	     * @return {Boolean}
	     */
	    Transform.equals = function equals(a, b) {
	        return !Transform.notEquals(a, b);
	    };

	    /**
	     * Determine if two Transforms are component-wise unequal
	     *
	     * @method notEquals
	     * @static
	     * @param a {Transform}     Transform
	     * @param b {Transform}     Transform
	     * @return {Boolean}
	     */
	    Transform.notEquals = function notEquals(a, b) {
	        if (a === b) return false;

	        return !(a && b) ||
	            a[12] !== b[12] || a[13] !== b[13] || a[14] !== b[14] ||
	            a[0]  !== b[0]  || a[1]  !== b[1]  || a[2]  !== b[2]  ||
	            a[4]  !== b[4]  || a[5]  !== b[5]  || a[6]  !== b[6]  ||
	            a[8]  !== b[8]  || a[9]  !== b[9]  || a[10] !== b[10];
	    };

	    module.exports = Transform;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var tickQueue = __webpack_require__(8);

	    /**
	     * A collection of timing utilities meant to translate the familiar setInterval, setTimeout
	     *  timers to use Samsara's internal clock, which is backed by a requestAnimationFrame (RAF) loop.
	     *  It also includes other helpful methods for debouncing.
	     *
	     * @example
	     *
	     *      Timer.setTimeout(function(){
	     *          alert('I will execute after 1 second');
	     *      }, 1000);
	     *
	     *      Timer.after(function(){
	     *          alert('I will execute on the following RAF loop');
	     *      }, 1);
	     *
	     *      var debouncedResize = Timer.debounce(function(){
	     *          // this code will execute when the `resize` event
	     *          // has stopped firing (for the last 200 milliseconds)
	     *      }, 200);
	     *
	     *      Engine.on('resize', function(){
	     *          debounceResize();
	     *      });
	     *
	     * @class Timer
	     * @static
	     */
	    var Timer = {};

	    var getTime = (window.performance)
	        ? function() { return window.performance.now(); }
	        : Date.now;

	    function _addTimerFunction(fn) {
	        tickQueue.push(fn);
	        return fn;
	    }

	    function _clearTimerFunction(fn){
	        var index = tickQueue.indexOf(fn);
	        if (index === -1) return;
	        tickQueue.splice(index, 1);
	    }

	    /**
	     * Wraps a function to be invoked after a certain amount of time.
	     *  After a set duration has passed, it executes the function.
	     *
	     * @method setTimeout
	     * @static
	     * @param handler {Function}    Function to be run after a specified duration
	     * @param duration {Number}     Time to delay execution (in milliseconds)
	     * @return {Function}
	     */
	    Timer.setTimeout = function setTimeout(handler, duration) {
	        var t = getTime();
	        function callback() {
	            var t2 = getTime();
	            if (t2 - t >= duration) {
	                handler.apply(this, arguments);
	                Timer.clear(callback);
	            }
	        }
	        return _addTimerFunction(callback);
	    };

	    /**
	     * Wraps a function to be invoked at repeated intervals.
	     *
	     * @method setInterval
	     * @static
	     * @param handler {Function}    Function to be run at specified intervals
	     * @param interval {Number}     Time interval (in milliseconds)
	     * @return {Function}
	     */
	    Timer.setInterval = function setInterval(handler, duration) {
	        var t = getTime();
	        function callback() {
	            var t2 = getTime();
	            if (t2 - t >= duration) {
	                handler.apply(this, arguments);
	                t = getTime();
	            }
	        }
	        return _addTimerFunction(callback);
	    };

	    /**
	     * Wraps a function to be invoked after a specified number of Engine ticks.
	     *
	     * @method after
	     * @static
	     * @param handler {Function}    Function to be executed
	     * @param numTicks {Number}     Number of frames to delay execution
	     * @return {Function}
	     */
	    Timer.after = function after(handler, numTicks) {
	        if (numTicks === undefined) return undefined;
	        function callback() {
	            numTicks--;
	            if (numTicks <= 0) { //in case numTicks is fraction or negative
	                handler.apply(this, arguments);
	                Timer.clear(callback);
	            }
	        }
	        return _addTimerFunction(callback);
	    };

	    /**
	     * Wraps a function to be invoked every specified number of Engine ticks.
	     *
	     * @method every
	     * @static
	     * @param handler {Function}    Function to be executed
	     * @param numTicks {Number}     Number of frames per execution
	     * @return {Function}
	     */
	    Timer.every = function every(handler, numTicks) {
	        numTicks = numTicks || 1;
	        var initial = numTicks;
	        function callback() {
	            numTicks--;
	            if (numTicks <= 0) {
	                handler.apply(this, arguments);
	                numTicks = initial;
	            }
	        }
	        return _addTimerFunction(callback);
	    };

	    /**
	     * Cancel a timer.
	     *
	     * @method clear
	     * @static
	     * @param handler {Function} Handler
	     */
	    Timer.clear = function clear(handler) {
	        _clearTimerFunction(handler);
	    };

	    /**
	     * Debounces a function for specified duration.
	     *
	     * @method debounce
	     * @static
	     * @param handler {Function}  Handler
	     * @param duration {Number}   Duration
	     * @return {Function}
	     */
	    Timer.debounce = function debounce(handler, duration) {
	        var timeout;
	        return function() {
	            var args = arguments;

	            var fn = function() {
	                Timer.clear(timeout);
	                timeout = null;
	                handler.apply(this, args);
	            }.bind(this);

	            if (timeout) Timer.clear(timeout);
	            timeout = Timer.setTimeout(fn, duration);
	        };
	    };

	    /**
	     * Debounces a function for a specified number of Engine frames.
	     *
	     * @method frameDebounce
	     * @static
	     * @param handler {Function}  Handler
	     * @param numFrames {Number}  Number of frames
	     * @return {Function}
	     */
	    Timer.frameDebounce = function frameDebounce(handler, numFrames){
	        var timeout;
	        return function() {
	            var args = arguments;

	            var fn = function() {
	                timeout = null;
	                handler.apply(this, args);
	            }.bind(this);

	            if (timeout) Timer.clear(timeout);
	            timeout = Timer.after(fn, numFrames);
	        };
	    };

	    module.exports = Timer;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    var preTickQueue = __webpack_require__(6);
	    var dirtyQueue = __webpack_require__(7);
	    var tickQueue = __webpack_require__(8);
	    var EventHandler = __webpack_require__(3);
	    var SimpleStream = __webpack_require__(12);
	    var Stream = __webpack_require__(16);

	    var Tween = __webpack_require__(19);
	    var Spring = __webpack_require__(21);
	    var Inertia = __webpack_require__(22);
	    var Damp = __webpack_require__(23);
	    var Immediate = __webpack_require__(24);

	    var transitionMethods = {
	        tween: Tween,
	        spring: Spring,
	        inertia: Inertia,
	        damp: Damp
	    };

	    /**
	     * A way to transition numeric values and arrays of numbers between start and end states.
	     *  Transitioning happens through one of many possible interpolations, such as easing
	     *  curves like 'easeIn', or physics curves like 'spring' and 'inertia'. The choice
	     *  of interpolation is specified when `.set` is called. If no interpolation is specified
	     *  then the value changes immediately. Non-numeric values in arrays, such as `undefined`
	     *  or `true`, are safely ignored.
	     *
	     *  Transitionables are streams, so they emit `start`, `update` and `end` events, with a payload
	     *  that is their current value. As streams, they can also be mapped, filtered, composed, etc.
	     *
	     *  @example
	     *
	     *      var transitionable = new Transitionable(0);
	     *
	     *      transitionable.set(100, {duration : 1000, curve : 'easeIn'});
	     *
	     *      transitionable.on('start', function(value){
	     *          console.log(value); // 0
	     *      });
	     *
	     *      transitionable.on('update', function(value){
	     *          console.log(value); // numbers between 0 and 100
	     *      });
	     *
	     *      transitionable.on('end', function(value){
	     *          console.log(value); // 100
	     *      });
	     *
	     * @class Transitionable
	     * @constructor
	     * @extends Streams.SimpleStream
	     * @param value {Number|Number[]}   Starting value
	     */
	    function Transitionable(value) {
	        this._callback = undefined;
	        this._method = null;
	        this._active = false;
	        this._currentActive = false;
	        this.updateMethod = undefined;

	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();
	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        var hasUpdated = false;
	        this._eventInput.on('start', function (value) {
	            hasUpdated = false;
	            this._currentActive = true;
	            if (!this._active) {
	                this.emit('start', value);
	                this._active = true;
	            }
	        }.bind(this));

	        this._eventInput.on('update', function (value) {
	            hasUpdated = true;
	            this.emit('update', value);
	        }.bind(this));

	        this._eventInput.on('end', function (value) {
	            this._currentActive = false;

	            if (this._callback) {
	                var callback = this._callback;
	                this._callback = undefined;
	                callback();
	            }

	            if (!this._currentActive){
	                hasUpdated = false;
	                this._active = false;
	                this.emit('end', value);
	            }
	        }.bind(this));

	        if (value !== undefined) {
	            this.value = value;
	            preTickQueue.push(function () {
	                this.trigger('start', value);

	                dirtyQueue.push(function () {
	                    if (hasUpdated) return;
	                    this.trigger('end', value);
	                }.bind(this));
	            }.bind(this));
	        }
	    }

	    Transitionable.prototype = Object.create(SimpleStream.prototype);
	    Transitionable.prototype.constructor = Transitionable;

	    /**
	     * Constructor method. A way of registering other engines that can interpolate
	     *  between start and end values. For instance, a physics engine.
	     *
	     *  @method register
	     *  @param name {string}    Identifier for the engine
	     *  @param constructor      Constructor for the engine
	     */
	    Transitionable.register = function register(name, constructor) {
	        if (!(name in transitionMethods))
	            transitionMethods[name] = constructor;
	    };

	    /**
	     * Constructor method. Unregister an interpolating engine.
	     *  Undoes work of `register`.
	     *
	     *  @method unregister
	     *  @param name {string}    Identifier for the engine
	     */
	    Transitionable.unregister = function unregister(name) {
	        if (name in transitionMethods) {
	            delete transitionMethods[name];
	            return true;
	        }
	        else return false;
	    };

	    /**
	     * Define a new end value that will be transitioned towards with the prescribed
	     *  transition. An optional callback can fire when the transition completes.
	     *
	     * @method set
	     * @param value {Number|Number[]}           End value
	     * @param [transition] {Object}             Transition definition
	     * @param [callback] {Function}             Callback
	     */
	    Transitionable.prototype.set = function set(value, transition, callback) {
	        var Method;
	        if (!transition || transition.duration === 0) {
	            this.value = value;
	            if (callback) dirtyQueue.push(callback);
	            Method = Immediate;
	        }
	        else {
	            if (callback) this._callback = callback;
	            var curve = transition.curve;

	            Method = (curve && transitionMethods[curve])
	                ? transitionMethods[curve]
	                : Tween;
	        }

	        if (this._method !== Method) {
	            // remove previous
	            if (this._interpolant){
	                if (this.updateMethod){
	                    var index = tickQueue.indexOf(this.updateMethod);
	                    if (index >= 0) tickQueue.splice(index, 1);
	                }
	                this.unsubscribe(this._interpolant);
	            }

	            if (value instanceof Array) {
	                this._interpolant = (value.length < Method.DIMENSIONS)
	                    ? new Method(this.get())
	                    : new NDTransitionable(this.get(), Method);
	            }
	            else this._interpolant = new Method(this.get());

	            this.subscribe(this._interpolant);

	            if (this._interpolant.update){
	                this.updateMethod = this._interpolant.update.bind(this._interpolant);
	                tickQueue.push(this.updateMethod);
	            }

	            this._method = Method;
	        }

	        this._interpolant.set(value, transition);
	    };

	    /**
	     * Return the current state of the transition.
	     *
	     * @method get
	     * @return {Number|Number[]}    Current state
	     */
	    Transitionable.prototype.get = function get() {
	        return (this._interpolant) ? this._interpolant.get() : this.value;
	    };

	    /**
	     * Return the current velocity of the transition.
	     *
	     * @method getVelocity
	     * @return {Number|Number[]}    Current velocity
	     */
	    Transitionable.prototype.getVelocity = function getVelocity(){
	        if (this._interpolant && this._interpolant.getVelocity)
	            return this._interpolant.getVelocity();
	    };

	    /**
	     * Sets the value and velocity of the transition without firing any events.
	     *
	     * @method reset
	     * @param value {Number|Number[]}       New value
	     * @param [velocity] {Number|Number[]}  New velocity
	     */
	    Transitionable.prototype.reset = function reset(value, velocity){
	        this._callback = null;
	        this._method = null;
	        this.value = value;
	        if (this._interpolant) this._interpolant.reset(value, velocity);
	    };

	    /**
	     * Ends the transition in place.
	     *
	     * @method halt
	     */
	    Transitionable.prototype.halt = function () {
	        if (!this._active) return;
	        var value = this.get();
	        this.reset(value);
	        this.trigger('end', value);

	        //TODO: refactor this
	        if (this._interpolant) {
	            if (this.updateMethod) {
	                var index = tickQueue.indexOf(this.updateMethod);
	                if (index >= 0) tickQueue.splice(index, 1);
	            }
	            this.unsubscribe(this._interpolant);
	        }
	    };

	    /**
	     * Determine is the transition is ongoing, or has completed.
	     *
	     * @method isActive
	     * @return {Boolean}
	     */
	    Transitionable.prototype.isActive = function isActive() {
	        return this._active;
	    };

	    /**
	     * Combine multiple transitions to be executed sequentially. Pass an optional
	     *  callback to fire on completion. Provide the transitions as an array of
	     *  transition definition pairs: [value, method]
	     *
	     *  @example
	     *
	     *  transitionable.setMany([
	     *      [0, {curve : 'easeOut', duration : 500}],
	     *      [1, {curve : 'spring', period : 100, damping : 0.5}]
	     *  ]);
	     *
	     * @method setMany
	     * @param transitions {Array}   Array of transitions
	     * @param [callback] {Function} Callback
	     */
	    Transitionable.prototype.setMany = function (transitions, callback) {
	        var transition = transitions.shift();
	        if (transitions.length === 0) {
	            this.set(transition[0], transition[1], callback);
	        }
	        else this.set(transition[0], transition[1], this.setMany.bind(this, transitions, callback));
	    };

	    /**
	     * Loop indefinitely between values with provided transitions array.
	     *
	     *  @example
	     *
	     *  transitionable.loop([
	     *      [0, {curve : 'easeOut', duration : 500}],
	     *      [1, {curve : 'spring', period : 100, damping : 0.5}]
	     *  ]);
	     *
	     * @method loop
	     * @param transitions {Array}   Array of transitions
	     */
	    Transitionable.prototype.loop = function (transitions) {
	        var arrayClone = transitions.slice(0);
	        this.setMany(transitions, this.loop.bind(this, arrayClone));
	    };

	    /**
	     * Postpone a transition, and fire it by providing it in the callback parameter.
	     *
	     * @method delay
	     * @param callback {Function}   Callback
	     * @param duration {Number}     Duration of delay (in millisecons)
	     */
	    Transitionable.prototype.delay = function delay(callback, duration) {
	        this.set(this.get(), {
	            duration: duration,
	            curve: function () { return 0; }
	        }, callback);
	    };

	    function NDTransitionable(value, Method) {
	        this._eventOutput = new EventHandler();
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this.sources = [];
	        for (var i = 0; i < value.length; i++) {
	            var source = new Method(value[i]);
	            this.sources.push(source);
	        }

	        this.stream = Stream.merge(this.sources);
	        this._eventOutput.subscribe(this.stream);
	    }

	    // N-dimensional extension for arrays when interpolants can't natively support multi-dimensional arrays
	    NDTransitionable.prototype.set = function (value, transition) {
	        var velocity = (transition && transition.velocity) ? transition.velocity.slice() : undefined;
	        for (var i = 0; i < value.length; i++){
	            if (velocity) transition.velocity = velocity[i];
	            this.sources[i].set(value[i], transition);
	        }
	    };

	    NDTransitionable.prototype.get = function () {
	        return this.sources.map(function(source){
	            return source.get();
	        });
	    };

	    NDTransitionable.prototype.getVelocity = function () {
	        return this.sources.map(function(source){
	            return source.getVelocity();
	        });
	    };

	    NDTransitionable.prototype.update = function () {
	        for (var i = 0; i < this.sources.length; i++)
	            this.sources[i].update();
	    };

	    NDTransitionable.prototype.reset = function (value) {
	        for (var i = 0; i < this.sources.length; i++) {
	            var source = this.sources[i];
	            source.reset(value[i]);
	        }
	    };

	    module.exports = Transitionable;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(3);
	    var EventMapper = __webpack_require__(13);
	    var EventFilter = __webpack_require__(14);
	    var EventSplitter = __webpack_require__(15);

	    /**
	     * A SimpleStream wraps an EventHandler and provides convenience
	     *  methods of `map`, `filter`, `split`, and `pluck` to
	     *  transform one stream into another.
	     *
	     * @example
	     *
	     * @class SimpleStream
	     * @extends Core.EventHandler
	     * @private
	     * @namespace Streams
	     * @constructor
	     */
	    function SimpleStream(){
	        EventHandler.call(this);
	    }

	    SimpleStream.prototype = Object.create(EventHandler.prototype);
	    SimpleStream.prototype.constructor = SimpleStream;

	    /**
	     * Map converts the current stream into a new stream
	     *  with a modified (mapped) data payload.
	     *
	     * @method map
	     * @param mapperFn {Function}    Function to map event payload
	     * @return stream {SimpleStream} Mapped stream
	     */
	    SimpleStream.prototype.map = function map(mapperFn){
	        var stream = new SimpleStream();
	        var mapper = new EventMapper(mapperFn);
	        stream.subscribe(mapper).subscribe(this);
	        return stream;
	    };

	    /**
	     * Filter converts the current stream into a new stream
	     *  that only emits if the filter condition is satisfied.
	     *  The filter function should return a Boolean value.
	     *
	     * @method filter
	     * @param filterFn {Function}    Function to filter event payload
	     * @return stream {SimpleStream} Filtered stream
	     */
	    SimpleStream.prototype.filter = function filter(filterFn){
	        var filter = new EventFilter(filterFn);
	        var filteredStream = new SimpleStream();
	        filteredStream.subscribe(filter).subscribe(this);
	        return filteredStream;
	    };

	    /**
	     * Split maps one of several streams based on custom logic.
	     *  The splitter function should return an EventEmitter type.
	     *
	     * @method split
	     * @param splitterFn {Function}  Splitter function
	     */
	    SimpleStream.prototype.split = function split(splitterFn){
	        var splitter = new EventSplitter(splitterFn);
	        splitter.subscribe(this);
	    };

	    /**
	     * Pluck is an opinionated mapper. It projects a Stream
	     *  onto one of its return values.
	     *
	     *  Useful if a Stream returns an array or object.
	     *
	     * @method pluck
	     * @param key {String|Number}    Key to project event payload onto
	     * @return stream {SimpleStream} Plucked stream
	     */
	    SimpleStream.prototype.pluck = function pluck(key){
	        return this.map(function(value){
	            return value[key];
	        });
	    };
	    
	    module.exports = SimpleStream;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(3);

	    /**
	     * EventMapper modifies the data payload of an event based on
	     *  a provided function.
	     *
	     *  Note: it does not modify the event's `type`.
	     *
	     *  @example
	     *
	     *      var eventMapper = new EventMapper(function(payload){
	     *          return payload.x + payload.y
	     *      });
	     *
	     *      var eventEmitter = new EventEmitter();
	     *
	     *      eventMapper.subscribe(eventEmitter);
	     *
	     *      eventMapper.on('name', function(value){
	     *          alert(value);
	     *      });
	     *
	     *      eventEmitter.emit('name', {x : 1, y : 2}); // alerts 3
	     *
	     * @class EventMapper
	     * @namespace Events
	     * @constructor
	     * @param map {Function}  Function to modify the event payload
	     */
	    function EventMapper(map) {
	        EventHandler.call(this);
	        this._mappingFunction = map;
	    }

	    EventMapper.prototype = Object.create(EventHandler.prototype);
	    EventMapper.prototype.constructor = EventMapper;

	    /**
	     * Emit mapped event.
	     *
	     * @method emit
	     * @param type {String} Channel name
	     * @param data {Object} Payload
	     */
	    EventMapper.prototype.emit = function emit(type, data) {
	        var mappedData = this._mappingFunction(data);
	        EventHandler.prototype.emit.call(this, type, mappedData);
	    };

	    /**
	     * Alias of emit.
	     *
	     * @method trigger
	     * @param type {String} Channel name
	     * @param data {Object} Payload
	     */
	    EventMapper.prototype.trigger = EventMapper.prototype.emit;

	    module.exports = EventMapper;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(3);

	    /**
	     * EventFilter regulates the broadcasting of events based on
	     *  a specified condition prescribed by a provided function
	     *  with the signature `(data) -> Boolean`
	     *
	     *  @example
	     *
	     *      var eventFilter = new EventFilter(function(payload){
	     *          return (payload.value == 0);
	     *      });
	     *
	     *      var eventEmitter = new EventEmitter();
	     *
	     *      eventFilter.subscribe(eventEmitter);
	     *
	     *      eventFilter.on('click', function(data){
	     *          alert('fired');
	     *      });
	     *
	     *      eventEmitter.emit('click', {value : 0}); // fired
	     *      eventEmitter.emit('click', {value : 1}); // doesn't fire
	     *
	     * @class EventFilter
	     * @namespace Events
	     * @constructor
	     * @param filter {Function}  Function returning a Boolean
	     */
	    function EventFilter(filter) {
	        EventHandler.call(this);
	        this._condition = filter;
	    }
	    EventFilter.prototype = Object.create(EventHandler.prototype);
	    EventFilter.prototype.constructor = EventFilter;

	    /**
	     * Emit event if the condition is satisfied.
	     *
	     * @method emit
	     * @param type {String} Channel name
	     * @param data {Object} Payload
	     */
	    EventFilter.prototype.emit = function emit(type, data) {
	        //TODO: add start/update/end logic
	        if (!this._condition(data)) return;
	        EventHandler.prototype.emit.apply(this, arguments);
	    };

	    /**
	     * Alias of emit.
	     *
	     * @method trigger
	     * @param type {String} Channel name
	     * @param data {Object} Payload
	     */
	    EventFilter.prototype.trigger = EventFilter.prototype.emit;

	    module.exports = EventFilter;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(3);

	    /**
	     * EventSplitter routes events to various event destinations
	     *  based on custom logic. The return of the provided splitter
	     *  function should be of type EventEmitter.
	     *
	     *  @example
	     *
	     *      var eventEmitter = new EventEmitter();
	     *      var eventEmitterX = new eventEmitter();
	     *      var eventEmitterY = new eventEmitter();
	     *
	     *      var eventSplitter = new EventSplitter(function(payload){
	     *          return (payload.x > payload.y)
	     *              ? eventEmitterX;
	     *              : eventEmitterY;
	     *      });
	     *
	     *      eventSplitter.subscribe(eventEmitter);
	     *
	     *      eventEmitterX.on('move', function(){
	     *          console.log('x is bigger')
	     *      });
	     *
	     *      eventEmitterY.on('move', function(){
	     *          console.log('y is bigger')
	     *      })
	     *
	     *      eventEmitter.emit('move', {x : 3, y : 2}); // x is bigger
	     *
	     * @class EventSplitter
	     * @private
	     * @namespace Events
	     * @constructor
	     * @param splitter {Function}
	     */
	    function EventSplitter(splitter) {
	        EventHandler.call(this);
	        this._splitter = splitter;

	        this.on('start', function(){});
	        this.on('update', function(){});
	        this.on('end', function(){});
	    }
	    EventSplitter.prototype = Object.create(EventHandler.prototype);
	    EventSplitter.prototype.constructor = EventSplitter;

	    /**
	     * Emit event.
	     *
	     * @method emit
	     * @param type {String} Channel name
	     * @param data {Object} Payload
	     */
	    EventSplitter.prototype.emit = function emit(type, data) {
	        var target = this._splitter.call(this, data);
	        if (target && target.emit instanceof Function)
	            target.emit(type, data);
	    };

	    /**
	     * Alias of emit.
	     *
	     * @method trigger
	     * @param type {String} Channel name
	     * @param data {Object} Payload
	     */
	    EventSplitter.prototype.trigger = EventSplitter.prototype.emit;

	    module.exports = EventSplitter;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module){
	    var MergedStream = __webpack_require__(17);
	    var LiftedStream = __webpack_require__(18);
	    var EventHandler = __webpack_require__(3);
	    var SimpleStream = __webpack_require__(12);

	    var preTickQueue = __webpack_require__(6);
	    var postTickQueue = __webpack_require__(5);
	    var dirtyQueue = __webpack_require__(7);

	    var EVENTS = {
	        START : 'start',
	        UPDATE : 'update',
	        END : 'end'
	    };

	    /**
	     * Stream listens to `start`, `update` and `end` events and
	     *  emits `start`, `update` and `end` events.
	     *
	     *  If listening to multiple sources, Stream emits a single event per
	     *  Engine cycle.
	     *
	     *  @example
	     *
	     *      var position = new Transitionable([0,0]);
	     *      var size = new EventEmitter();
	     *
	     *      var translationStream = Stream.lift(function(position, size){
	     *          var translation = [
	     *              position[0] + size[0],
	     *              position[1] + size[1]
	     *          ];
	     *
	     *          return Transform.translate(translation);
	     *      }, [positionStream, sizeStream]);
	     *
	     *      translationStream.on('start', function(transform){
	     *          console.log(transform);
	     *      });
	     *
	     *      translationStream.on('update', function(transform){
	     *          console.log(transform);
	     *      });
	     *
	     *      translationStream.on('end', function(transform){
	     *          console.log(transform);
	     *      });
	     *
	     *      position.set([100, 50], {duration : 500});
	     *
	     * @class Stream
	     * @extends Streams.SimpleStream
	     * @namespace Streams
	     * @param [options] {Object}            Options
	     * @param [options.start] {Function}    Custom logic to map the `start` event
	     * @param [options.update] {Function}   Custom logic to map the `update` event
	     * @param [options.end] {Function}      Custom logic to map the `end` event
	     * @constructor
	     */
	    function Stream(options){
	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();
	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        var counter = 0;
	        var isUpdating = false;
	        var dirtyStart = false;
	        var dirtyUpdate = false;
	        var dirtyEnd = false;

	        function start(data){
	            var payload = options && options.start ? options.start(data) : data;
	            if (payload !== false) this.emit(EVENTS.START, payload);
	            dirtyStart = false;
	        }

	        function update(data){
	            var payload = options && options.update ? options.update(data) : data;
	            if (payload !== false) this.emit(EVENTS.UPDATE, payload);
	            dirtyUpdate = false;
	        }

	        function end(data){
	            var payload = options && options.end ? options.end(data) : data;
	            if (payload !== false) this.emit(EVENTS.END, payload);
	            dirtyEnd = false;
	        }

	        this._eventInput.on(EVENTS.START, function(data){
	            counter++;
	            if (dirtyStart || isUpdating) return false;
	            dirtyStart = true;
	            preTickQueue.push(start.bind(this, data));
	        }.bind(this));

	        this._eventInput.on(EVENTS.UPDATE, function(data){
	            isUpdating = true;
	            if (dirtyUpdate) return false;
	            dirtyUpdate = true;
	            postTickQueue.push(update.bind(this, data));
	        }.bind(this));

	        this._eventInput.on(EVENTS.END, function(data){
	            counter--;
	            if (isUpdating && counter > 0){
	                update.call(this, data);
	                return false;
	            }
	            isUpdating = false;
	            if (dirtyEnd) return;
	            dirtyEnd = true;
	            dirtyQueue.push(end.bind(this, data));
	        }.bind(this));
	    }

	    Stream.prototype = Object.create(SimpleStream.prototype);
	    Stream.prototype.constructor = Stream;

	    /**
	     * Batches events for provided object of streams in
	     *  {key : stream} pairs. Emits one event per Engine cycle.
	     *
	     * @method merge
	     * @static
	     * @param streams {Object}  Dictionary of `resize` streams
	     */
	    Stream.merge = function(streams) {
	        return new MergedStream(streams);
	    };

	    /**
	     * Lift is like map, except it maps several event sources,
	     *  not only one.
	     *
	     *  @example
	     *
	     *      var liftedStream = Stream.lift(function(payload1, payload2){
	     *          return payload1 + payload2;
	     *      }, [stream2, stream2]);
	     *
	     *      liftedStream.on('name'), function(data){
	     *          // data = 3;
	     *      });
	     *
	     *      stream2.emit('name', 1);
	     *      stream2.emit('name', 2);
	     *
	     * @method lift
	     * @static
	     * @param map {Function}            Function to map stream payloads
	     * @param streams {Array|Object}    Stream sources
	     */
	    Stream.lift = function(maps, streams){
	        return new LiftedStream(maps, new MergedStream(streams));
	    };

	    module.exports = Stream;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var SimpleStream = __webpack_require__(12);

	    function MergedStream(streams) {
	        this.mergedData = streams instanceof Array ? [] : {};
	        this.streamCache = {};

	        var Stream = __webpack_require__(16);

	        Stream.call(this, {
	            start : function() {
	                return this.mergedData;
	            }.bind(this),
	            update : function() {
	                return this.mergedData;
	            }.bind(this),
	            end : function() {
	                return this.mergedData;
	            }.bind(this)
	        });

	        for (var key in streams)
	            this.addStream(key, streams[key]);
	    }

	    MergedStream.prototype = Object.create(SimpleStream.prototype);
	    MergedStream.prototype.constructor = MergedStream;

	    MergedStream.prototype.addStream = function(key, stream) {
	        var mergedData = this.mergedData;

	        if (stream instanceof Object && stream.on){
	            mergedData[key] = undefined;

	            stream.on('start', function(data){
	                mergedData[key] = data;
	            });

	            stream.on('update', function(data){
	                mergedData[key] = data;
	            });

	            stream.on('end', function(data){
	                mergedData[key] = data;
	            });

	            this.subscribe(stream);
	        }
	        else mergedData[key] = stream;

	        this.streamCache[key] = stream;
	    };

	    MergedStream.prototype.removeStream = function(key) {
	        var stream = this.streamCache[key];
	        this.unsubscribe(stream);

	        delete this.streamCache[key];

	        if (this.mergedData instanceof Array){
	            var index = this.mergedData.indexOf(key);
	            this.mergedData.splice(index, 1);
	        }
	        else
	            delete this.mergedData[key];
	    };

	    MergedStream.prototype.replaceStream = function(key, stream) {
	        this.removeStream(key);
	        this.addStream(key, stream);
	    };
	    
	    module.exports = MergedStream;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var SimpleStream = __webpack_require__(12);
	    var EventMapper = __webpack_require__(13);

	    function LiftedStream(map, mergedStream) {
	        SimpleStream.call(this);
	        var mappedStream = new EventMapper(function liftMap(data) {
	            return map.apply(null, data);
	        });
	        this.mergedStream = mergedStream;
	        this.subscribe(mappedStream).subscribe(mergedStream);
	    }

	    LiftedStream.prototype = Object.create(SimpleStream.prototype);
	    LiftedStream.prototype.constructor = LiftedStream;

	    LiftedStream.prototype.replaceStream = function() {
	        this.mergedStream.replaceStream.apply(this.mergedStream, arguments);
	    };
	    
	    module.exports = LiftedStream;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Transition = __webpack_require__(20);
	    var dirtyQueue = __webpack_require__(7);

	    var now = Date.now;
	    var eps = 1e-9; // for calculating velocity using finite difference
	    var registeredCurves = {};

	    /**
	     * A method of interpolating between start and end values with
	     *  an easing curve.
	     *
	     * @class Tween
	     * @private
	     * @namespace Transitions
	     * @constructor
	     * @param value {Number}    Initial value
	     */
	    function Tween(value) {
	        Transition.apply(this, arguments);
	        this._curve = undefined;
	        this._duration = 0;
	    }

	    Tween.prototype = Object.create(Transition.prototype);
	    Tween.prototype.constructor = Tween;

	    /**
	     * Default easing curves.
	     *
	     * @property CURVES {object}
	     * @property CURVES.linear {Function}           Linear interpolation
	     * @property CURVES.easeIn {Function}           EaseIn interpolation. Deceleration from zero velocity.
	     * @property CURVES.easeInCubic {Function}      Cubic interpolation. Acceleration from zero velocity.
	     * @property CURVES.easeOut {Function}          EaseOut interpolation. Acceleration from zero velocity.
	     * @property CURVES.easeOutCubic {Function}     Cubic interpolation. Deceleration from zero velocity.
	     * @property CURVES.easeOutWall                 Interpolation with wall boundary.
	     * @property CURVES.easeInOut {Function}        EaseInOut interpolation. Acceleration then deceleration.
	     * @property CURVES.easeInOutCubic {Function}   Cubic interpolation. Acceleration then deceleration.
	     * @static
	     */
	    Tween.CURVES = {
	        linear: function(t) {
	            return t;
	        },
	        easeIn: function(t) {
	            return t * t;
	        },
	        easeOut: function(t) {
	            return t * (2 - t);
	        },
	        easeInOut: function(t) {
	            return (t <= 0.5)
	                ?  2 * t * t
	                : -2 * t * t + 4 * t - 1;
	        },
	        easeOutBounce: function(t) {
	            return t * (3 - 2 * t);
	        },
	        easeInCubic: function (t) {
	            return t * t * t;
	        },
	        easeOutCubic: function (t) {
	            return 1 + Math.pow(t - 1, 3);
	        },
	        easeInOutCubic: function (t) {
	            t *= 2;
	            return (t < 1)
	                ? .5 * t * t * t
	                : .5 * Math.pow(t - 2, 3) + 1;
	        },
	        easeOutWall: function (t) {
	            if (t < (1 / 2.75)) {
	                return (7.5625 * t * t);
	            } else if (t < (2 / 2.75)) {
	                return (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
	            } else if (t < (2.5 / 2.75)) {
	                return (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
	            } else {
	                return (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
	            }
	        }
	    };

	    Tween.DIMENSIONS = Infinity;

	    Tween.DEFAULT_OPTIONS = {
	        curve: Tween.CURVES.linear,
	        duration: 500
	    };

	    /**
	     * A way of registering custom easing curves by name.
	     *  Curves are functions that take a number between 0 and 1 and return
	     *  a number (often between 0 and 1, but can over/under shoot).
	     *
	     * @method register
	     * @static
	     * @param name {String}         Identifying name
	     * @param curve {Function}      Function defined on the domain [0,1]
	     * @return {Boolean}            False if key is taken, else true
	     */
	    Tween.register = function register(name, curve) {
	        if (!registeredCurves[name]) {
	            registeredCurves[name] = curve;
	            return true;
	        }
	        else return false;
	    };

	    /**
	     * Remove curve from internal registry. Undoes work of `register`.
	     *
	     * @method deregister
	     * @static
	     * @param name {String}     Name dictionary key
	     * @return {Boolean}        False if key doesn't exist
	     */
	    Tween.deregister = function deregister(name) {
	        if (registeredCurves[name]) {
	            delete registeredCurves[name];
	            return true;
	        }
	        else return false;
	    };

	    /**
	     * Retrieve all registered curves.
	     *
	     * @method getCurves
	     * @static
	     * @return {Object}
	     */
	    Tween.getCurves = function getCurves() {
	        return registeredCurves;
	    };

	    /**
	     * Set new value to transition to.
	     *
	     * @method set
	     * @param endValue {Number|Number[]}    End value
	     * @param transition {Object}           Transition object of type
	     *                                      {duration: number, curve: name}
	     */
	    Tween.prototype.set = function set(endValue, transition) {
	        Transition.prototype.set.apply(this, arguments);

	        var curve = transition.curve;
	        if (!registeredCurves[curve] && Tween.CURVES[curve])
	            Tween.register(curve, Tween.CURVES[curve]);

	        this._duration = transition.duration || Tween.DEFAULT_OPTIONS.duration;
	        this._curve = curve
	            ? (curve instanceof Function) ? curve : getCurve(curve)
	            : Tween.DEFAULT_OPTIONS.curve;
	    };

	    /**
	     * Update the transition in time.
	     *
	     * @method update
	     */
	    Tween.prototype.update = function update() {
	        if (!this._active) return;

	        var timeSinceStart = now() - this._previousTime;

	        this.velocity = _calculateVelocity(this.state, this.start, this._curve, this._duration, 1);

	        if (timeSinceStart < this._duration) {
	            var t = timeSinceStart / this._duration;
	            this.value = _interpolate(this.start, this.end, this._curve(t));
	            this.emit('update', this.value);
	        }
	        else {
	            this.emit('update', this.end);

	            dirtyQueue.push(function(){
	                this.reset(this.end);
	                this._active = false;
	                this.emit('end', this.end);
	            }.bind(this));
	        }
	    };

	    function getCurve(curveName) {
	        var curve = registeredCurves[curveName];
	        if (curve !== undefined) return curve;
	        else throw new Error('curve not registered');
	    }

	    function _interpolate(a, b, t) {
	        var result;
	        if (a instanceof Array){
	            result = [];
	            for (var i = 0; i < a.length; i++){
	                if (typeof a[i] === 'number')
	                    result.push(_interpolate1D(a[i], b[i], t));
	                else result.push(a[i]);
	            }

	        }
	        else result = _interpolate1D(a, b, t);
	        return result;
	    }

	    function _interpolate1D(a, b, t){
	        return ((1 - t) * a) + (t * b);
	    }

	    function _calculateVelocity1D(current, start, curve, duration, t) {
	        return (current - start) * (curve(t + eps) - curve(t - eps)) / (2 * eps * duration);
	    }

	    function _calculateVelocity(current, start, curve, duration, t) {
	        var result;
	        if (current instanceof Array){
	            result = [];
	            for (var i = 0; i < current.length; i++){
	                if (typeof current[i] === 'number')
	                    result.push(_calculateVelocity1D(current[i], start[i], curve, duration, t));
	                else result.push(current[i]);
	            }
	        }
	        else result = _calculateVelocity1D(current, start, curve, duration, t);
	        return result;
	    }

	    module.exports = Tween;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    var EventHandler = __webpack_require__(3);
	    var SimpleStream = __webpack_require__(12);

	    function Transition(value, velocity) {
	        SimpleStream.call(this);

	        this.value = value || 0;
	        this.velocity = velocity || 0;

	        this.start = value;
	        this.end = 0;

	        this.energy = Number.NaN;
	        this._previousTime = Number.NaN;
	        this._active = false;

	        this._eventOutput = new EventHandler();
	        EventHandler.setOutputHandler(this, this._eventOutput);
	    }

	    Transition.DIMENSIONS = 1;

	    Transition.DEFAULT_OPTIONS = {};

	    Transition.prototype = Object.create(SimpleStream.prototype);
	    Transition.prototype.constructor = Transition;

	    /**
	     * Set new value to transition to, with a transition definition.
	     *
	     * @method set
	     * @param value {Number}                Starting value
	     * @param [transition] {Object}         Transition definition
	     */
	    Transition.prototype.set = function (value, transition) {
	        if (!this._active) {
	            this.emit('start', this.get());
	            this._active = true;
	        }

	        this.start = this.get();
	        this.end = value;

	        if (transition && transition.velocity) this.velocity = transition.velocity;
	        else this.velocity = this.velocity || 0;

	        this._previousTime = Date.now();
	    };

	    /**
	     * Get current value.
	     *
	     * @method get
	     * @return {Number}
	     */
	    Transition.prototype.get = function () {
	        return this.value;
	    };

	    /**
	     * Get current velocity
	     *
	     * @method getVelocity
	     * @returns {Number}
	     */
	    Transition.prototype.getVelocity = function () {
	        return this.velocity;
	    };

	    /**
	     * Reset the value and velocity of the transition.
	     *
	     * @method reset
	     * @param value {Number}       Value
	     * @param [velocity] {Number}  Velocity
	     */
	    Transition.prototype.reset = function (value, velocity) {
	        this.start = value;
	        this.value = value;
	        this.velocity = velocity || 0;
	    };

	    /**
	     * Halt transition at current state and erase all pending actions.
	     *
	     * @method halt
	     */
	    Transition.prototype.halt = function () {
	        if (!this._active) return;
	        this._active = false;
	        var value = this.get();
	        this.reset(value);
	        this.emit('end', value);
	    };

	    /**
	     * Check to see if Inertia is actively transitioning
	     *
	     * @method isActive
	     * @returns {Boolean}
	     */
	    Transition.prototype.isActive = function isActive() {
	        return this._active;
	    };

	    /**
	     * Update the transition in time.
	     *
	     * @method update
	     */
	    Transition.prototype.update = function update() {};

	    module.exports = Transition;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    var Transition = __webpack_require__(20);
	    var dirtyQueue = __webpack_require__(7);

	    var now = Date.now;
	    var eps = 1e-6; // for calculating velocity using finite difference
	    var tolerance = 1e-9; // energy minimum

	    /**
	     * A method of interpolating between start and end values with
	     *  a spring transition.
	     *
	     * @class Spring
	     * @private
	     * @namespace Transitions
	     * @constructor
	     * @param value {Number}    Initial value
	     * @param velocity {Number} Initial velocity
	     */
	    function Spring(value, velocity) {
	        Transition.apply(this, arguments);
	        this.curve = null;
	        this.energyTolerance = tolerance;
	    }

	    Spring.DIMENSIONS = 1;

	    Spring.DEFAULT_OPTIONS = {
	        velocity: 0,
	        damping: 0.5,
	        period : 100
	    };

	    Spring.prototype = Object.create(Transition.prototype);
	    Spring.prototype.constructor = Spring;

	    /**
	     * Set new value to transition to.
	     *
	     * @method set
	     * @param value {Number}                End value
	     * @param transition {Object}           Transition definition
	     */
	    Spring.prototype.set = function (value, transition) {
	        Transition.prototype.set.apply(this, arguments);

	        var damping = transition.damping || Spring.DEFAULT_OPTIONS.damping;
	        var period = transition.period || Spring.DEFAULT_OPTIONS.period;

	        this.curve = getCurve(damping, period, this.start, this.end, this.velocity);
	        this.energy = calculateEnergy(period);

	        var spread = getSpread(this.end, this.start);
	        this.energyTolerance = tolerance * Math.pow(spread, 2);
	    };

	    /**
	     * Update the transition in time.
	     *
	     * @method update
	     */
	    Spring.prototype.update = function update() {
	        if (!this._active) return;

	        var timeSinceStart = now() - this._previousTime;

	        this.value = this.curve(timeSinceStart);
	        var next = this.curve(timeSinceStart + eps);
	        var prev = this.curve(timeSinceStart - eps);

	        this.velocity = (next - prev) / (2 * eps);

	        var energy = this.energy(this.end, this.value, this.velocity);

	        if (energy >= this.energyTolerance) {
	            this.emit('update', this.value);
	        }
	        else {
	            this.emit('update', this.end);

	            dirtyQueue.push(function(){
	                this.reset(this.end);
	                this._active = false;
	                this.emit('end', this.end);
	            }.bind(this));
	        }
	    };

	    function getSpread(x0, value){
	        return Math.max(1, Math.abs(value - x0));
	    }

	    function getCurve(damping, period, x0, value, v0){
	        if (damping < 1)
	            return createUnderDampedSpring(damping, period, x0, value, v0);
	        else if (damping === 1)
	            return createCriticallyDampedSpring(damping, period, x0, value, v0);
	        else
	            return createOverDampedSpring(damping, period, x0, value, v0);
	    }

	    function calculateEnergy(period){
	        var omega = 2 * Math.PI / period;

	        return function(origin, position, velocity){
	            var distance = origin - position;
	            var potentialEnergy = omega * omega * distance * distance;
	            var kineticEnergy = velocity * velocity;
	            return kineticEnergy + potentialEnergy;
	        }
	    }

	    function createUnderDampedSpring(damping, period, x0, x1, v0) {
	        var wD =  Math.sqrt(1 - damping * damping) / period; // damped frequency
	        var A = x0 - x1;
	        var B = (damping / period * A + v0) / (wD);

	        return function (t) {
	            return x1 + Math.exp(-damping * t / period) *
	                (A * Math.cos(wD * t) + B * Math.sin(wD * t));
	        }
	    }

	    function createCriticallyDampedSpring(damping, period, x0, x1, v0) {
	        var A = x0 - x1;
	        var B = v0 + A / period;

	        return function (t) {
	            return x1 + Math.exp(-damping * t / period) * (A + B * t);
	        }
	    }

	    function createOverDampedSpring(damping, period, x0, x1, v0) {
	        var wD = Math.sqrt(damping * damping - 1) / period; // damped frequency
	        var r1 = -damping / period + wD;
	        var r2 = -damping / period - wD;
	        var L = x0 - x1;
	        var const1 = (r1 * L - v0) / (r2 - r1);
	        var A = L + const1;
	        var B = -const1;

	        return function (t) {
	            return x1 + A * Math.exp(r1 * t) + B * Math.exp(r2 * t);
	        }
	    }

	    module.exports = Spring;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    var Transition = __webpack_require__(20);
	    var dirtyQueue = __webpack_require__(7);

	    var now = Date.now;
	    var tolerance = 1e-4; // energy minimum

	    /**
	     * Defines an inertial transition, which decreases
	     *
	     * @class Inertia
	     * @private
	     * @namespace Transitions
	     * @constructor
	     * @param value {Number}    Initial value
	     * @param velocity {Number} Initial velocity
	     */
	    function Inertia(value, velocity) {
	        Transition.apply(this, arguments);
	        this.drag = 0;
	    }

	    Inertia.DIMENSIONS = 1;

	    Inertia.DEFAULT_OPTIONS = {
	        velocity: 0,
	        drag: 0.1
	    };

	    Inertia.prototype = Object.create(Transition.prototype);
	    Inertia.prototype.constructor = Inertia;

	    /**
	     * Set new value to transition to, with a transition definition.
	     *
	     * @method set
	     * @param value {Number}                Starting value
	     * @param [transition] {Object}         Transition definition
	     */
	    Inertia.prototype.set = function (value, transition) {
	        Transition.prototype.set.apply(this, arguments);

	        this.drag = (transition.drag === undefined)
	            ? Inertia.DEFAULT_OPTIONS.drag
	            : Math.pow(Math.min(transition.drag, 1), 3);
	    };

	    /**
	     * Update the transition in time.
	     *
	     * @method update
	     */
	    Inertia.prototype.update = function update() {
	        if (!this._active) return;

	        var currentTime = now();
	        var dt = currentTime - this._previousTime;
	        this._previousTime = currentTime;

	        this.velocity *= (1 - this.drag);
	        this.value += dt * this.velocity;

	        var energy = 0.5 * this.velocity * this.velocity;

	        if (energy >= tolerance) {
	            this.emit('update', this.value);
	        }
	        else {
	            this.emit('update', this.value);

	            dirtyQueue.push(function(){
	                this.reset(this.value);
	                this._active = false;
	                this.emit('end', this.value);
	            }.bind(this));
	        }
	    };

	    module.exports = Inertia;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    var Transition = __webpack_require__(20);
	    var dirtyQueue = __webpack_require__(7);

	    var now = Date.now;
	    var tolerance = 1e-6; // energy minimum

	    /**
	     * Defines an damping transition, which decreases the set value to 0 by repeatedly
	     *  scaling it by the damping factor each tick.
	     *
	     * @class Inertia
	     * @private
	     * @namespace Transitions
	     * @constructor
	     * @param value {Number}    Initial value
	     * @param velocity {Number} Initial velocity
	     */
	    function Damp(value, velocity) {
	        Transition.apply(this, arguments);
	        this.damp = 0;
	    }

	    Damp.DIMENSIONS = 1;

	    Damp.DEFAULT_OPTIONS = {
	        damping: 0.9
	    };

	    Damp.prototype = Object.create(Transition.prototype);
	    Damp.prototype.constructor = Damp;

	    /**
	     * Set new value to transition to, with a transition definition.
	     *
	     * @method set
	     * @param value {Number}                Starting value
	     * @param transition {Object}           Transition definition
	     */
	    Damp.prototype.set = function (value, transition) {
	        Transition.prototype.set.apply(this, arguments);

	        this.damp = (transition.damping === undefined)
	            ? Damp.DEFAULT_OPTIONS.damping
	            : transition.damping;
	    };

	    /**
	     * Update the transition in time.
	     *
	     * @method update
	     */
	    Damp.prototype.update = function update() {
	        if (!this._active) return;

	        var currentTime = now();
	        var dt = currentTime - this._previousTime;
	        this._previousTime = currentTime;

	        var newValue = this.value * this.damp;
	        this.velocity = 1 / dt * (this.value - newValue);

	        this.value = newValue;

	        var energy = 0.5 * this.value * this.value;

	        if (energy >= tolerance) {
	            this.emit('update', this.value);
	        }
	        else {
	            this.emit('update', this.value);

	            dirtyQueue.push(function(){
	                this.reset(this.value);
	                this._active = false;
	                this.emit('end', this.value);
	            }.bind(this));
	        }
	    };

	    module.exports = Damp;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    var Transition = __webpack_require__(20);
	    var dirtyQueue = __webpack_require__(7);

	    /**
	     * An immediate transition, with no interpolation between values.
	     *  Only emits `start` and `end` events.
	     *
	     * @method set
	     * @param value {Number}                End value
	     */
	    function Immediate(value) {
	        Transition.apply(this, arguments);
	    }

	    Immediate.DIMENSIONS = Infinity;

	    Immediate.prototype = Object.create(Transition.prototype);
	    Immediate.prototype.constructor = Immediate;

	    /**
	     * Set new value to transition to.
	     *
	     * @method set
	     * @param value {Number}                End value
	     * @param transition {Object}           Transition definition
	     */
	    Immediate.prototype.set = function(value){
	        this.value = value;
	        Transition.prototype.set.apply(this, arguments);
	        dirtyQueue.push(function() {
	            this.emit('end', this.value);
	        }.bind(this));
	    }

	    module.exports = Immediate;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Controller = __webpack_require__(26);
	    var RenderTreeNode = __webpack_require__(28);
	    var SizeNode = __webpack_require__(32);
	    var LayoutNode = __webpack_require__(29);

	    /**
	     * A View provides encapsulation for a subtree of the render tree. You can build
	     *  complicated visual components and add them to a render tree as you would a `Surface`.
	     *
	     *  Custom `Views` are created by calling `extend` on the `View` constructor.
	     *
	     *  In addition to what a `Controller` provides, a View provides:
	     *
	     *      Render Tree method: `.add`
	     *      Size methods: `setSize`, `setProportions`
	     *      Layout methods: `setOpacity`, `setOrigin`
	     *
	     *  @example
	     *
	     *      var MyView = View.extend({
	     *          defaults : {
	     *              defaultOption1 : '',
	     *              defaultOption2 : 42
	     *          },
	     *          initialize : function(options){
	     *              // this method called on instantiation
	     *              // options are passed in after being patched by the specified defaults
	     *
	     *              var surface = new Surface({
	     *                  content : options.defaultOption1,
	     *                  size : [options.defaultOption2,100],
	     *                  properties : {background : 'red'}
	     *              });
	     *
	     *              this.add(surface);
	     *          }
	     *      });
	     *
	     *      var myView = new myView({defaultOption1 : 'hello'});
	     *
	     *      var context = Context();
	     *      context.add(myView);
	     *
	     *      context.mount(document.body);
	     *
	     * @class View
	     * @constructor
	     * @extends Core.Controller
	     * @uses Core.SizeNode
	     * @uses Core.LayoutNode
	     * @uses Core.SimpleStream
	     */
	    var View = Controller.extend({
	        defaults : {
	            size : null,
	            origin : null,
	            opacity : 1
	        },
	        events : {
	            change : setOptions
	        },
	        constructor : function View(options){
	            this._sizeNode = new SizeNode();
	            this._layoutNode = new LayoutNode();

	            this._node = new RenderTreeNode();

	            this._addNode = this._node.add(this._sizeNode).add(this._layoutNode);

	            this.size = this._addNode.size; // actual size
	            this._size = this._node.size; // incoming parent size

	            this._cachedSize = [0, 0];

	            this.size.on('start', updateSize.bind(this));
	            this.size.on('update', updateSize.bind(this));
	            this.size.on('end', updateSize.bind(this));

	            Controller.call(this, options);
	            if (this.options) setOptions.call(this, this.options);
	        },
	        _onAdd : function(parent){
	            return parent.add(this._node);
	        },
	        /**
	         * Extends the render tree subtree with a new node.
	         *
	         * @method add
	         * @param object {SizeNode|LayoutNode|Surface} Node
	         * @return {RenderTreeNode}
	         */
	        add : function add(){
	            return RenderTreeNode.prototype.add.apply(this._addNode, arguments);
	        },
	        /**
	         * Remove the View from the RenderTree. All Surfaces added to the View
	         *  will also be removed. The View can be added back at a later time and
	         *  all of its data and Surfaces will be restored.
	         *
	         * @method remove
	         */
	        remove : function remove(){
	            RenderTreeNode.prototype.remove.apply(this._node, arguments);
	        },
	        /**
	         * Getter for size.
	         *
	         * @method getSize
	         * @return size {Number[]}
	         */
	        getSize : function(){
	            return this._cachedSize;
	        },
	        /**
	         * Setter for size.
	         *
	         * @method setSize
	         * @param size {Number[]|Stream} Size as [width, height] in pixels, or a stream.
	         */
	        setSize : function setSize(size){
	            this._cachedSize = size;
	            this._sizeNode.set({size : size});
	        },
	        /**
	         * Setter for proportions.
	         *
	         * @method setProportions
	         * @param proportions {Number[]|Stream} Proportions as [x,y], or a stream.
	         */
	        setProportions : function setProportions(proportions){
	            this._sizeNode.set({proportions : proportions});
	        },
	        /**
	         * Setter for margins.
	         *
	         * @method setMargins
	         * @param margins {Number[]|Stream} Margins as [x,y], or a stream.
	         */
	        setMargins : function setMargins(margins){
	            this._sizeNode.set({margins : margins});
	        },
	        /**
	         * Setter for aspect ratio.
	         *
	         * @method setAspectRatio
	         * @deprecated Use size functions instead
	         * @param aspectRatio {Number|Stream} Aspect ratio, or a stream.
	         */
	        setAspectRatio: function setAspectRatio(aspectRatio) {
	            this._sizeNode.set({aspectRatio: aspectRatio});
	        },
	        /**
	         * Setter for origin.
	         *
	         * @method setOrigin
	         * @param origin {Number[]|Stream} Origin as [x,y], or a stream.
	         */
	        setOrigin : function setOrigin(origin){
	            this._layoutNode.set({origin : origin});
	        },
	        /**
	         * Setter for opacity.
	         *
	         * @method setOpacity
	         * @param opacity {Number|Stream} Opacity
	         */
	        setOpacity : function setOpacity(opacity){
	            this._layoutNode.set({opacity : opacity});
	        }
	    });

	    function updateSize(size){
	        if (this._cachedSize[0] === size[0] && this._cachedSize[1] === size[1]) return;
	        this._cachedSize = size;
	        this.emit('resize', size);
	    }

	    function setOptions(options){
	        for (var key in options){
	            var value = options[key];
	            switch (key){
	                case 'size':
	                    this.setSize(value);
	                    break;
	                case 'proportions':
	                    this.setProportions(value);
	                    break;
	                case 'margins':
	                    this.setMargins(value);
	                    break;
	                case 'aspectRatio':
	                    this.setAspectRatio(value);
	                    break;
	                case 'origin':
	                    this.setOrigin(value);
	                    break;
	                case 'opacity':
	                    this.setOpacity(value);
	                    break;
	            }
	        }
	    }

	    module.exports = View;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var OptionsManager = __webpack_require__(27);
	    var EventHandler = __webpack_require__(3);
	    var SimpleStream = __webpack_require__(12);

	    /**
	     * A utility class which can be extended by custom classes. These classes will then
	     *  include event input and output streams, a optionsManager for handling optional
	     *  parameters with defaults, and take an event dictionary.
	     *
	     *  Specifically, instantiations will have an `options` dictionary property,
	     *  `input`, `output` stream properties, and
	     *  `on`, `off`, `emit`, `trigger`, `subscribe`, `unsubscribe` methods.
	     *
	     *  @example
	     *
	     *      var MyClass = Controller.extend({
	     *          defaults : {
	     *              defaultOption1 : value1,
	     *              defaultOption2 : value2
	     *          },
	     *          events : {
	     *              'change' : myUpdateOptionsFunction
	     *          },
	     *          initialize : function(options){
	     *              // this method called on instantiation
	     *              // options are passed in after being patched by the specified defaults
	     *
	     *              this.input.on('test', function(){
	     *                  console.log('test fired');
	     *              });
	     *          }
	     *      });
	     *
	     *      var myInstance = new MyClass({
	     *          defaultOption1 : value3
	     *      });
	     *
	     *      // myInstance.options = {
	     *      //     defaultOption1 : value3,
	     *      //     defaultOption2 : value2
	     *      // }
	     *
	     *      myInstance.subscribe(anotherStream);
	     *
	     *      anotherStream.emit('test'); // "test fired" in console
	     *
	     * @class Controller
	     * @private
	     * @constructor
	     * @namespace Core
	     * @uses Core.OptionsManager
	     * @param options {Object} Instance options
	     */
	    function Controller(options) {
	        // set options
	        this.options = _clone(this.constructor.DEFAULT_OPTIONS || Controller.DEFAULT_OPTIONS);
	        this._optionsManager = new OptionsManager(this.options);
	        if (options) this.setOptions(options);

	        // set input and output streams
	        this.input = new SimpleStream();
	        this.output = new SimpleStream();
	        EventHandler.setInputHandler(this, this.input);
	        EventHandler.setOutputHandler(this, this.output);

	        // bind events defined in the constructor's EVENTS dictionary to the input
	        setInputEvents.call(this, this.constructor.EVENTS || Controller.EVENTS, this.input);

	        this.input.bindThis(this);
	        this.input.subscribe(this._optionsManager);

	        if (this.initialize) this.initialize(this.options);
	    }

	    /**
	     * Overwrite the DEFAULT_OPTIONS dictionary on the constructor of the class you wish to extend
	     *  with the Controller to patch any options that are not prescribed on instantiation.
	     *
	     * @attribute DEFAULT_OPTIONS
	     * @readOnly
	     */
	    Controller.DEFAULT_OPTIONS = {};

	    /**
	     * Overwrite the EVENTS dictionary on the constructor of the class you wish to extend
	     *  with the Controller to include events in {key : value} pairs where the keys are
	     *  event channel names and the values are functions to be executed.
	     *
	     * @attribute EVENTS
	     * @readOnly
	     */
	    Controller.EVENTS = {};

	    /**
	     * Options getter.
	     *
	     * @method getOptions
	     * @param key {string}      Key
	     * @return object {Object}  Options value for the key
	     */
	    Controller.prototype.getOptions = function getOptions(key) {
	        return OptionsManager.prototype.getOptions.apply(this._optionsManager, arguments);
	    };

	    /**
	     *  Options setter.
	     *
	     *  @method setOptions
	     *  @param options {Object} Options
	     */
	    Controller.prototype.setOptions = function setOptions() {
	        OptionsManager.prototype.setOptions.apply(this._optionsManager, arguments);
	    };

	    function _clone(obj) {
	        var copy;
	        if (typeof obj === 'object') {
	            copy = (obj instanceof Array) ? [] : {};
	            for (var key in obj) {
	                var value = obj[key];
	                if (typeof value === 'object' && value !== null) {
	                    if (value instanceof Array) {
	                        copy[key] = [];
	                        for (var i = 0; i < value.length; i++)
	                            copy[key][i] = _clone(value[i]);
	                    }
	                    else copy[key] = _clone(value);
	                }
	                else copy[key] = value;
	            }
	        }
	        else copy = obj;

	        return copy;
	    }

	    /**
	     * Constructor helper method. Given an events dictionary of {eventName : handler} pairs, attach them to
	     *  a provided input handler for an object. The `handler` can be a string, in which case the string resolves
	     *  to a method with the string's name defined on the object.
	     */
	    function setInputEvents(events, inputHandler){
	        for (var key in events) {
	            var handlerName = events[key];
	            var handler = (typeof handlerName === 'string')
	                ? this[handlerName]
	                : handlerName;
	            if (handler) inputHandler.on(key, handler.bind(this));
	        }
	    }
	    
	    var RESERVED_KEYS = {
	        DEFAULTS : 'defaults',
	        EVENTS : 'events'
	    };

	    function extend(properties, constructorProperties){
	        var parent = this;

	        var child = (properties.hasOwnProperty('constructor'))
	            ? function(){ properties.constructor.apply(this, arguments); }
	            : function(){ parent.apply(this, arguments); };

	        child.extend = extend;
	        child.prototype = Object.create(parent.prototype);
	        child.prototype.constructor = child;

	        for (var key in properties){
	            var value = properties[key];
	            switch (key) {
	                case RESERVED_KEYS.DEFAULTS:
	                    child.DEFAULT_OPTIONS = value;
	                    break;
	                case RESERVED_KEYS.EVENTS:
	                    if (!child.EVENTS) child.EVENTS = value;
	                    else
	                        for (var type in value)
	                            child.EVENTS[type] = value[type];
	                    break;
	                default:
	                    child.prototype[key] = value;
	            }
	        }

	        for (key in constructorProperties)
	            child[key] = constructorProperties[key];

	        return child;
	    }

	    /**
	     * Extend the Controller class with user-defined instance properties, as well as constructor
	     *  properties.
	     *
	     * @method extend
	     * @static
	     * @private
	     * @param properties {Object}               User-defined instance methods and properties
	     * @param [constructorProperties] {Object}  Constructor properties
	     */
	    Controller.extend = extend;

	    module.exports = Controller;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(3);

	    /**
	     *  A utility for setting options in a class that enables patching options
	     *   with prescribed defaults and emitting `change` events when options are changed.
	     *   Recursively defined for nested options objects.
	     *
	     *   Note: only JSONable objects are allowed, so no functions.
	     *
	     * @class OptionsManager
	     * @namespace Core
	     * @constructor
	     * @private
	     * @uses Core.EventHandler
	     * @param value {Object} Options object literal
	     */
	    function OptionsManager(value) {
	        this._value = value;
	        this._eventHandler = null;
	    }

	    /**
	     * Constructor method. Create OptionsManager from source dictionary with arguments overridden by patch dictionary.
	     *
	     * @method OptionsManager.patch
	     * @param options {Object}          Options to be patched
	     * @param patch {...Object}         Options to override
	     * @return source {Object}
	     */
	    OptionsManager.patch = function patch(options, patch) {
	        var manager = new OptionsManager(options);
	        for (var i = 1; i < arguments.length; i++) manager.patch(arguments[i]);
	        return options;
	    };

	    /**
	     * Constructor method. Convenience method to set options with defaults on an object instance.
	     *
	     * @method OptionsManager.setOptions
	     * @param instance {Function}    Constructor
	     * @param options {Object}       Overriding options
	     * @param defaults {Object}      Default options
	     * @return {Object}              Patched options
	     */
	    // TODO: subscribe to change events
	    OptionsManager.setOptions = function(instance, options, defaults){
	        defaults = defaults || _clone(instance.constructor.DEFAULT_OPTIONS) || {};
	        var optionsManager = new OptionsManager(defaults);
	        instance.setOptions = OptionsManager.prototype.setOptions.bind(optionsManager);
	        instance.getOptions = OptionsManager.prototype.getOptions.bind(optionsManager);
	        if (options) instance.setOptions(options);
	        return optionsManager.get();
	    };

	    function _createEventHandler() {
	        if (!this._eventHandler) this._eventHandler = new EventHandler();
	    }

	    /**
	     * Patch options with provided patches. Triggers `change` event on the object.
	     *
	     * @method patch
	     * @param options {Object}          Patch options
	     * @return this {OptionsManager}
	     */
	    OptionsManager.prototype.patch = function patch(options) {
	        var myState = this._value;
	        for (var key in options) {
	            if ((key in myState) && (options[key] && options[key].constructor === Object) && (myState[key] && myState[key].constructor === Object)) {
	                if (!myState.hasOwnProperty(key)) myState[key] = Object.create(myState[key]);
	                this.key(key).patch(options[key]);
	                if (this._eventHandler) this._eventHandler.emit('change', {key: key, value: this.key(key).value()});
	            }
	            else this.set(key, options[key]);
	        }
	        return this;
	    };

	    /**
	     * Alias for patch
	     *
	     * @method setOptions
	     */
	    OptionsManager.prototype.setOptions = OptionsManager.prototype.patch;

	    /**
	     * Return OptionsManager based on sub-object retrieved by `key`.
	     *
	     * @method key
	     * @param key {string}      Key
	     * @return {OptionsManager} Value
	     */
	    OptionsManager.prototype.key = function key(key) {
	        var result = new OptionsManager(this._value[key]);
	        if (!(result._value instanceof Object) || result._value instanceof Array) result._value = {};
	        return result;
	    };

	    /**
	     * Look up options value by key or get the full options hash.
	     *
	     * @method get
	     * @param key {string}  Key
	     * @return {Object}     Associated object or full options hash
	     */
	    OptionsManager.prototype.get = function get(key) {
	        return key ? this._value[key] : this._value;
	    };

	    /**
	     * Alias for get
	     *
	     * @method getOptions
	     */
	    OptionsManager.prototype.getOptions = OptionsManager.prototype.get;

	    /**
	     * Set key to value. Outputs `change` event if a value is overwritten.
	     *
	     * @method set
	     * @param key {string}          Key
	     * @param value {Object}        Value
	     * @return {OptionsManager}     Updated OptionsManager
	     */
	    OptionsManager.prototype.set = function set(key, value) {
	        var originalValue = this.get(key);
	        this._value[key] = value;
	        if (this._eventHandler && value !== originalValue) this._eventHandler.emit('change', {key: key, value: value});
	        return this;
	    };

	    /**
	     * Adds a handler to the `type` channel which will be executed on `emit`.
	     *
	     * @method "on"
	     * @param type {String}         Channel name
	     * @param handler {Function}    Callback
	     */
	    OptionsManager.prototype.on = function on(type, handler) {
	        _createEventHandler.call(this);
	        EventHandler.prototype.on.apply(this._eventHandler, arguments);
	    };

	    /**
	     * Removes the `handler` from the `type` channel.
	     *   This undoes the work of `on`.
	     *
	     * @method off
	     * @param type {String}         Channel name
	     * @param handler {Function}    Callback
	     */
	    OptionsManager.prototype.off = function off(type, handler) {
	        _createEventHandler.call(this);
	        EventHandler.prototype.off.apply(this._eventHandler, arguments);
	    };

	    function _clone(obj) {
	        var copy;
	        if (typeof obj === 'object') {
	            copy = (obj instanceof Array) ? [] : {};
	            for (var key in obj) {
	                var value = obj[key];
	                if (typeof value === 'object' && value !== null) {
	                    if (value instanceof Array) {
	                        copy[key] = [];
	                        for (var i = 0; i < value.length; i++)
	                            copy[key][i] = _clone(value[i]);
	                    }
	                    else copy[key] = _clone(value);
	                }
	                else copy[key] = value;
	            }
	        }
	        else copy = obj;

	        return copy;
	    }

	    module.exports = OptionsManager;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(3);
	    var SimpleStream = __webpack_require__(12);
	    var Stream = __webpack_require__(16);
	    var LayoutNode = __webpack_require__(29);
	    var SizeNode = __webpack_require__(32);
	    var layoutAlgebra = __webpack_require__(33);
	    var sizeAlgebra = __webpack_require__(34);
	    var preTickQueue = __webpack_require__(6);
	    var dirtyQueue = __webpack_require__(7);

	    /**
	     * A node in the render tree. As such, it wraps a layout or size node,
	     *  providing them with an `add` method. By adding nodes, the render tree
	     *  is constructed, the leaves of which are `Surfaces`.
	     *
	     *  @constructor
	     *  @class RenderTreeNode
	     *  @private
	     *  @param object {Object|SizeNode|LayoutNode|Surface|View}
	     */
	    function RenderTreeNode(object) {
	        // layout and size inputs
	        this._layout = new EventHandler();
	        this._size = new EventHandler();
	        this._logic = new EventHandler();

	        // layout and size streams
	        this.size = new SimpleStream();
	        this.layout = new SimpleStream();

	        // set node middleware
	        if (object) _set.call(this, object);
	        else {
	            // if no middleware specified, connect input to output
	            this.layout.subscribe(this._layout);
	            this.size.subscribe(this._size);
	        }

	        // save last spec if node is removed and later added
	        this._cachedSpec = {
	            layout : null,
	            size : null
	        };

	        // update size cache
	        this.size.on('start', updateSizeCache.bind(this));
	        this.size.on('update', updateSizeCache.bind(this));
	        this.size.on('end', updateSizeCache.bind(this));

	        // update layout spec
	        this.layout.on('start', updateLayoutCache.bind(this));
	        this.layout.on('update', updateLayoutCache.bind(this));
	        this.layout.on('end', updateLayoutCache.bind(this));

	        // reference to RootNode if a node is removed and later added
	        this.root = null;

	        this._logic.on('mount', function(node){
	            this.root = node;
	        }.bind(this));

	        this._logic.on('unmount', function() {
	            this.root = null;
	        }.bind(this));
	    }

	    function updateLayoutCache(layout){
	        this._cachedSpec.layout = layout;
	    }

	    function updateSizeCache(size){
	        this._cachedSpec.size = size;
	    }

	    /**
	     * Extends the render tree with a new node. Similar to how a tree data structure
	     *  is created, but instead of a node with an array of children, children subscribe
	     *  to notifications from the parent.
	     *
	     *  Nodes can be instances of `LayoutNode`, `SizeNode`, or Object literals with
	     *  size and layout properties, in which case, appropriate nodes will be created.
	     *
	     *  This method also takes `Views` (subtrees) and `Surfaces` (leaves).
	     *
	     * @method add
	     * @chainable
	     * @param node {Object|Node|Surface|View} Node
	     * @return {RenderTreeNode}
	     */
	    RenderTreeNode.prototype.add = function add(node) {
	        var childNode;

	        if (node.constructor === Object){
	            // Object literal case
	            return _createNodeFromObjectLiteral.call(this, node);
	        }
	        else if (node._onAdd){
	            // View case
	            return node._onAdd(this);
	        }
	        else if (node instanceof RenderTreeNode){
	            // RenderTree Node
	            childNode = node;
	        }
	        else {
	            // LayoutNode or SizeNode or Surface
	            childNode = new RenderTreeNode(node);
	        }

	        childNode._layout.subscribe(this.layout);
	        childNode._size.subscribe(this.size);
	        childNode._logic.subscribe(this._logic);

	        // Called when node is removed and later added
	        if (this.root && !childNode.root)
	            childNode._logic.trigger('mount', this.root);

	        // Emit previously cached values if node was removed
	        if (!node.root){
	            var self = this;
	            preTickQueue.push(function(){
	                if (!self._cachedSpec.size) return;
	                self.size.trigger('start', self._cachedSpec.size);
	                self.layout.trigger('start', self._cachedSpec.layout);
	                dirtyQueue.push(function(){
	                    self.size.trigger('end', self._cachedSpec.size);
	                    self.layout.trigger('end', self._cachedSpec.layout);
	                });
	            });
	        }

	        return childNode;
	    };

	    /**
	     * Remove the node from the Render Tree
	     *
	     * @method remove
	     */
	    RenderTreeNode.prototype.remove = function (){
	        this._logic.trigger('unmount');
	        this._layout.unsubscribe();
	        this._size.unsubscribe();
	        this._logic.unsubscribe();
	    };

	    // Creates a combination of Size/Layout nodes from an object literal
	    // depending on its keys
	    function _createNodeFromObjectLiteral(object){
	        var sizeKeys = {};
	        var layoutKeys = {};

	        var needsSize = false;
	        var needsLayout = false;

	        var node = this;

	        for (var key in object){
	            if (SizeNode.KEYS[key]){
	                sizeKeys[key] = object[key];
	                needsSize = true;
	            }
	            else if (LayoutNode.KEYS[key]){
	                layoutKeys[key] = object[key];
	                needsLayout = true;
	            }
	        }

	        // create extra align node if needed
	        if (needsSize && layoutKeys.align){
	            var alignNode = new LayoutNode({
	                align : layoutKeys.align
	            });
	            delete layoutKeys.align;
	            node = node.add(alignNode);
	        }

	        // create size node first if needed
	        if (needsSize)
	            node = node.add(new SizeNode(sizeKeys));

	        // create layout node if needed
	        if (needsLayout)
	            node = node.add(new LayoutNode(layoutKeys));

	        return node;
	    }

	    // Set node middleware. Can be an object, SizeNode, LayoutNode, or Surface
	    function _set(object) {
	        if (object instanceof SizeNode){
	            var size = Stream.lift(
	                function SGSizeAlgebra (objectSpec, parentSize){
	                    if (!parentSize) return false;
	                    return(objectSpec)
	                        ? sizeAlgebra(objectSpec, parentSize)
	                        : parentSize;
	                }.bind(this),
	                [object, this._size]
	            );
	            this.size.subscribe(size);
	            this.layout.subscribe(this._layout);
	        }
	        else if (object instanceof LayoutNode){
	            var layout = Stream.lift(
	                function SGLayoutAlgebra (objectSpec, parentSpec, size){
	                    if (!parentSpec || !size) return false;
	                    return (objectSpec)
	                        ? layoutAlgebra(objectSpec, parentSpec, size)
	                        : parentSpec;
	                }.bind(this),
	                [object, this._layout, this._size]
	            );
	            this.layout.subscribe(layout);
	            this.size.subscribe(this._size);
	        }
	        else {
	            this._logic.on('unmount', function() {
	                object.remove();
	            }.bind(this));

	            this._logic.on('mount', function(root) {
	                object.setup(root.allocator);
	            }.bind(this));

	            object.on('recall', function(){
	                object._size.unsubscribe(this._size);
	                object._layout.unsubscribe(this._layout);
	            }.bind(this));

	            object.on('deploy', function(){
	                object._size.subscribe(this._size);
	                object._layout.subscribe(this._layout);
	            }.bind(this));
	        }
	    }

	    module.exports = RenderTreeNode;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Node = __webpack_require__(30);

	    /**
	     * Encapsulates a stream of layout data (transform, origin, align, opacity).
	     *  Listens on start/update/end events, batches them, and emits them downstream
	     *  to descendant layout nodes.
	     *
	     *  @example
	     *
	     *      var context = Context();
	     *
	     *      var surface = new Surface({
	     *          size : [100,100],
	     *          properties : {background : 'red'}
	     *      });
	     *
	     *      var opacity = new Transitionable(1);
	     *
	     *      var layout = new LayoutNode({
	     *          transform : Transform.translateX(100),
	     *          opacity : opacity
	     *      });
	     *
	     *      context.add(layout).add(surface);
	     *      context.mount(document.body)
	     *
	     *      opacity.set(0, {duration : 1000});
	     *
	     * @class LayoutNode
	     * @constructor
	     * @namespace Core
	     * @private
	     * @param sources {Object}                          Object of layout sources
	     * @param [sources.transform] {Stream|Transform}    Transform source
	     * @param [sources.align] {Stream|Array}            Align source
	     * @param [sources.origin] {Stream|Array}           Origin source
	     * @param [sources.opacity] {Stream|Number}         Opacity source
	     */
	    function LayoutNode(sources) {
	        Node.call(this, sources);
	    }

	    LayoutNode.prototype = Object.create(Node.prototype);
	    LayoutNode.prototype.constructor = LayoutNode;

	    // Enumeration of types of layout properties
	    LayoutNode.KEYS = {
	        transform : true,
	        origin : true,
	        align : true,
	        opacity : true
	    };

	    module.exports = LayoutNode;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(3);
	    var SimpleStream = __webpack_require__(12);
	    var Stream = __webpack_require__(16);
	    var Observable = __webpack_require__(31);

	    /**
	     * Encapsulates a stream of layout data (transform, origin, align, opacity).
	     *  Listens on start/update/end events, batches them, and emits them downstream
	     *  to descendant layout nodes.
	     *
	     *  @example
	     *
	     *      var context = Context();
	     *
	     *      var surface = new Surface({
	     *          size : [100,100],
	     *          properties : {background : 'red'}
	     *      });
	     *
	     *      var opacity = new Transitionable(1);
	     *
	     *      var layout = new LayoutNode({
	     *          transform : Transform.translateX(100),
	     *          opacity : opacity
	     *      });
	     *
	     *      context.add(layout).add(surface);
	     *      context.mount(document.body)
	     *
	     *      opacity.set(0, {duration : 1000});
	     *
	     * @class Node
	     * @constructor
	     * @namespace Core
	     * @private
	     * @param sources {Object}                          Object of layout sources
	     * @param [sources.transform] {Stream|Transform}    Transform source
	     * @param [sources.align] {Stream|Array}            Align source
	     * @param [sources.origin] {Stream|Array}           Origin source
	     * @param [sources.opacity] {Stream|Number}         Opacity source
	     */
	    function Node(sources) {
	        this.stream = _createStream(sources);
	        EventHandler.setOutputHandler(this, this.stream);
	    }

	    /**
	     * Introduce new data streams to the layout node in {key : value} pairs.
	     *  Here the `key` is a value from one of `SizeNode.KEYS` or `LayoutNode.KEYS`.
	     *  The `value` is either a stream, or a simple type like a `Number` or `Array`.
	     *  Simple types will be wrapped in an `Observerable` to emit appropriate events.
	     *
	     * @method set
	     * @param sources {Object}      Object of data sources
	     */
	    Node.prototype.set = function(sources) {
	        // TODO: be able to overwrite streams. Not only add
	        for (var key in sources) {
	            var value = sources[key];

	            var source = (value instanceof SimpleStream)
	                ? value
	                : new Observable(value);

	            this.stream.addStream(key, source);
	        }
	    };

	    function _createStream(sources) {
	        for (var key in sources) {
	            var value = sources[key];
	            if (!(value instanceof SimpleStream)) {
	                var source = new Observable(value);
	                sources[key] = source;
	            }
	        }
	        return Stream.merge(sources);
	    }

	    module.exports = Node;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var SimpleStream = __webpack_require__(12);
	    var preTickQueue = __webpack_require__(6);
	    var dirtyQueue = __webpack_require__(7);

	    /**
	     * An Observable is a stream for events set discretely in time, as opposed to continuously.
	     *  It emits appropriate `start` and `end` events upon calling the `set` method.
	     *
	     * @class Observable
	     * @constructor
	     * @private
	     * @extends Streams.Stream
	     * @param value {Number, String, Array, Object} Value
	     */
	    function Observable(value){
	        SimpleStream.call(this);
	        this.value = value;

	        if (value !== undefined) this.set(value);
	    }

	    Observable.prototype = Object.create(SimpleStream.prototype);
	    Observable.prototype.constructor = Observable;

	    /**
	     * Getter for the provided value.
	     *
	     * @method get
	     * @return {Number, String, Array, Object}
	     */
	    Observable.prototype.get = function(){
	        return this.value;
	    };

	    /**
	     * Setter for the provided value.
	     *
	     * @method set
	     * @param value {Number, String, Array, Object} Value
	     */
	    Observable.prototype.set = function(value){
	        var self = this;
	        self.value = value;
	        preTickQueue.push(function(){
	            self.emit('start', value);
	            dirtyQueue.push(function(){
	                self.emit('end', value);
	            });
	        });
	    };

	    module.exports = Observable;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Node = __webpack_require__(30);

	    /**
	     * Encapsulates a stream of size data (size, proportions, margins).
	     *  Listens on start/update/end events, batches them, and emits resize events downstream
	     *  to descendant size nodes.
	     *
	     *  Size can be defined with height and width given numerically, but
	     *  they can also be:
	     *
	     *  ```
	     *      `undefined` - takes the parent value
	     *      `true`      - takes the DOM calculated value
	     *      `false`     - value defined by setting an aspect ratio
	     *  ```
	     *
	     *  @example
	     *
	     *      var context = Context();
	     *
	     *      var surface = new Surface({
	     *          size : [100,100],
	     *          properties : {background : 'red'}
	     *      });
	     *
	     *      var sizeNode = new SizeNode({
	     *          size : [100, undefined],
	     *          margins : [50, 50]
	     *      });
	     *
	     *      context.add(sizeNode).add(surface);
	     *      context.mount(document.body)
	     *
	     * @class SizeNode
	     * @namespace Core
	     * @constructor
	     * @private
	     * @param sources {Object}                      Object of size sources
	     * @param [sources.size] {Stream|Array}         Size source
	     * @param [sources.margin] {Stream|Array}       Margin source
	     * @param [sources.proportions] {Stream|Array}  Proportions source
	     * @param [sources.aspectRatio] {Stream|Number} Aspect ratio source
	     */
	    function SizeNode(sources) {
	        Node.call(this, sources);
	    }
	    
	    SizeNode.prototype = Object.create(Node.prototype);
	    SizeNode.prototype.constructor = SizeNode;

	    // Enumeration of types of size properties
	    SizeNode.KEYS = {
	        size : true,
	        proportions : true,
	        margins : true,
	        aspectRatio : true
	    };

	    module.exports = SizeNode;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Transform = __webpack_require__(9);

	    var DEFAULT = {
	        OPACITY : 1,
	        TRANSFORM : Transform.identity,
	        ORIGIN : null,
	        ALIGN : null
	    };

	    /**
	     * Defines the rules for composing layout specs: transform, align, origin and opacity.
	     *  Transform is multiplied by the parent's transform (matrix multiplication).
	     *  Align is a proportional offset relative to the parent size.
	     *  Origin is a proportional offset relative to the current size.
	     *  Opacity is multiplied by the parent's opacity.
	     *
	     * @method compose
	     * @private
	     * @param spec {object}           Object layout spec
	     * @param parentSpec {object}     Parent layout spec
	     * @param size {Array}            Object size
	     * @return {object}               The composed layout spec
	     */

	    function compose(spec, parentSpec, size){
	        var parentOpacity = (parentSpec.opacity !== undefined) ? parentSpec.opacity : DEFAULT.OPACITY;
	        var parentTransform = parentSpec.transform || DEFAULT.TRANSFORM;

	        var origin = spec.origin || DEFAULT.ORIGIN;
	        var align = spec.align || DEFAULT.ALIGN;

	        var opacity = (spec.opacity !== undefined)
	            ? parentOpacity * spec.opacity
	            : parentOpacity;

	        var transform = (spec.transform)
	            ? Transform.compose(parentTransform, spec.transform)
	            : parentTransform;

	        var nextSizeTransform = (spec.origin)
	            ? parentTransform
	            : parentSpec.nextSizeTransform || parentTransform;

	        if (spec.size)
	            nextSizeTransform = parentTransform;

	        if (origin && (origin[0] || origin[1])){
	            //TODO: allow origin to propogate when size is non-numeric
	            var tx = (typeof size[0] === 'number') ? -origin[0] * size[0] : 0;
	            var ty = (typeof size[1] === 'number') ? -origin[1] * size[1] : 0;
	            transform = Transform.moveThen([tx, ty, 0], transform);
	            origin = null;
	        }

	        if (size && align && (align[0] || align[1])) {
	            var shift = _vecInContext([align[0] * size[0], align[1] * size[1], 0], nextSizeTransform);
	            transform = Transform.thenMove(transform, shift);
	            align = null;
	        }

	        return {
	            transform : transform,
	            opacity : opacity,
	            origin : origin,
	            align : align,
	            nextSizeTransform : nextSizeTransform
	        };
	    }

	    function _vecInContext(v, m) {
	        return [
	            v[0] * m[0] + v[1] * m[4] + v[2] * m[8],
	            v[0] * m[1] + v[1] * m[5] + v[2] * m[9],
	            v[0] * m[2] + v[1] * m[6] + v[2] * m[10]
	        ];
	    }

	    module.exports = compose;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     * Defines the rules for composing size specs (size, margin, proportions) into a new size.
	     *  A margin array reduces the parent size by an amount specified in pixels.
	     *  A proportions array scales the parent size by a provided ratio.
	     *  A size array [width, height] can take `true`, `undefined`, or numeric values.
	     *      `undefined` takes the parent value
	     *      `true` takes the value defined by the DOM
	     *      numeric values override parent values
	     *
	     * @method compose
	     * @private
	     * @param spec {object}           Object size spec
	     * @param parentSize {object}     Parent size
	     * @return size {object}          Composed size
	     */

	    function compose(spec, parentSize){
	        if (!spec) return parentSize;

	        var size = new Array(2);

	        if (spec.size instanceof Function) {
	            size = spec.size(parentSize);
	        }
	        else if (spec.size instanceof Array) {
	            // inheritance
	            if (spec.size[0] === undefined) size[0] = parentSize[0];
	            if (spec.size[1] === undefined) size[1] = parentSize[1];

	            // override
	            if (typeof spec.size[0] === 'number') size[0] = spec.size[0];
	            if (typeof spec.size[1] === 'number') size[1] = spec.size[1];

	            if (spec.size[0] === true) size[0] = true;
	            if (spec.size[1] === true) size[1] = true;
	        }

	        if (spec.proportions) {
	            if (typeof spec.proportions[0] === 'number') size[0] = spec.proportions[0] * parentSize[0];
	            if (typeof spec.proportions[1] === 'number') size[1] = spec.proportions[1] * parentSize[1];
	        }

	        if (spec.aspectRatio) {
	            if (typeof size[0] === 'number') size[1] = spec.aspectRatio * size[0];
	            else if (typeof size[1] === 'number') size[0] = spec.aspectRatio * size[1];
	        }

	        if (size[0] === undefined) size[0] = parentSize[0];
	        if (size[1] === undefined) size[1] = parentSize[1];

	        if (spec.margins) {
	            size[0] -= 2 * spec.margins[0];
	            size[1] -= 2 * spec.margins[1];
	        }

	        return size;
	    }

	    module.exports = compose;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    module.exports = {
	        Surface: __webpack_require__(36),
	        ContainerSurface: __webpack_require__(38),
	        Context: __webpack_require__(39)
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var DOMOutput = __webpack_require__(37);
	    var EventHandler = __webpack_require__(3);
	    var Stream = __webpack_require__(16);
	    var SizeNode = __webpack_require__(32);
	    var LayoutNode = __webpack_require__(29);
	    var sizeAlgebra = __webpack_require__(34);
	    var layoutAlgebra = __webpack_require__(33);
	    var dirtyQueue = __webpack_require__(7);

	    var isTouchEnabled = 'ontouchstart' in window;
	    var isIOS = /iPad|iPhone|iPod/.test(navigator.platform);

	    /**
	     * Surface is a wrapper for a DOM element animated by Samsara.
	     *  Samsara will commit opacity, size and CSS3 `transform` properties into the Surface.
	     *  CSS classes, properties and DOM attributes can also be added and dynamically changed.
	     *  Surfaces also act as sources for DOM events such as `click`.
	     *
	     * @example
	     *
	     *      var context = new Context()
	     *
	     *      var surface = new Surface({
	     *          content : 'Hello world!',
	     *          size : [true,100],
	     *          opacity : .5,
	     *          classes : ['myClass1', 'myClass2'],
	     *          properties : {background : 'red'}
	     *      });
	     *
	     *      context.add(surface);
	     *
	     *      context.mount(document.body);
	     *
	     *  @example
	     *
	     *      // same as above but create an image instead
	     *      var surface = new Surface({
	     *          tagName : 'img',
	     *          attributes : {
	     *              src : 'cat.jpg'
	     *          },
	     *          size : [100,100]
	     *      });
	     *
	     * @class Surface
	     * @namespace DOM
	     * @constructor
	     * @uses DOM._DOMOutput
	     * @param [options] {Object}                Options
	     * @param [options.size] {Number[]}         Size (width, height) in pixels. These can also be `true` or `undefined`.
	     * @param [options.classes] {String[]}      CSS classes
	     * @param [options.properties] {Object}     Dictionary of CSS properties
	     * @param [options.attributes] {Object}     Dictionary of HTML attributes
	     * @param [options.content] Sstring}        InnerHTML content
	     * @param [options.origin] {Number[]}       Origin (x,y), with values between 0 and 1
	     * @param [options.margins] {Number[]}      Margins (x,y) in pixels
	     * @param [options.proportions] {Number[]}  Proportions (x,y) with values between 0 and 1
	     * @param [options.aspectRatio] {Number}    Aspect ratio
	     * @param [options.opacity=1] {Number}      Opacity
	     * @param [options.tagName="div"] {String}  HTML tagName
	     * @param [options.enableScroll] {Boolean}  Allows a Surface to support native scroll behavior
	     * @param [options.roundToPixel] {Boolean}  Prevents text-blurring if set to true, at the cost to jittery animation
	     */
	    function Surface(options) {
	        this.properties = {};
	        this.attributes = {};
	        this.classList = [];
	        this.content = '';
	        this._cachedSize = null;
	        this._allocator = null;
	        this._currentTarget = null;
	        this._elementOutput = new DOMOutput();

	        this._eventOutput = new EventHandler();
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this._eventForwarder = function _eventForwarder(event) {
	            event.stopPropagation();
	            var shouldEmit = processEvent.call(this, event);
	            if (shouldEmit) this._eventOutput.emit(event.type, event);
	        }.bind(this);

	        var suppressMouseEvents = false;
	        function processEvent(event){
	            // if `touchstart` fired, then suppress phantom mouse events
	            var type = event.type;
	            if (type === 'touchstart') suppressMouseEvents = true;
	            if (suppressMouseEvents && type[0] === 'm') {
	                // `mouseup` is the last fired event
	                if (type === 'mouseup') suppressMouseEvents = false;
	                return false;
	            }
	            else return true;
	        }

	        this._sizeNode = new SizeNode();
	        this._layoutNode = new LayoutNode();

	        this._size = new EventHandler();
	        this._layout = new EventHandler();

	        this.size = Stream.lift(function elementSizeLift(sizeSpec, parentSize) {
	            if (!parentSize) return false; // occurs when surface is never added
	            return sizeAlgebra(sizeSpec, parentSize);
	        }, [this._sizeNode, this._size]);

	        this.layout = Stream.lift(function(parentSpec, objectSpec, size) {
	            if (!parentSpec || !size) return false;
	            return (objectSpec)
	                ? layoutAlgebra(objectSpec, parentSpec, size)
	                : parentSpec;
	        }, [this._layout, this._layoutNode, this.size]);

	        this.layout.on('start', function(){
	            if (!this._currentTarget) return;
	            this._elementOutput.promoteLayer(this._currentTarget);
	        }.bind(this));

	        this.layout.on('update', function(layout){
	            if (!this._currentTarget) return;
	            this._elementOutput.commitLayout(this._currentTarget, layout);
	        }.bind(this));

	        this.layout.on('end', function(layout){
	            if (!this._currentTarget) return;
	            this._elementOutput.commitLayout(this._currentTarget, layout);
	            this._elementOutput.demoteLayer(this._currentTarget);
	        }.bind(this));

	        this.size.on('start', commitSize.bind(this));
	        this.size.on('update', commitSize.bind(this));
	        this.size.on('end', commitSize.bind(this));

	        if (options) this.setOptions(options);
	    }

	    Surface.prototype = Object.create(DOMOutput.prototype);
	    Surface.prototype.constructor = Surface;
	    Surface.prototype.elementType = 'div'; // Default tagName. Can be overridden in options.
	    Surface.prototype.elementClass = 'samsara-surface';

	    function commitSize(size){
	        if (!this._currentTarget) return;
	        var shouldResize = this._elementOutput.commitSize(this._currentTarget, size);
	        this._cachedSize = size;
	        if (shouldResize) this.emit('resize', size);
	    }

	    function enableScroll(){
	        this.addClass('samsara-scrollable');

	        if (!isTouchEnabled) return;

	        this.on('deploy', function(target){
	            // Hack to prevent page scrolling for iOS when scroll starts at extremes
	            if (isIOS) {
	                target.addEventListener('touchstart', function () {
	                    var top = target.scrollTop;
	                    var height = target.offsetHeight;
	                    var scrollHeight = target.scrollHeight;

	                    if (top === 0)
	                        target.scrollTop = 1;
	                    else if (top + height === scrollHeight)
	                        target.scrollTop = scrollHeight - height - 1;

	                }, false);
	            }

	            // Prevent bubbling to capture phase of window's touchmove event which prevents default.
	            target.addEventListener('touchmove', function(event){
	                event.stopPropagation();
	            }, false);
	        });
	    }

	    /**
	     * Set or overwrite innerHTML content of this Surface.
	     *
	     * @method setContent
	     * @param content {String|DocumentFragment} HTML content
	     */
	    Surface.prototype.setContent = function setContent(content){
	        if (this.content !== content){
	            this.content = content;

	            if (this._currentTarget){
	                dirtyQueue.push(function(){
	                    this._elementOutput.applyContent(this._currentTarget, content);
	                }.bind(this));
	            }
	        }
	    };

	    /**
	     * Return innerHTML content of this Surface.
	     *
	     * @method getContent
	     * @return {String}
	     */
	    Surface.prototype.getContent = function getContent(){
	        return this.content;
	    };

	    /**
	     * Setter for HTML attributes.
	     *
	     * @method setAttributes
	     * @param attributes {Object}   HTML Attributes
	     */
	    Surface.prototype.setAttributes = function setAttributes(attributes) {
	        for (var key in attributes) {
	            var value = attributes[key];
	            if (value !== undefined) this.attributes[key] = attributes[key];
	        }

	        if (this._currentTarget){
	            dirtyQueue.push(function(){
	                this._elementOutput.applyAttributes(this._currentTarget, attributes);
	            }.bind(this));
	        }
	    };

	    /**
	     * Getter for HTML attributes.
	     *
	     * @method getAttributes
	     * @return {Object}
	     */
	    Surface.prototype.getAttributes = function getAttributes() {
	        return this.attributes;
	    };

	    /**
	     * Setter for CSS properties.
	     *  Note: properties are camelCased, not hyphenated.
	     *
	     * @method setProperties
	     * @param properties {Object}   CSS properties
	     */
	    Surface.prototype.setProperties = function setProperties(properties) {
	        for (var key in properties)
	            this.properties[key] = properties[key];

	        if (this._currentTarget){
	            dirtyQueue.push(function(){
	                this._elementOutput.applyProperties(this._currentTarget, properties);
	            }.bind(this));
	        }
	    };

	    /**
	     * Getter for CSS properties.
	     *
	     * @method getProperties
	     * @return {Object}             Dictionary of this Surface's properties.
	     */
	    Surface.prototype.getProperties = function getProperties() {
	        return this.properties;
	    };

	    /**
	     * Add CSS class to the list of classes on this Surface.
	     *
	     * @method addClass
	     * @param className {String}    Class name
	     */
	    Surface.prototype.addClass = function addClass(className) {
	        if (this.classList.indexOf(className) < 0) {
	            this.classList.push(className);

	            if (this._currentTarget){
	                dirtyQueue.push(function(){
	                    this._elementOutput.applyClasses(this._currentTarget, this.classList);
	                }.bind(this));
	            }
	        }
	    };

	    /**
	     * Remove CSS class from the list of classes on this Surface.
	     *
	     * @method removeClass
	     * @param className {string}    Class name
	     */
	    Surface.prototype.removeClass = function removeClass(className) {
	        var i = this.classList.indexOf(className);
	        if (i >= 0) {
	            this.classList.splice(i, 1);
	            if (this._currentTarget){
	                dirtyQueue.push(function(){
	                    this._elementOutput.removeClasses(this._currentTarget, this.classList);
	                }.bind(this));
	            }
	        }
	    };

	    /**
	     * Toggle CSS class for this Surface.
	     *
	     * @method toggleClass
	     * @param  className {String}   Class name
	     */
	    Surface.prototype.toggleClass = function toggleClass(className) {
	        var i = this.classList.indexOf(className);
	        (i === -1)
	            ? this.addClass(className)
	            : this.removeClass(className);
	    };

	    /**
	     * Reset classlist.
	     *
	     * @method setClasses
	     * @param classlist {String[]}  ClassList
	     */
	    Surface.prototype.setClasses = function setClasses(classList) {
	        for (var i = 0; i < classList.length; i++) {
	            this.addClass(classList[i]);
	        }
	    };

	    /**
	     * Get array of CSS classes attached to this Surface.
	     *
	     * @method getClasslist
	     * @return {String[]}
	     */
	    Surface.prototype.getClassList = function getClassList() {
	        return this.classList;
	    };

	    /**
	     * Apply the DOM's Element.querySelector to the Surface's current DOM target.
	     *  Returns the first node matching the selector within the Surface's content.
	     *
	     * @method querySelector
	     * @return {Element}
	     */
	    Surface.prototype.querySelector = function querySelector(selector){
	        if (this._currentTarget)
	            return this._elementOutput.querySelector(this._currentTarget, selector);
	    };

	    /**
	     * Apply the DOM's Element.querySelectorAll to the Surface's current DOM target.
	     *  Returns a list of nodes matching the selector within the Surface's content.
	     *
	     * @method querySelector
	     * @return {NodeList}
	     */
	    Surface.prototype.querySelectorAll = function querySelectorAll(selector){
	        if (this._currentTarget)
	            return this._elementOutput.querySelectorAll(this._currentTarget, selector);
	    };

	    /**
	     * Set options for this surface
	     *
	     * @method setOptions
	     * @param options {Object} Overrides for default options. See constructor.
	     */
	    Surface.prototype.setOptions = function setOptions(options) {
	        if (options.tagName !== undefined) this.elementType = options.tagName;
	        if (options.opacity !== undefined) this.setOpacity(options.opacity);
	        if (options.size !== undefined) this.setSize(options.size);
	        if (options.origin !== undefined) this.setOrigin(options.origin);
	        if (options.proportions !== undefined) this.setProportions(options.proportions);
	        if (options.margins !== undefined) this.setMargins(options.margins);
	        if (options.classes !== undefined) this.setClasses(options.classes);
	        if (options.properties !== undefined) this.setProperties(options.properties);
	        if (options.attributes !== undefined) this.setAttributes(options.attributes);
	        if (options.content !== undefined) this.setContent(options.content);
	        if (options.aspectRatio !== undefined) this.setAspectRatio(options.aspectRatio);
	        if (options.enableScroll) enableScroll.call(this);
	        if (options.roundToPixel) this._elementOutput._roundToPixel = options.roundToPixel;
	    };

	    /**
	     * Adds a handler to the `type` channel which will be executed on `emit`.
	     *
	     * @method on
	     *
	     * @param type {String}         DOM event channel name, e.g., "click", "touchmove"
	     * @param handler {Function}    Handler. It's only argument will be an emitted data payload.
	     */
	    Surface.prototype.on = function on(type, handler) {
	        if (this._currentTarget)
	            this._elementOutput.on(this._currentTarget, type, this._eventForwarder);
	        EventHandler.prototype.on.apply(this._eventOutput, arguments);
	    };

	    /**
	     * Adds a handler to the `type` channel which will be executed on `emit` once and then removed.
	     *
	     * @method once
	     *
	     * @param type {String}         DOM event channel name, e.g., "click", "touchmove"
	     * @param handler {Function}    Handler. It's only argument will be an emitted data payload.
	     */
	    Surface.prototype.once = function on(type, handler){
	        if (this._currentTarget)
	            this._elementOutput.once(this._currentTarget, type, this._eventForwarder);
	        EventHandler.prototype.once.apply(this._eventOutput, arguments);
	    };

	    /**
	     * Removes a previously added handler to the `type` channel.
	     *  Undoes the work of `on`.
	     *
	     * @method off
	     * @param type {String}         DOM event channel name e.g., "click", "touchmove"
	     * @param handler {Function}    Handler
	     */
	    Surface.prototype.off = function off(type, handler) {
	        if (this._currentTarget)
	            this._elementOutput.off(this._currentTarget, type, this._eventForwarder);
	        EventHandler.prototype.off.apply(this._eventOutput, arguments);
	    };

	    /**
	     * Allocates the element-type associated with the Surface, adds its given
	     *  element classes, and prepares it for future committing.
	     *
	     *  This method is called upon the first `start` or `resize`
	     *  event the Surface gets.
	     *
	     * @private
	     * @method setup
	     * @param allocator {DOMAllocator} Allocator
	     */
	    Surface.prototype.setup = function setup(allocator) {
	        if (this._currentTarget) return;

	        this._allocator = allocator;

	        // create element of specific type
	        var target = allocator.allocate(this.elementType);
	        this._currentTarget = target;

	        // add any element classes
	        if (this.elementClass) {
	            if (this.elementClass instanceof Array)
	                for (var i = 0; i < this.elementClass.length; i++)
	                    this.addClass(this.elementClass[i]);
	            else this.addClass(this.elementClass);
	        }

	        for (var type in this._eventOutput.listeners)
	            this._elementOutput.on(target, type, this._eventForwarder);

	        this.deploy(this._currentTarget);
	    };

	    /**
	     * Clear the HTML contents of the Surface and remove it from the Render Tree.
	     *  The DOM node the Surface occupied will be freed to a pool and can be used by another Surface.
	     *  The Surface can be added to the render tree again and all its data (properties, event listeners, etc)
	     *  will be restored.
	     *
	     * @method remove
	     */
	    Surface.prototype.remove = function remove() {
	        var target = this._currentTarget;
	        if (!target) return;

	        for (var type in this._eventOutput.listeners)
	            this._elementOutput.off(target, type, this._eventForwarder);

	        // cache the target's contents for later deployment
	        this.recall(target);

	        this._allocator.deallocate(target);
	        this._allocator = null;

	        this._currentTarget = null;
	    };

	    /**
	     * Insert the Surface's content into the currentTarget.
	     *
	     * @private
	     * @method deploy
	     * @param target {Node} DOM element to set content into
	     */
	    Surface.prototype.deploy = function deploy(target) {
	        this._elementOutput.makeVisible(target);
	        this._elementOutput.applyClasses(target, this.classList);
	        this._elementOutput.applyProperties(target, this.properties);
	        this._elementOutput.applyAttributes(target, this.attributes);
	        this._elementOutput.applyContent(target, this.content);

	        this._eventOutput.emit('deploy', target);
	    };

	    /**
	     * Cache the content of the Surface in a document fragment for future deployment.
	     *
	     * @private
	     * @method recall
	     * @param target {Node}
	     */
	    Surface.prototype.recall = function recall(target) {
	        this._eventOutput.emit('recall');

	        this._elementOutput.removeClasses(target, this.classList);
	        this._elementOutput.removeProperties(target, this.properties);
	        this._elementOutput.removeAttributes(target, this.attributes);
	        this.content = this._elementOutput.recallContent(target);
	        this._elementOutput.makeInvisible(target);
	    };

	    /**
	     * Getter for size.
	     *
	     * @method getSize
	     * @return {Number[]}
	     */
	    Surface.prototype.getSize = function getSize() {
	        // TODO: remove cachedSize
	        return this._cachedSize;
	    };

	    /**
	     * Setter for size.
	     *
	     * @method setSize
	     * @param size {Number[]|Stream} Size as [width, height] in pixels, or a stream.
	     */
	    Surface.prototype.setSize = function setSize(size) {
	        this._cachedSize = size;
	        this._sizeNode.set({size : size});
	    };

	    /**
	     * Setter for proportions.
	     *
	     * @method setProportions
	     * @param proportions {Number[]|Stream} Proportions as [x,y], or a stream.
	     */
	    Surface.prototype.setProportions = function setProportions(proportions) {
	        this._sizeNode.set({proportions : proportions});
	    };

	    /**
	     * Setter for margins.
	     *
	     * @method setMargins
	     * @param margins {Number[]|Stream} Margins as [width, height] in pixels, or a stream.
	     */
	    Surface.prototype.setMargins = function setMargins(margins) {
	        this._sizeNode.set({margins : margins});
	    };

	    /**
	     * Setter for aspect ratio. If only one of width or height is specified,
	     *  the aspect ratio will replace the unspecified dimension by scaling
	     *  the specified dimension by the value provided.
	     *
	     * @method setAspectRatio
	     * @param aspectRatio {Number|Stream} Aspect ratio.
	     */
	    Surface.prototype.setAspectRatio = function setAspectRatio(aspectRatio) {
	        this._sizeNode.set({aspectRatio : aspectRatio});
	    };

	    /**
	     * Setter for origin.
	     *
	     * @method setOrigin
	     * @param origin {Number[]|Stream} Origin as [x,y], or a stream.
	     */
	    Surface.prototype.setOrigin = function setOrigin(origin){
	        this._layoutNode.set({origin : origin});
	        this._elementOutput._originDirty = true;
	    };

	    /**
	     * Setter for opacity.
	     *
	     * @method setOpacity
	     * @param opacity {Number} Opacity
	     */
	    Surface.prototype.setOpacity = function setOpacity(opacity){
	        this._layoutNode.set({opacity : opacity});
	        this._elementOutput._opacityDirty = true;
	    };

	    module.exports = Surface;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Transform = __webpack_require__(9);

	    var usePrefix = !('transform' in window.document.documentElement.style);
	    var devicePixelRatio = 2 * (window.devicePixelRatio || 1);
	    var MIN_OPACITY = 0.0001;
	    var MAX_OPACITY = 0.9999;
	    var EPSILON = 1e-5;
	    var _zeroZero = [0, 0];

	    var stringMatrix3d = 'matrix3d(';
	    var stringComma = ',';
	    var stringParen = ')';
	    var stringPx = 'px';

	    /**
	     * Responsible for committing CSS3 properties to the DOM and providing DOM event hooks
	     *  from a provided DOM element. Where Surface's API handles inputs from the developer
	     *  from within Samsara, ElementOutput handles the DOM interaction layer.
	     *
	     *
	     * @class DOMOutput
	     * @constructor
	     * @namespace Core
	     * @uses Core.LayoutNode
	     * @uses Core.SizeNode
	     * @private
	     * @param {Node} element document parent of this container
	     */
	    function DOMOutput() {
	        this._cachedSpec = {};
	        this._opacityDirty = true;
	        this._originDirty = true;
	        this._transformDirty = true;
	        this._isVisible = true;
	        this._roundToPixel = false;
	    }

	    function _round(value, unit){
	        return (unit === 1)
	            ? Math.round(value)
	            : Math.round(value * unit) / unit
	    }

	    function _formatCSSTransform(transform, unit) {
	        var result = stringMatrix3d;
	        for (var i = 0; i < 15; i++) {
	            if (Math.abs(transform[i]) < EPSILON) transform[i] = 0;
	            result += (i === 12 || i === 13)
	                ? _round(transform[i], unit) + stringComma
	                : transform[i] + stringComma;
	        }
	        return result + transform[15] + stringParen;
	    }

	    function _formatCSSOrigin(origin) {
	        return (100 * origin[0]) + '% ' + (100 * origin[1]) + '%';
	    }

	    function _xyNotEquals(a, b) {
	        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
	    }

	    var _setOrigin = usePrefix
	        ? function _setOrigin(element, origin) {
	            element.style.webkitTransformOrigin = _formatCSSOrigin(origin);
	        }
	        : function _setOrigin(element, origin) {
	            element.style.transformOrigin = _formatCSSOrigin(origin);
	        };

	    var _setTransform = (usePrefix)
	        ? function _setTransform(element, transform, unit) {
	            element.style.webkitTransform = _formatCSSTransform(transform, unit);
	        }
	        : function _setTransform(element, transform, unit) {
	            element.style.transform = _formatCSSTransform(transform, unit);
	        };

	    function _setSize(target, size){
	        if (size[0] === true) size[0] = target.offsetWidth;
	        else if (size[0] >= 0) target.style.width = size[0] + stringPx;

	        if (size[1] === true) size[1] = target.offsetHeight;
	        else if (size[1] >= 0) target.style.height = size[1] + stringPx;
	    }

	    // pointerEvents logic allows for DOM events to pass through the element when invisible
	    function _setOpacity(element, opacity) {
	        if (!this._isVisible && opacity > MIN_OPACITY) {
	            element.style.pointerEvents = 'auto';
	            this._isVisible = true;
	        }

	        if (opacity > MAX_OPACITY) opacity = MAX_OPACITY;
	        else if (opacity < MIN_OPACITY) {
	            opacity = MIN_OPACITY;
	            if (this._isVisible) {
	                element.style.pointerEvents = 'none';
	                this._isVisible = false;
	            }
	        }

	        element.style.opacity = opacity;
	    }

	    DOMOutput.prototype.querySelector = function querySelector(target, selector){
	        return target.querySelector(selector);
	    };

	    DOMOutput.prototype.querySelectorAll = function querySelectorAll(target, selector){
	        return target.querySelectorAll(selector);
	    };

	    DOMOutput.prototype.applyClasses = function applyClasses(target, classList) {
	        for (var i = 0; i < classList.length; i++)
	            target.classList.add(classList[i]);
	    };

	    DOMOutput.prototype.applyProperties = function applyProperties(target, properties) {
	        for (var key in properties)
	            target.style[key] = properties[key];
	    };

	    DOMOutput.prototype.applyAttributes = function applyAttributes(target, attributes) {
	        for (var key in attributes)
	            target.setAttribute(key, attributes[key]);
	    };

	    DOMOutput.prototype.removeClasses = function removeClasses(target, classList) {
	        for (var i = 0; i < classList.length; i++)
	            target.classList.remove(classList[i]);
	    };

	    DOMOutput.prototype.removeProperties = function removeProperties(target, properties) {
	        for (var key in properties)
	            target.style[key] = '';
	    };

	    DOMOutput.prototype.removeAttributes = function removeAttributes(target, attributes) {
	        for (var key in attributes)
	            target.removeAttribute(key);
	    };

	    DOMOutput.prototype.on = function on(target, type, handler) {
	        target.addEventListener(type, handler);
	    };

	    DOMOutput.prototype.off = function off(target, type, handler) {
	        target.removeEventListener(type, handler);
	    };

	    DOMOutput.prototype.applyContent = function applyContent(target, content) {
	        if (content instanceof Node) {
	            while (target.hasChildNodes()) target.removeChild(target.firstChild);
	            target.appendChild(content);
	        }
	        else target.innerHTML = content;
	    };

	    DOMOutput.prototype.recallContent = function recallContent(target) {
	        var df = document.createDocumentFragment();
	        while (target.hasChildNodes()) df.appendChild(target.firstChild);
	        return df;
	    };

	    DOMOutput.prototype.makeVisible = function makeVisible(target){
	        target.style.display = '';

	        // for true-sized elements, reset height and width
	        if (this._cachedSize) {
	            if (this._cachedSize[0] === true) target.style.width = 'auto';
	            if (this._cachedSize[1] === true) target.style.height = 'auto';
	        }
	    };

	    DOMOutput.prototype.makeInvisible = function makeInvisible(target){
	        target.style.display = 'none';
	        target.style.opacity = '';
	        target.style.width = '';
	        target.style.height = '';

	        if (usePrefix) {
	            target.style.webkitTransform = '';
	            target.style.webkitTransformOrigin = '';
	        }
	        else {
	            target.style.transform = '';
	            target.style.transformOrigin = '';
	        }

	        this._cachedSpec = {};
	    };

	    DOMOutput.prototype.commitLayout = function commitLayout(target, layout) {
	        var cache = this._cachedSpec;

	        var transform = layout.transform || Transform.identity;
	        var opacity = (layout.opacity === undefined) ? 1 : layout.opacity;
	        var origin = layout.origin || _zeroZero;

	        this._transformDirty = Transform.notEquals(cache.transform, transform);
	        this._opacityDirty = this._opacityDirty || (cache.opacity !== opacity);
	        this._originDirty = this._originDirty || (origin && _xyNotEquals(cache.origin, origin));

	        if (this._opacityDirty) {
	            cache.opacity = opacity;
	            _setOpacity.call(this, target, opacity);
	        }

	        if (this._originDirty){
	            cache.origin = origin;
	            _setOrigin(target, origin);
	        }

	        if (this._transformDirty) {
	            cache.transform = transform;
	            _setTransform(target, transform, this._roundToPixel ? 1 : devicePixelRatio);
	        }

	        this._originDirty = false;
	        this._transformDirty = false;
	        this._opacityDirty = false;
	    };

	    DOMOutput.prototype.commitSize = function commitSize(target, size){
	        if (size[0] !== true) size[0] = _round(size[0], devicePixelRatio);
	        if (size[1] !== true) size[1] = _round(size[1], devicePixelRatio);

	        if (_xyNotEquals(this._cachedSpec.size, size)){
	            this._cachedSpec.size = size;
	            _setSize(target, size);
	            return true;
	        }
	        else return false;
	    };

	    DOMOutput.prototype.promoteLayer = function (target){
	        target.style.willChange = 'transform, opacity';
	    };

	    DOMOutput.prototype.demoteLayer = function(target) {
	        target.style.willChange = 'auto';
	    };

	    module.exports = DOMOutput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Surface = __webpack_require__(36);
	    var Context = __webpack_require__(39);

	    /**
	     * ContainerSurface enables nesting of DOM. A ContainerSurface manages
	     *  its own render tree that it inserts inside a DOM node. Typically
	     *  this is used for clipping by settings `{overflow : hidden}` as a CSS
	     *  property.
	     *
	     *  @example
	     *
	     *      var myContainer = new ContainerSurface({
	     *          size : [100,100],
	     *          properties : {overflow : hidden}
	     *      });
	     *
	     *      var surface = new Surface({
	     *          size : [200,200],
	     *          properties : {background : 'red'}
	     *      });
	     *
	     *      myContainer.add(surface);
	     *
	     *      context.add(myContainer);
	     *
	     * @class ContainerSurface
	     * @extends DOM.Surface
	     * @namespace DOM
	     * @uses DOM.Context
	     * @constructor
	     *
	     * @param [options] {Object}                      Options
	     * @param [options.size] {Number[]}               Size (width, height) in pixels. These can also be `true` or `undefined`.
	     * @param [options.classes] {String[]}            CSS classes
	     * @param [options.properties] {Object}           Dictionary of CSS properties
	     * @param [options.attributes] {Object}           Dictionary of HTML attributes
	     * @param [options.content] Sstring}              InnerHTML content
	     * @param [options.origin] {Number[]}             Origin (x,y), with values between 0 and 1
	     * @param [options.margins] {Number[]}            Margins (x,y) in pixels
	     * @param [options.proportions] {Number[]}        Proportions (x,y) with values between 0 and 1
	     * @param [options.aspectRatio] {Number}          Aspect ratio
	     * @param [options.opacity=1] {Number}            Opacity
	     * @param [options.tagName="div"] {String}        HTML tagName
	     * @param [options.enableScroll=false] {Boolean}  Allows a Surface to support native scroll behavior
	     * @param [options.roundToPixel=false] {Boolean}  Prevents text-blurring if set to true, at the cost to jittery animation
	     */
	    function ContainerSurface(options) {
	        Surface.call(this, options);
	        this.context = new Context();
	        this.context.elementClass = ContainerSurface.prototype.elementClass;
	        this.context._size.subscribe(this.size);

	        this.on('deploy', function(target){
	            this.context.mount(target);
	        }.bind(this));

	        this.on('recall', function() {
	            this.context.remove();
	        }.bind(this));
	    }

	    ContainerSurface.prototype = Object.create(Surface.prototype);
	    ContainerSurface.prototype.constructor = ContainerSurface;
	    ContainerSurface.prototype.elementType = 'div';
	    ContainerSurface.prototype.elementClass = ['samsara-surface', 'samsara-container'];

	    /**
	     * Get current perspective in pixels.
	     *
	     * @method getPerspective
	     * @return {Number} Perspective in pixels
	     */
	    ContainerSurface.prototype.getPerspective = function getPerspective() {
	        return Context.prototype.getPerspective.apply(this.context, arguments);
	    };

	    /**
	     * Set current perspective in pixels.
	     *
	     * @method setPerspective
	     * @param perspective {Number}  Perspective in pixels
	     * @param [transition] {Object} Transition definition
	     * @param [callback] {Function} Callback executed on completion of transition
	     */
	    ContainerSurface.prototype.setPerspective = function setPerspective(){
	        Context.prototype.setPerspective.apply(this.context, arguments);
	    };

	    /**
	     * Extends the render tree with a provided node.
	     *
	     * @method add
	     * @param node {Object}     Node, Surface, or View
	     * @return {RenderTreeNode}
	     */
	    ContainerSurface.prototype.add = function add() {
	        return Context.prototype.add.apply(this.context, arguments);
	    };

	    ContainerSurface.prototype.remove = function remove() {
	        Surface.prototype.remove.apply(this, arguments);
	    };

	    module.exports = ContainerSurface;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */
	// TODO: Enable CSS properties on Context
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var DOMAllocator = __webpack_require__(40);
	    var Engine = __webpack_require__(2);
	    var RootNode = __webpack_require__(41);
	    var Transitionable = __webpack_require__(11);
	    var OptionsManager = __webpack_require__(27);
	    var SimpleStream = __webpack_require__(12);
	    var EventHandler = __webpack_require__(3);

	    /**
	     * A Context defines a top-level DOM element inside which other nodes (like Surfaces) are rendered.
	     *
	     *  The CSS class `samsara-context` is applied, which provides the minimal CSS necessary
	     *  to create a performant 3D context (specifically `preserve-3d`).
	     *
	     *  The Context must be mounted to a DOM node via the `mount` method. If no node is specified
	     *  it is mounted to `document.body`.
	     *
	     *  @example
	     *
	     *      var context = Context();
	     *
	     *      var surface = new Surface({
	     *          size : [100,100],
	     *          properties : {background : 'red'}
	     *      });
	     *
	     *      context.add(surface);
	     *      context.mount(document.body)
	     *
	     * @class Context
	     * @constructor
	     * @namespace DOM
	     * @uses Core.RootNode
	     *
	     * @param [options] {Object}                        Options
	     * @param [options.enableScroll=false] {Boolean}    Allow scrolling on mobile devices
	     */
	    function Context(options) {
	        this.options = OptionsManager.setOptions(this, options, Context.DEFAULT_OPTIONS);
	        this._node = new RootNode();

	        this._size = new SimpleStream();
	        this._layout = new SimpleStream();

	        this._cachedSize = [];
	        this.size = this._size.map(function(type){
	            // If `end` event, simply return cache. Otherwise cache busting fails
	            // as the `end` size is the same as the `start` size for immediate sets
	            if (type === 'end'){
	                return this._cachedSize;
	            }

	            var width = this.container.clientWidth;
	            var height = this.container.clientHeight;

	            if (width !== this._cachedSize[0] || height !== this._cachedSize[1]){
	                this._cachedSize[0] = width;
	                this._cachedSize[1] = height;
	                this.emit('resize', this._cachedSize);
	                // TODO: shouldn't need to create new array - DOMOutput bug
	                return [width, height];
	            }
	            else return false;
	        }.bind(this));

	        this._perspective = new Transitionable();
	        this._perspectiveOrigin = new Transitionable();

	        this.perspectiveFrom(this._perspective);
	        this.perspectiveOriginFrom(this._perspectiveOrigin);

	        this._eventOutput = new EventHandler();

	        this._eventForwarder = function _eventForwarder(event) {
	            event.stopPropagation();
	            var shouldEmit = processEvent.call(this, event);
	            if (shouldEmit) this._eventOutput.emit(event.type, event);
	        }.bind(this);

	        var suppressMouseEvents = false;
	        function processEvent(event){
	            // if `touchstart` fired, then suppress phantom mouse events
	            var type = event.type;
	            if (type === 'touchstart') suppressMouseEvents = true;
	            if (suppressMouseEvents && type[0] === 'm') {
	                // `mouseup` is the last fired event
	                if (type === 'mouseup') suppressMouseEvents = false;
	                return false;
	            }
	            else return true;
	        }

	        // Prevents dragging of entire page
	        if (this.options.enableScroll === false){
	            this.on('deploy', function(target) {
	                target.addEventListener('touchmove', function(event) {
	                    event.preventDefault();
	                }, false);
	            });
	        }
	    }

	    Context.prototype.elementClass = 'samsara-context';

	    Context.DEFAULT_OPTIONS = {
	        enableScroll : false
	    };

	    /**
	     * Extends the render tree beginning with the Context's RootNode with a new node.
	     *  Delegates to RootNode's `add` method.
	     *
	     * @method add
	     *
	     * @param {Object}          Renderable
	     * @return {RenderTreeNode} Wrapped node
	     */
	    Context.prototype.add = function add() {
	        return RootNode.prototype.add.apply(this._node, arguments);
	    };

	    Context.prototype.remove = function remove(){
	        if (this.elementClass instanceof Array){
	            for (var i = 0; i < this.elementClass.length; i++)
	                this.container.classList.remove(this.elementClass[i])
	        }
	        else this.container.classList.remove(this.elementClass);

	        this._node.remove();

	        while (this.container.hasChildNodes())
	            this.container.removeChild(this.container.firstChild);

	        Engine.deregisterContext(this);
	    };

	    /**
	     * Pull the perspective value from a transitionable.
	     *
	     * @method perspectiveFrom
	     * @param perspective {Transitionable}    Perspective transitionable
	     */
	    Context.prototype.perspectiveFrom = function perspectiveFrom(perspective){
	        this._perspective = perspective;

	        this._perspective.on('update', function(perspective){
	            setPerspective(this.container, perspective);
	        }.bind(this));

	        this._perspective.on('end', function(perspective){
	            setPerspective(this.container, perspective);
	        }.bind(this));
	    };

	    /**
	     * Pull the perspective-origin value from a transitionable.
	     *
	     * @method perspectiveOriginFrom
	     * @param perspectiveOrigin {Transitionable}    Perspective-origin transitionable
	     */
	    Context.prototype.perspectiveOriginFrom = function perspectiveOriginFrom(perspectiveOrigin){
	        this._perspectiveOrigin = perspectiveOrigin;

	        this._perspectiveOrigin.on('update', function(origin){
	            setPerspectiveOrigin(this.container, origin);
	        }.bind(this));

	        this._perspectiveOrigin.on('end', function(origin){
	            setPerspectiveOrigin(this.container, origin);
	        }.bind(this));
	    };

	    /**
	     * Get current perspective of this Context in pixels.
	     *
	     * @method getPerspective
	     * @return {Number} Perspective in pixels
	     */
	    Context.prototype.getPerspective = function getPerspective() {
	        return this._perspective.get();
	    };

	    /**
	     * Set current perspective of the `context` in pixels.
	     *
	     * @method setPerspective
	     * @param perspective {Number}  Perspective in pixels
	     * @param [transition] {Object} Transition definition
	     * @param [callback] {Function} Callback executed on completion of transition
	     */
	    Context.prototype.setPerspective = function setPerspective(perspective, transition, callback) {
	        if (this.container)
	            this._perspective.set(perspective, transition, callback);
	        else {
	            this.on('deploy', function(){
	                this._perspective.set(perspective, transition, callback);
	            }.bind(this));
	        }
	    };

	    /**
	     * Set current perspective of the `context` in pixels.
	     *
	     * @method setPerspective
	     * @param perspective {Number}  Perspective in pixels
	     * @param [transition] {Object} Transition definition
	     * @param [callback] {Function} Callback executed on completion of transition
	     */
	    Context.prototype.setPerspectiveOrigin = function setPerspectiveOrigin(origin, transition, callback) {
	        if (this.container)
	            this._perspectiveOrigin.set(origin, transition, callback);
	        else {
	            this.on('deploy', function() {
	                this._perspectiveOrigin.set(origin, transition, callback);
	            }.bind(this));
	        }
	    };

	    /**
	     * Allocate contents of the `context` to a DOM node.
	     *
	     * @method mount
	     * @param node {Node}  DOM element
	     */
	    Context.prototype.mount = function mount(node){
	        node = node || window.document.body;

	        this.container = node;

	        if (this.elementClass instanceof Array) {
	            for (var i = 0; i < this.elementClass.length; i++)
	                this.container.classList.add(this.elementClass[i])
	        }
	        else this.container.classList.add(this.elementClass);

	        var allocator = new DOMAllocator(this.container);
	        this._node.setAllocator(allocator);

	        this._node._size.subscribe(this.size);
	        this._node._layout.subscribe(this._layout);

	        this.emit('deploy', this.container);

	        Engine.registerContext(this);
	    };

	    /**
	     * Adds a handler to the `type` channel which will be executed on `emit`.
	     *  These events should be DOM events that occur on the DOM node the
	     *  context has been mounted to.
	     *
	     * @method on
	     * @param type {String}         Channel name
	     * @param handler {Function}    Callback
	     */
	    Context.prototype.on = function on(type, handler){
	        if (this.container)
	            this.container.addEventListener(type, this._eventForwarder);
	        else {
	            this._eventOutput.on('deploy', function(target){
	                target.addEventListener(type, this._eventForwarder);
	            }.bind(this));
	        }
	        EventHandler.prototype.on.apply(this._eventOutput, arguments);
	    };

	    /**
	     * Removes the `handler` from the `type`.
	     *  Undoes the work of `on`.
	     *
	     * @method off
	     * @param type {String}         Channel name
	     * @param handler {Function}    Callback
	     */
	    Context.prototype.off = function off(type, handler) {
	        EventHandler.prototype.off.apply(this._eventOutput, arguments);
	    };

	    /**
	     * Used internally when context is subscribed to.
	     *
	     * @method emit
	     * @private
	     * @param type {String}     Channel name
	     * @param data {Object}     Payload
	     */
	    Context.prototype.emit = function emit(type, payload) {
	        EventHandler.prototype.emit.apply(this._eventOutput, arguments);
	    };

	    var usePrefix = !('perspective' in window.document.documentElement.style);

	    var setPerspective = usePrefix
	        ? function setPerspective(element, perspective) {
	            element.style.webkitPerspective = perspective ? (perspective | 0) + 'px' : '0px';
	        }
	        : function setPerspective(element, perspective) {
	            element.style.perspective = perspective ? (perspective | 0) + 'px' : '0px';
	        };

	    function _formatCSSOrigin(origin) {
	        return (100 * origin[0]) + '% ' + (100 * origin[1]) + '%';
	    }

	    var setPerspectiveOrigin = usePrefix
	        ? function setPerspectiveOrigin(element, origin) {
	            element.style.webkitPerspectiveOrigin = origin ? _formatCSSOrigin(origin) : '50% 50%';
	        }
	        : function setPerspectiveOrigin(element, origin) {
	            element.style.perspectiveOrigin = origin ? _formatCSSOrigin(origin) : '50% 50%';
	        };

	    module.exports = Context;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     * Handles creating, allocating and removing DOM elements within a provided DOM element.
	     *  Manages a pool of nodes based on DOM tagName for DOM node reuse.
	     *  When a Surface is deallocated, its element is cleared and put back in the pool.
	     *  When a Surface is allocated, an existing cleared element of the same tagName is
	     *  looked for. If it is not found, a new DOM element is created.
	     *
	     * @class DOMAllocator
	     * @constructor
	     * @namespace Core
	     * @private
	     * @param container {Node} DOM element
	     */
	    function DOMAllocator(container) {
	        this.set(container);
	        this.detachedNodes = {};
	    }

	    /**
	     * Set containing element to insert allocated content into
	     *
	     * @method set
	     * @param container {Node} DOM element
	     */
	    DOMAllocator.prototype.set = function(container){
	        if (!container) container = document.createDocumentFragment();
	        this.container = container;
	    };

	    /**
	     * Move the DOM elements from their original container to a new one.
	     *
	     * @method migrate
	     * @param container {Node} DOM element
	     */
	    DOMAllocator.prototype.migrate = function migrate(container) {
	        var oldContainer = this.container;
	        if (container === oldContainer) return;

	        if (oldContainer instanceof DocumentFragment)
	            container.appendChild(oldContainer);
	        else {
	            while (oldContainer.hasChildNodes())
	                container.appendChild(oldContainer.firstChild);
	        }
	        this.container = container;
	    };

	    /**
	     * Allocate an element of specified type from the pool.
	     *
	     * @method allocate
	     * @param type {string} DOM tagName, e.g., "div"
	     * @return {Node}
	     */
	    DOMAllocator.prototype.allocate = function allocate(type) {
	        type = type.toLowerCase();
	        if (!(type in this.detachedNodes)) this.detachedNodes[type] = [];
	        var nodeStore = this.detachedNodes[type];
	        var result;
	        if (nodeStore.length === 0){
	            result = document.createElement(type);
	            this.container.appendChild(result);
	        }
	        else result = nodeStore.shift();
	        return result;
	    };

	    /**
	     * De-allocate an element of specified type to the pool for recycling.
	     *
	     * @method deallocate
	     * @param element {Node} DOM element
	     */
	    DOMAllocator.prototype.deallocate = function deallocate(element) {
	        var nodeType = element.nodeName.toLowerCase();
	        var nodeStore = this.detachedNodes[nodeType];
	        nodeStore.push(element);
	    };

	    module.exports = DOMAllocator;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var RenderTreeNode = __webpack_require__(28);

	    /**
	     * A RootNode is a first node in the Render Tree. It is like any other
	     *  RenderTreeNode but with the additional responsibility of defining
	     *  an allocating DOM node to render to.
	     *
	     * @class RootNode
	     * @constructor
	     * @private
	     * @extends Core.RenderTreeNode
	     * @param [allocator] {ElementAllocator} ElementAllocator
	     */
	    function RootNode(allocator) {
	        this.allocator = null;
	        RenderTreeNode.call(this);
	        if (allocator) this.setAllocator(allocator);
	    }

	    RootNode.prototype = Object.create(RenderTreeNode.prototype);
	    RootNode.prototype.constructor = RootNode;

	    /**
	     * Define an allocator
	     *
	     * @method setAllocator
	     * @param allocator {Allocator} Allocator
	     */
	    RootNode.prototype.setAllocator = function setAllocator(allocator){
	        this.allocator = allocator;
	        this._logic.trigger('mount', this);
	    };

	    RootNode.prototype.remove = function remove() {
	        this.allocator = null;
	        RenderTreeNode.prototype.remove.apply(this, arguments);
	    };

	    module.exports = RootNode;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    module.exports = {
	        EventEmitter: __webpack_require__(4),
	        EventHandler: __webpack_require__(3),
	        EventMapper: __webpack_require__(13),
	        EventFilter: __webpack_require__(14),
	        EventSplitter: __webpack_require__(15)
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    module.exports = {
	        GenericInput: __webpack_require__(44),
	        MouseInput: __webpack_require__(45),
	        TouchInput: __webpack_require__(46),
	        ScrollInput: __webpack_require__(48),
	        ScaleInput: __webpack_require__(49),
	        RotateInput: __webpack_require__(51),
	        PinchInput: __webpack_require__(52)
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(3);
	    var SimpleStream = __webpack_require__(12);

	    // Global registry of input constructors. Append only.
	    var registry = {};

	    /**
	     * Combines multiple inputs (e.g., mouse, touch, scroll) into one unified input.
	     *  Inputs must first be registered on the constructor by a unique identifier,
	     *  then they can be accessed on instantiation.
	     *
	     *      @example
	     *
	     *      // In main.js
	     *      GenericInput.register({
	     *          "mouse" : MouseInput,
	     *          "touch" : TouchInput
	     *      });
	     *
	     *      // in myFile.js
	     *      var input = new GenericInput(['mouse', 'touch'], options);
	     *
	     * @class GenericInput
	     * @constructor
	     * @namespace Inputs
	     * @extends Streams.SimpleStream
	     * @param inputs {Object|String[]}  Dictionary with {identifier : option} pairs
	     *                                  or an array of identifier strings
	     * @param [options] {Object} Options for all inputs
	     */
	    function GenericInput(inputs, options) {
	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();

	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this._inputs = {};
	        if (inputs) this.addInput(inputs, options);
	    }

	    GenericInput.prototype = Object.create(SimpleStream.prototype);
	    GenericInput.prototype.constructor = GenericInput;

	    /**
	     * Constrain the input along a specific axis.
	     *
	     * @property DIRECTION {Object}
	     * @property DIRECTION.X {Number}   x-axis
	     * @property DIRECTION.Y {Number}   y-axis
	     * @static
	     */
	    GenericInput.DIRECTION = {
	        X : 0,
	        Y : 1
	    };

	    /**
	     * Register a global input class with an identifying key
	     *
	     * @method register
	     * @static
	     * @param inputObject {Object} an object of {input key : input options} fields
	     */
	    GenericInput.register = function register(inputObject) {
	        for (var key in inputObject){
	            if (registry[key]){
	                if (registry[key] === inputObject[key]) continue; // redundant registration
	                else throw new Error('this key is registered to a different input class');
	            }
	            else registry[key] = inputObject[key];
	        }
	    };

	    /**
	     * Helper to set options on all input instances
	     *
	     * @method setOptions
	     * @param options {Object} options object
	     */
	    GenericInput.prototype.setOptions = function(options) {
	        for (var key in this._inputs)
	            this._inputs[key].setOptions(options);
	    };

	    /**
	     * Subscribe events from an input class
	     *
	     * @method subscribeInput
	     * @param key {String} identifier for input class
	     */
	    GenericInput.prototype.subscribeInput = function subscribeInput(key) {
	        var input = this._inputs[key];
	        input.subscribe(this._eventInput);
	        this._eventOutput.subscribe(input);
	    };

	    /**
	     * Unsubscribe events from an input class
	     *
	     * @method unsubscribeInput
	     * @param key {String} identifier for input class
	     */
	    GenericInput.prototype.unsubscribeInput = function unsubscribeInput(key) {
	        var input = this._inputs[key];
	        input.unsubscribe(this._eventInput);
	        this._eventOutput.unsubscribe(input);
	    };

	    /**
	     * Get a registered input by key
	     *
	     * @method getInput
	     * @param key {String} Identifier for input class
	     * @return {Input}
	     */
	    GenericInput.prototype.getInput = function getInput(key){
	        return this._inputs[key];
	    };

	    function _addSingleInput(key, options) {
	        if (!registry[key]) return;
	        this._inputs[key] = new (registry[key])(options);
	        this.subscribeInput(key);
	    }

	    /**
	     * Add an input class to from the registered classes
	     *
	     * @method addInput
	     * @param inputs {Object|Array.String} an array of registered input keys
	     *    or an object with fields {input key : input options}
	     */
	    GenericInput.prototype.addInput = function addInput(inputs, options) {
	        if (inputs instanceof Array)
	            for (var i = 0; i < inputs.length; i++)
	                _addSingleInput.call(this, inputs[i], options);
	        else if (inputs instanceof Object)
	            for (var key in inputs)
	                _addSingleInput.call(this, key, inputs[key]);
	    };

	    module.exports = GenericInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(3);
	    var OptionsManager = __webpack_require__(27);
	    var SimpleStream = __webpack_require__(12);

	    var MINIMUM_TICK_TIME = 8;
	    var _now = Date.now;

	    /**
	     * Wrapper for DOM mouse events. Converts
	     *
	     *      `mousedown` -> `start`
	     *      `mousemove` -> `update`
	     *      `mouseup`   -> `end`
	     *
	     * MouseInput emits these events with the following payload data:
	     *
	     *      `x`         - x-position relative to screen (independent of scroll)
	     *      `y`         - y-position relative to screen (independent of scroll)
	     *      `value`     - Displacement in pixels from `mousedown`
	     *      `delta`     - Differential in pixels between successive mouse positions
	     *      `velocity`  - Velocity of mouse movement in pixels per second
	     *      `cumulate`  - Accumulated value over successive displacements
	     *      `event`     - Original DOM event
	     *      `dt`        - Time since last update
	     *
	     * @example
	     *
	     *      var surface = new Surface({
	     *          size : [100,100],
	     *          properties : {background : 'red'}
	     *      });
	     *
	     *      var mouseInput = new MouseInput({
	     *          direction : MouseInput.DIRECTION.X
	     *      });
	     *
	     *      mouseInput.subscribe(surface);
	     *
	     *      mouseInput.on('start', function(payload){
	     *          // fired on mouse down
	     *          console.log('start', payload);
	     *      });
	     *
	     *      mouseInput.on('update', function(payload){
	     *          // fired on mouse move
	     *          console.log('update', payload);
	     *      });
	     *
	     *      mouseInput.on('end', function(payload){
	     *          // fired on mouse up
	     *          console.log('end', payload);
	     *      });
	     *
	     * @class MouseInput
	     * @constructor
	     * @extend SimpleStream
	     * @uses Core._OptionsManager
	     * @param [options] {Object}                Options
	     * @param [options.scale=1] {Number}        Scale the response to the mouse
	     * @param [options.direction] {Number}      Direction to project movement onto.
	     *                                          Options found in MouseInput.DIRECTION.
	     * @param [options.rails=false] {Boolean}   If a direction is specified, movement in the
	     *                                          orthogonal direction is suppressed
	     */
	    function MouseInput(options) {
	        this.options = OptionsManager.setOptions(this, options);

	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();

	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        // references for event listeners put on document when
	        // mouse is quickly moved off of target DOM element
	        this.boundMove = null;
	        this.boundUp = null;

	        this._eventInput.on('mousedown',    handleStart.bind(this));
	        this._eventInput.on('mousemove',    handleMove.bind(this));
	        this._eventInput.on('mouseup',      handleEnd.bind(this));
	        this._eventInput.on('mouseenter',   handleEnter.bind(this));
	        this._eventInput.on('mouseleave',   handleLeave.bind(this));

	        this._payload = {
	            x : 0,
	            y : 0,
	            delta : null,
	            value : null,
	            cumulate : null,
	            velocity : null
	        };

	        this._value = null;
	        this._cumulate = null;
	        this._prevCoord = undefined;
	        this._prevTime = undefined;
	        this._down = false;
	        this._move = false;
	    }

	    MouseInput.prototype = Object.create(SimpleStream.prototype);
	    MouseInput.prototype.constructor = MouseInput;

	    MouseInput.DEFAULT_OPTIONS = {
	        direction : undefined,
	        scale : 1,
	        rails : false
	    };

	    /**
	     * Constrain the input along a specific axis.
	     *
	     * @property DIRECTION {Object}
	     * @property DIRECTION.X {Number}   x-axis
	     * @property DIRECTION.Y {Number}   y-axis
	     * @static
	     */
	    MouseInput.DIRECTION = {
	        X : 0,
	        Y : 1
	    };

	    function handleStart(event) {
	        var delta;
	        var velocity;

	        event.preventDefault(); // prevent drag

	        var x = event.clientX;
	        var y = event.clientY;

	        this._prevCoord = [x, y];
	        this._prevTime = _now();
	        this._down = true;
	        this._move = false;

	        var payload = this._payload;

	        if (this.options.direction !== undefined) {
	            if (this._cumulate === null) this._cumulate = 0;
	            this._value = 0;
	            delta = 0;
	            velocity = 0;
	            if (this.options.direction === MouseInput.DIRECTION.X) payload.x = x;
	            if (this.options.direction === MouseInput.DIRECTION.Y) payload.y = y;
	        }
	        else {
	            if (this._cumulate === null) this._cumulate = [0, 0];
	            this._value = [0, 0];
	            delta = [0, 0];
	            velocity = [0, 0];
	            payload.x = x;
	            payload.y = y;
	        }

	        payload.delta = delta;
	        payload.value = this._value;
	        payload.cumulate = this._cumulate;
	        payload.velocity = velocity;
	        payload.event = event;

	        this._eventOutput.emit('start', payload);
	    }

	    function handleMove(event){
	        if (!this._down) return false;

	        var direction = this.options.direction;
	        var scale = this.options.scale;

	        var prevCoord = this._prevCoord;
	        var prevTime = this._prevTime;

	        var x = event.clientX;
	        var y = event.clientY;

	        var currTime = _now();

	        var diffX = scale * (x - prevCoord[0]);
	        var diffY = scale * (y - prevCoord[1]);

	        if (this.options.rails && direction !== undefined){
	            var activateRails =
	                (direction === MouseInput.DIRECTION.X && Math.abs(diffX) < Math.abs(0.5 * diffY)) ||
	                (direction === MouseInput.DIRECTION.Y && Math.abs(diffY) < Math.abs(0.5 * diffX));

	            if (activateRails) return false;
	        }

	        var dt = Math.max(currTime - prevTime, MINIMUM_TICK_TIME); // minimum tick time
	        var invDt = 1 / dt;

	        var velX = diffX * invDt;
	        var velY = diffY * invDt;

	        var nextVel;
	        var nextDelta;

	        var payload = this._payload;

	        if (direction === MouseInput.DIRECTION.X) {
	            payload.x = x;
	            nextDelta = diffX;
	            nextVel = velX;
	            this._value += nextDelta;
	            this._cumulate += nextDelta;
	        }
	        else if (direction === MouseInput.DIRECTION.Y) {
	            payload.y = y;
	            nextDelta = diffY;
	            nextVel = velY;
	            this._value += nextDelta;
	            this._cumulate += nextDelta;
	        }
	        else {
	            payload.x = x;
	            payload.y = y;
	            nextDelta = [diffX, diffY];
	            nextVel = [velX, velY];
	            this._value[0] += nextDelta[0];
	            this._value[1] += nextDelta[1];
	            this._cumulate[0] += nextDelta[0];
	            this._cumulate[1] += nextDelta[1];
	        }


	        payload.delta = nextDelta;
	        payload.value = this._value;
	        payload.cumulate = this._cumulate;
	        payload.velocity = nextVel;
	        payload.event = event;
	        payload.dt = dt;

	        this._eventOutput.emit('update', payload);

	        this._prevCoord = [x, y];
	        this._prevTime = currTime;
	        this._move = true;
	    }

	    function handleEnd(event) {
	        if (!this._down) return false;

	        this._payload.event = event;
	        this._eventOutput.emit('end', this._payload);

	        this._prevCoord = undefined;
	        this._prevTime = undefined;
	        this._down = false;
	        this._move = false;
	    }

	    function handleEnter(event){
	        if (!this._down || !this._move) return false;

	        this._eventInput.off('mousemove', handleMove.bind(this));
	        this._eventInput.off('mouseup', handleEnd.bind(this));

	        document.removeEventListener('mousemove', this.boundMove);
	        document.removeEventListener('mouseup', this.boundUp);
	    }

	    function handleLeave(event) {
	        if (!this._down || !this._move) return false;

	        this.boundMove = handleMove.bind(this);
	        this.boundUp = function(event) {
	            handleEnd.call(this, event);
	            document.removeEventListener('mousemove', this.boundMove);
	            document.removeEventListener('mouseup', this.boundUp);
	        }.bind(this, event);


	        this._eventInput.off('mousemove', handleMove.bind(this));
	        this._eventInput.off('mouseup', handleEnd.bind(this));

	        document.addEventListener('mousemove', this.boundMove);
	        document.addEventListener('mouseup', this.boundUp);
	    }

	    module.exports = MouseInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var TouchTracker = __webpack_require__(47);
	    var EventHandler = __webpack_require__(3);
	    var SimpleStream = __webpack_require__(12);
	    var OptionsManager = __webpack_require__(27);

	    var MINIMUM_TICK_TIME = 8;

	    /**
	     * Wrapper for DOM touch events. Converts
	     *
	     *      `touchstart` -> `start`
	     *      `touchmove`  -> `update`
	     *      `touchend`   -> `end`
	     *
	     * TouchInput emits these events with the following payload data:
	     *
	     *      `x`         - x-position relative to screen (independent of scroll)
	     *      `y`         - y-position relative to screen (independent of scroll)
	     *      `value`     - Displacement in pixels from `touchstart`
	     *      `delta`     - Differential in pixels between successive mouse positions
	     *      `velocity`  - Velocity of mouse movement in pixels per second
	     *      `cumulate`  - Accumulated displacement over successive displacements
	     *      `count`     - DOM event for number of simultaneous touches
	     *      `touchId`   - DOM touch event identifier
	     *      `event`     - Original DOM event
	     *      `dt`        - Time since last update
	     *
	     * @example
	     *
	     *      var touchInput = new TouchInput({
	     *          direction : TouchInput.DIRECTION.Y
	     *      });
	     *
	     *      touchInput.subscribe(surface);
	     *
	     *      touchInput.on('start', function(payload){
	     *          // fired on mouse down
	     *          console.log('start', payload);
	     *      });
	     *
	     *      touchInput.on('update', function(payload){
	     *          // fired on mouse move
	     *          console.log('update', payload);
	     *      });
	     *
	     *      touchInput.on('end', function(payload){
	     *          // fired on mouse up
	     *          console.log('end', payload);
	     *      });
	     *
	     * @class TouchInput
	     * @constructor
	     * @extends Streams.SimpleStream
	     * @uses Inputs._TouchTracker
	     * @uses Core._OptionsManager
	     * @param [options] {Object}                Options
	     * @param [options.scale=1] {Number}        Scale the response to the mouse
	     * @param [options.track=1] {Number}        Max simultaneous touches to record
	     * @param [options.limit=Infinity] {Number} Limit number of touches. If reached, no events are emitted
	     * @param [options.direction] {Number}      Direction to project movement onto.
	     *                                          Options found in TouchInput.DIRECTION.
	     * @param [options.rails=false] {Boolean}   If a direction is unspecified, movement in the
	     *                                          orthogonal to the principal direction is suppressed
	     */
	    function TouchInput(options) {
	        this.options = OptionsManager.setOptions(this, options);

	        this._eventOutput = new EventHandler();
	        this._touchTracker = new TouchTracker(this.options);

	        EventHandler.setOutputHandler(this, this._eventOutput);
	        EventHandler.setInputHandler(this, this._touchTracker);

	        this._touchTracker.on('trackstart', handleStart.bind(this));
	        this._touchTracker.on('trackmove', handleMove.bind(this));
	        this._touchTracker.on('trackend', handleEnd.bind(this));

	        this._payload = {};
	        this._cumulate = {};
	        this._value = {};
	    }

	    TouchInput.prototype = Object.create(SimpleStream.prototype);
	    TouchInput.prototype.constructor = TouchInput;

	    TouchInput.DEFAULT_OPTIONS = {
	        direction : undefined,
	        scale : 1,
	        rails : false,
	        track : 1,
	        limit : Infinity
	    };

	    /**
	     * Constrain the input along a specific axis.
	     *
	     * @property DIRECTION {Object}
	     * @property DIRECTION.X {Number}   x-axis
	     * @property DIRECTION.Y {Number}   y-axis
	     * @static
	     */
	    TouchInput.DIRECTION = {
	        X : 0,
	        Y : 1
	    };

	    function handleStart(data) {
	        var touchId = data.touchId;
	        var velocity;
	        var delta;

	        var payload = {};
	        if (this.options.direction !== undefined) {
	            if (this.options.direction === TouchInput.DIRECTION.X) payload.x = data.x;
	            if (this.options.direction === TouchInput.DIRECTION.Y) payload.y = data.y;
	            if (!this._cumulate[touchId]) this._cumulate[touchId] = 0;
	            this._value[touchId] = 0;
	            velocity = 0;
	            delta = 0;
	        }
	        else {
	            if (!this._cumulate[touchId]) this._cumulate[touchId] = [0, 0];
	            this._value[touchId] = [0, 0];
	            velocity = [0, 0];
	            delta = [0, 0];
	            payload.x = data.x;
	            payload.y = data.y;
	        }

	        payload.delta = delta;
	        payload.value = this._value[touchId];
	        payload.cumulate = this._cumulate[touchId];
	        payload.velocity = velocity;
	        payload.count = data.count;
	        payload.touchId = data.touchId;
	        payload.event = data.event;
	        payload.timestamp = data.timestamp;
	        payload.dt = 0;

	        this._payload[data.touchId] = payload;

	        this._eventOutput.emit('start', payload);
	    }

	    function handleMove(data) {
	        var direction = this.options.direction;
	        var touchId = data.touchId;
	        var payload = this._payload[touchId];

	        var scale = this.options.scale;
	        var prevData = data.history[0];

	        var prevTime = prevData.timestamp;
	        var currTime = data.timestamp;

	        var x = data.x;
	        var y = data.y;

	        var diffX = scale * (x - prevData.x);
	        var diffY = scale * (y - prevData.y);

	        if (this.options.rails){
	            if ((direction === TouchInput.DIRECTION.X && Math.abs(diffY) > Math.abs(diffX)))
	                diffY = 0;

	            if (direction === TouchInput.DIRECTION.Y && Math.abs(diffX) > Math.abs(diffY))
	                diffX = 0;
	        }

	        var dt = Math.max(currTime - prevTime, MINIMUM_TICK_TIME);
	        var invDt = 1 / dt;

	        var velX = diffX * invDt;
	        var velY = diffY * invDt;

	        var nextVel;
	        var nextDelta;

	        if (direction === TouchInput.DIRECTION.X) {
	            payload.x = x;
	            nextDelta = diffX;
	            nextVel = velX;
	            this._value[touchId] += nextDelta;
	            this._cumulate[touchId] += nextDelta;
	        }
	        else if (direction === TouchInput.DIRECTION.Y) {
	            payload.y = y;
	            nextDelta = diffY;
	            nextVel = velY;
	            this._value[touchId] += nextDelta;
	            this._cumulate[touchId] += nextDelta;
	        }
	        else {
	            payload.x = x;
	            payload.y = y;
	            nextDelta = [diffX, diffY];
	            nextVel = [velX, velY];
	            this._value[touchId][0] += nextDelta[0];
	            this._value[touchId][1] += nextDelta[1];
	            this._cumulate[touchId][0] += nextDelta[0];
	            this._cumulate[touchId][1] += nextDelta[1];
	        }

	        payload.delta = nextDelta;
	        payload.velocity = nextVel;
	        payload.value = this._value[touchId];
	        payload.cumulate = this._cumulate[touchId];
	        payload.count = data.count;
	        payload.touchId = data.touchId;
	        payload.event = data.event;
	        payload.timestamp = data.timestamp;
	        payload.dt = dt;

	        this._eventOutput.emit('update', payload);
	    }

	    function handleEnd(data) {
	        var touchId = data.touchId;

	        var payload = this._payload[touchId];
	        payload.count = data.count;
	        payload.event = data.event;
	        payload.timestamp = data.timestamp;

	        this._eventOutput.emit('end', payload);

	        delete this._payload[touchId];
	        delete this._value[touchId];
	        delete this._cumulate[touchId];
	    }

	    module.exports = TouchInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var OptionsManager = __webpack_require__(27);
	    var EventHandler = __webpack_require__(3);

	    var now = Date.now;

	    /**
	     * Catalogues a history of touch events. Useful for creating more complex
	     *  touch recognition for gestures. Currently only used by TouchInput to
	     *  track previous touches to compute velocity.
	     *
	     * TouchTracker emits these events with the following payload data:
	     *
	     *      `x`             - Displacement in x-direction
	     *      `y`             - Displacement in y-direction
	     *      `identifier`    - DOM event touch identifier
	     *      `timestamp`     - Timestamp
	     *      `count`         - DOM event for number of simultaneous touches
	     *      `history`       - History of touches for the gesture
	     *      `event`         - Original DOM event
	     *
	     * @class TouchTracker
	     * @constructor
	     * @private
	     * @uses Core._OptionsManager
	     * @param [options] {Object}                Options
	     * @param [options.memory] {Number}         Number of past touches to record in history
	     * @param [options.track] {Number}          Max simultaneous touches to record
	     * @param [options.limit] {Number}          Limit number of touches. If reached, no events are emitted
	     */
	    function TouchTracker(options) {
	        this.options = OptionsManager.setOptions(this, options);

	        this.history = {};
	        this.numTouches = 0;

	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();

	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this._eventInput.on('touchstart', handleStart.bind(this));
	        this._eventInput.on('touchmove', handleMove.bind(this));
	        this._eventInput.on('touchend', handleEnd.bind(this));
	        this._eventInput.on('touchcancel', handleEnd.bind(this));
	    }

	    TouchTracker.DEFAULT_OPTIONS = {
	        track : 1,
	        limit : Infinity,  // number of simultaneous touches
	        memory : 1          // length of recorded history
	    };

	    /**
	     * Record touch data
	     *
	     * @method track
	     * @param id {Number}   touch identifier
	     * @param data {Object} touch data
	     */
	    TouchTracker.prototype.track = function track(id, data) {
	        this.numTouches++;
	        this.history[id] = [data];
	    };

	    /**
	     * Remove record of touch data
	     *
	     * @method untrack
	     * @param id {Number}   touch identifier
	     */
	    TouchTracker.prototype.untrack = function track(id){
	        this.numTouches--;
	        delete this.history[id];
	    };

	    function getData(touch, event, history) {
	        return {
	            x: touch.clientX,
	            y: touch.clientY,
	            touchId : touch.identifier,
	            timestamp: now(),
	            count: event.touches.length,
	            event: touch,
	            history: history
	        };
	    }

	    function handleStart(event) {
	        if (event.touches.length > this.options.limit) return false;
	        if (this.numTouches >= this.options.track) return false;

	        for (var i = 0; i < event.changedTouches.length; i++) {
	            var touch = event.changedTouches[i];
	            var touchId = touch.identifier;
	            var data = getData(touch, event, null);
	            this._eventOutput.emit('trackstart', data);
	            if (!this.history[touchId])
	                this.track(touchId, data);
	        }
	    }

	    function handleMove(event) {
	        if (event.touches.length > this.options.limit) return false;
	        if (this.numTouches > this.options.track) return false;

	        event.preventDefault(); // prevents scrolling on mobile

	        for (var i = 0; i < event.changedTouches.length; i++) {
	            var touch = event.changedTouches[i];
	            var history = this.history[touch.identifier];
	            if (history) {
	                var data = getData(touch, event, history);

	                // don't send event if touch hasn't moved
	                var prev = history[this.options.memory - 1];
	                if (data.x === prev.x && data.y === prev.y) continue;

	                this._eventOutput.emit('trackmove', data);

	                if (history.length >= this.options.memory)
	                    history.shift();
	                history.push(data);
	            }
	        }
	    }

	    function handleEnd(event) {
	        if (event.touches.length > this.options.limit) return false;
	        if (this.numTouches > this.options.track) return false;

	        for (var i = 0; i < event.changedTouches.length; i++) {
	            var touch = event.changedTouches[i];
	            var touchId = touch.identifier;
	            var history = this.history[touchId];
	            if (history) {
	                var data = getData(touch, event, history);
	                this._eventOutput.emit('trackend', data);
	                this.untrack(touchId);
	            }
	        }
	    }

	    module.exports = TouchTracker;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(3);
	    var OptionsManager = __webpack_require__(27);
	    var SimpleStream = __webpack_require__(12);
	    var Timer = __webpack_require__(10);

	    var MINIMUM_TICK_TIME = 8;
	    var MAX_DIFFERENTIAL = 50; // caps mousewheel differentials

	    /**
	     * Wrapper for DOM wheel/mousewheel events. Converts `scroll` events
	     *  to `start`, `update` and `end` events and emits them with the payload:
	     *
	     *      `value`     - Scroll displacement in pixels from start
	     *      `delta`     - Scroll differential in pixels between subsequent events
	     *      `velocity`  - Velocity of scroll
	     *      `event`     - Original DOM event
	     *
	     * @example
	     *
	     *      var scrollInput = new ScrollInput();
	     *
	     *      scrollInput.subscribe(surface)
	     *
	     *      scrollInput.on('start', function(payload){
	     *          console.log('start', payload);
	     *      });
	     *
	     *      scrollInput.on('update', function(payload){
	     *          console.log('update', payload);
	     *      });
	     *
	     *      scrollInput.on('end', function(payload){
	     *          console.log('end', payload);
	     *      });
	     *
	     * @class ScrollInput
	     * @constructor
	     * @extends Streams.SimpleStream
	     * @uses Core._OptionsManager
	     * @param [options] {Object}                Options
	     * @param [options.direction] {Number}      Direction to project movement onto.
	     *                                          Options found in TouchInput.DIRECTION.
	     * @param [options.scale=1] {Number}        Scale the response to the mouse
	     */
	    function ScrollInput(options) {
	        this.options = OptionsManager.setOptions(this, options);

	        this._payload = {
	            delta : null,
	            value : null,
	            cumulate : null,
	            velocity : null,
	            event : null
	        };

	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();

	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this._eventInput.on('wheel', handleMove.bind(this));

	        this._value = (this.options.direction === undefined) ? [0, 0] : 0;
	        this._cumulate = (this.options.direction === undefined) ? [0, 0] : 0;
	        this._prevTime = undefined;
	        this._inProgress = false;

	        var self = this;
	        this._scrollEnd = Timer.debounce(function(event){
	            self._inProgress = false;
	            // this prevents velocities for mousewheel events vs trackpad ones
	            if (self._payload.delta !== 0){
	                self._payload.velocity = 0;
	            }
	            self._payload.event = event;

	            self._eventOutput.emit('end', self._payload);
	        }, 100);
	    }

	    ScrollInput.prototype = Object.create(SimpleStream.prototype);
	    ScrollInput.prototype.constructor = ScrollInput;

	    ScrollInput.DEFAULT_OPTIONS = {
	        direction: undefined,
	        scale: 1
	    };

	    /**
	     * Constrain the input along a specific axis.
	     *
	     * @property DIRECTION {Object}
	     * @property DIRECTION.X {Number}   x-axis
	     * @property DIRECTION.Y {Number}   y-axis
	     * @static
	     */
	    ScrollInput.DIRECTION = {
	        X : 0,
	        Y : 1
	    };

	    var _now = Date.now;

	    function handleMove(event) {
	        event.preventDefault(); // Disable default scrolling behavior

	        if (!this._inProgress) {
	            this._value = (this.options.direction === undefined) ? [0, 0] : 0;
	            payload = this._payload;
	            payload.value = this._value;
	            payload.cumulate = this._cumulate;
	            payload.event = event;

	            this._eventOutput.emit('start', payload);
	            this._inProgress = true;
	            return;
	        }

	        var currTime = _now();
	        var prevTime = this._prevTime || currTime;

	        var diffX = -event.deltaX;
	        var diffY = -event.deltaY;

	        if (diffX > MAX_DIFFERENTIAL) diffX = MAX_DIFFERENTIAL;
	        if (diffY > MAX_DIFFERENTIAL) diffY = MAX_DIFFERENTIAL;
	        if (diffX < -MAX_DIFFERENTIAL) diffX = -MAX_DIFFERENTIAL;
	        if (diffY < -MAX_DIFFERENTIAL) diffY = -MAX_DIFFERENTIAL;

	        var invDeltaT = 1 / Math.max(currTime - prevTime, MINIMUM_TICK_TIME); // minimum tick time
	        this._prevTime = currTime;

	        var velX = diffX * invDeltaT;
	        var velY = diffY * invDeltaT;

	        var scale = this.options.scale;
	        var nextVel;
	        var nextDelta;

	        if (this.options.direction === ScrollInput.DIRECTION.X) {
	            nextDelta = scale * diffX;
	            nextVel = scale * velX;
	            this._value += nextDelta;
	            this._cumulate += nextDelta;
	        }
	        else if (this.options.direction === ScrollInput.DIRECTION.Y) {
	            nextDelta = scale * diffY;
	            nextVel = scale * velY;
	            this._value += nextDelta;
	            this._cumulate += nextDelta;
	        }
	        else {
	            nextDelta = [scale * diffX, scale * diffY];
	            nextVel = [scale * velX, scale * velY];
	            this._value[0] += nextDelta[0];
	            this._value[1] += nextDelta[1];
	            this._cumulate[0] += nextDelta[0];
	            this._cumulate[1] += nextDelta[1];
	        }

	        var payload = this._payload;
	        payload.delta    = nextDelta;
	        payload.velocity = nextVel;
	        payload.value = this._value;
	        payload.cumulate = this._cumulate;
	        payload.event = event;

	        this._eventOutput.emit('update', payload);

	        // debounce `end` event
	        this._scrollEnd(event);
	    }

	    module.exports = ScrollInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var TwoFingerInput = __webpack_require__(50);
	    var OptionsManager = __webpack_require__(27);
	    var EventHandler = __webpack_require__(3);

	    /**
	     * Detects two-finger pinching motion and emits `start`, `update` and
	     *  `end` events with the payload data:
	     *
	     *      `count`         - Number of simultaneous touches
	     *      `value`         - Amount of scaling from starting placement
	     *      `delta`         - Difference in scaling
	     *      `velocity`      - Relative velocity of the scale
	     *      `cumulate`      - Total accumulated scaling
	     *      `center`        - Midpoint between the two touches
	     *
	     *  The value is the ratio of the current displacement between two fingers
	     *  with the initial displacement. For example, a value of 1 indicates the fingers
	     *  are at the same displacement from where they began. A value of 2 indicates the fingers
	     *  are twice as far away as they originally began. A value of 1/2 indicates the fingers
	     *  are twice as close as they originally began, etc.
	     *
	     * @example
	     *
	     *      var scaleInput = new ScaleInput();
	     *      scaleInput.subscribe(surface)
	     *
	     *      scaleInput.on('start', function(payload){
	     *          console.log('start', payload);
	     *      });
	     *
	     *      scaleInput.on('update', function(payload){
	     *          console.log('update', payload);
	     *      });
	     *
	     *      scaleInput.on('end', function(payload){
	     *          console.log('end', payload);
	     *      });
	     *
	     * @class ScaleInput
	     * @extends Inputs._TwoFingerInput
	     * @uses Core._OptionsManager
	     * @constructor
	     * @param options {Object}                  Options
	     * @param [options.scale=1] {Number}        Scale the response to pinch
	     * @param [options.direction] {Number}      Direction to project movement onto.
	     *                                          Options found in ScaleInput.DIRECTION.
	     * @param [options.rails=false] {Boolean}   If a direction is specified, movement in the
	     *                                          orthogonal direction is suppressed
	     */
	    function ScaleInput(options) {
	        this.options = OptionsManager.setOptions(this, options);

	        this._eventInput = new TwoFingerInput(this.options);
	        this._eventOutput = new EventHandler();

	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this._eventInput.on('twoFingerStart', start.bind(this));
	        this._eventInput.on('twoFingerUpdate', update.bind(this));
	        this._eventInput.on('twoFingerEnd', end.bind(this));

	        this.payload = {
	            delta : 0,
	            velocity : 0,
	            value : 0,
	            cumulate : 0,
	            center : []
	        };

	        this.startDist = 0;
	        this.prevDist = 0;
	        this.value = 1;
	        this.cumulate = 1;
	    }

	    ScaleInput.prototype = Object.create(TwoFingerInput.prototype);
	    ScaleInput.prototype.constructor = ScaleInput;

	    ScaleInput.DEFAULT_OPTIONS = {
	        direction : undefined,
	        scale : 1,
	        rails : false
	    };

	    ScaleInput.DIRECTION = {
	        X : 0,
	        Y : 1
	    };

	    function start(data){
	        var center = TwoFingerInput.calculateCenter.call(this, data[0].position, data[1].position);
	        var distance = TwoFingerInput.calculateDistance.call(this, data[0].position, data[1].position);

	        this.startDist = distance;
	        this.prevDist = distance;
	        this.value = 1;

	        var payload = this.payload;
	        payload.value = this.value;
	        payload.center = center;

	        this._eventOutput.emit('start', payload);

	        this.value = distance;
	    }

	    function update(data) {
	        var center = TwoFingerInput.calculateCenter.call(this, data[0].position, data[1].position);
	        var distance = TwoFingerInput.calculateDistance.call(this, data[0].position, data[1].position);

	        var scale = this.options.scale;

	        var delta = scale * (distance - this.prevDist) / this.startDist;
	        var velocity = 2 * delta / (data[0].dt + data[1].dt);
	        this.value += delta;
	        this.cumulate += delta;

	        var payload = this.payload;
	        payload.delta = delta;
	        payload.cumulate = this.cumulate;
	        payload.velocity = velocity;
	        payload.value = this.value;
	        payload.center = center;

	        this._eventOutput.emit('update', payload);

	        this.prevDist = distance;
	    }

	    function end(){
	        this._eventOutput.emit('end', this.payload);
	    }

	    module.exports = ScaleInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(3);
	    var SimpleStream = __webpack_require__(12);
	    var OptionsManager = __webpack_require__(27);
	    var TouchInput = __webpack_require__(46);

	    /**
	     * Generalizes handling of two-finger touch events.
	     *  Helper to PinchInput and RotateInput.
	     *  This class is meant to be overridden and not used directly.
	     *
	     * @class TwoFingerInput
	     * @extends Streams.SimpleStream
	     * @uses Core._OptionsManager
	     * @private
	     * @constructor
	     */
	    function TwoFingerInput(options) {
	        this.options = OptionsManager.setOptions(this, options);

	        this._eventInput = new TouchInput(this.options);
	        this._eventOutput = new EventHandler();

	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this.payload = [];
	        this.touchIdA = undefined;
	        this.touchIdB = undefined;
	        this.posA = null;
	        this.posB = null;

	        this._eventInput.on('start', handleStart.bind(this));
	        this._eventInput.on('update', handleMove.bind(this));
	        this._eventInput.on('end', handleEnd.bind(this));
	    }

	    TwoFingerInput.prototype = Object.create(SimpleStream.prototype);
	    TwoFingerInput.prototype.constructor = TwoFingerInput;

	    TwoFingerInput.DIRECTION = {
	        X : 0,
	        Y : 1
	    };

	    TwoFingerInput.DEFAULT_OPTIONS = {
	        direction : undefined,
	        rails : false,
	        track : 2
	    };

	    /**
	     * Calculates the angle between two touches relative to [0,1].
	     *  Direction option must not be set to x- or y- axes, otherwise 0 is returned.
	     *
	     * @method calculateAngle
	     * @static
	     * @param value1 {Array}  First touch location (x,y)
	     * @param value2 {Array}  Second touch location (x,y)
	     * @return {Number}
	     */
	    TwoFingerInput.calculateAngle = function(value1, value2) {
	        if (this.options.direction !== undefined) return 0;
	        var diffX = value2[0] - value1[0];
	        var diffY = value2[1] - value1[1];
	        return Math.atan2(diffY, diffX);
	    };

	    /**
	     * Calculates the distance between two touches.
	     *
	     * @method calculateDistance
	     * @static
	     * @param value1 {Number|Array}  First touch location (x,y)
	     * @param value2 {Number|Array}  Second touch location (x,y)
	     * @return {Number}
	     */
	    TwoFingerInput.calculateDistance = function(value1, value2) {
	        var direction = this.options.direction;

	        if (direction === undefined){
	            var diffX = value2[0] - value1[0];
	            var diffY = value2[1] - value1[1];
	            return Math.sqrt(diffX * diffX + diffY * diffY);
	        }
	        else return Math.abs(value2 - value1);
	    };

	    /**
	     * Calculates the midpoint between two touches.
	     *
	     * @method calculateCenter
	     * @static
	     * @param value1 {Number|Array}  First touch location
	     * @param value2 {Number|Array}  Second touch location
	     * @return {Number|Array}
	     */
	    TwoFingerInput.calculateCenter = function(value1, value2) {
	        return (this.options.direction === undefined)
	            ? [0.5 * (value1[0] + value2[0]), 0.5 * (value1[1] + value2[1])]
	            : (value1 + value2);
	    };

	    /**
	     * Calculates the combined velocity of the two touches.
	     *
	     * @method calculateCenter
	     * @static
	     * @param velocity1 {Number|Array}  First velocity
	     * @param velocity2 {Number|Array}  Second velocity
	     * @return {Number|Array}
	     */
	    TwoFingerInput.calculateVelocity = function(velocity1, velocity2){
	        return (this.options.direction === undefined)
	            ? [0.5 * (velocity1[0] + velocity2[0]), 0.5 * (velocity1[1] + velocity2[1])]
	            : 0.5 * (velocity1 + velocity2);
	    };

	    /**
	     * Calculates the direction of the touch.
	     *
	     * @method calculateOrientation
	     * @static
	     * @param value1 {Number|Array}  First velocity
	     * @param value2 {Number|Array}  Second velocity
	     * @return {Number|Array}
	     */
	    TwoFingerInput.calculateOrientation = function(value1, value2){
	        return (this.options.direction === undefined)
	            ? [(value2[0] - value1[0]), (value2[1] - value1[1])]
	            : value2 - value1;
	    };

	    /**
	     * Detects if orientation has changed.
	     *
	     * @method detectOrientationChange
	     * @static
	     * @param dir2 {Number|Array}  First direction
	     * @param dir1 {Number|Array}  Second direction
	     * @return {Boolean}
	     */
	    TwoFingerInput.detectOrientationChange = function(dir1, dir2){
	        return (this.options.direction === undefined)
	            ? dir1[0] * dir2[0] + dir1[1] * dir2[1] <= 0
	            : dir1 * dir2 <= 0;
	    };

	    function getPosition(event){
	        var direction = this.options.direction;
	        var position;
	        if (direction === TwoFingerInput.DIRECTION.X)
	            position = event.pageX;
	        else if (direction === TwoFingerInput.DIRECTION.Y)
	            position = event.pageY;
	        else
	            position = [event.pageX, event.pageY];

	        return position;
	    }

	    function handleStart(data) {
	        data.position = getPosition.call(this, data.event);

	        if (this.touchIdA === data.touchId){
	            this.payload[0] = data;
	        }

	        if (this.touchIdA === undefined){
	            this.touchIdA = data.touchId;
	            this.payload[0] = data;
	        }
	        else if (this.touchIdB === undefined){
	            this.touchIdB = data.touchId;
	            this.payload[1] = data;
	            this.emit('twoFingerStart', this.payload);
	        }
	    }

	    function handleMove(data) {
	        if (this.touchIdA === undefined || this.touchIdB === undefined)
	            return false;

	        data.position = getPosition.call(this, data.event);

	        if (data.touchId === this.touchIdA)
	            this.payload[0] = data;
	        else if (data.touchId === this.touchIdB)
	            this.payload[1] = data;

	        this.emit('twoFingerUpdate', this.payload);
	    }

	    function handleEnd(data) {
	        if (this.touchIdA === undefined || this.touchIdB === undefined) {
	            this.touchIdA = undefined;
	            this.touchIdB = undefined;
	            return false;
	        }

	        this.emit('twoFingerEnd', this.payload);
	        this.touchIdA = undefined;
	        this.touchIdB = undefined;
	        this.payload = [];
	    }

	    module.exports = TwoFingerInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var TwoFingerInput = __webpack_require__(50);
	    var OptionsManager = __webpack_require__(27);
	    var EventHandler = __webpack_require__(3);

	    /**
	     * Detects two-finger rotational motion and emits `start`, `update` and
	     *  `end` events with the payload data:
	     *
	     *      `count`         - Number of simultaneous touches
	     *      `value`         - Angle of rotation
	     *      `delta`         - Differential of successive angles
	     *      `cumulate`      - Total accumulated rotation
	     *      `velocity`      - Velocity of rotation
	     *      `center`        - Midpoint between the two touches
	     *
	     * @example
	     *
	     *      var rotateInput = new RotateInput();
	     *      rotateInput.subscribe(surface)
	     *
	     *      rotateInput.on('start', function(payload){
	     *          console.log('start', payload);
	     *      });
	     *
	     *      rotateInput.on('update', function(payload){
	     *          console.log('update', payload);
	     *      });
	     *
	     *      rotateInput.on('end', function(payload){
	     *          console.log('end', payload);
	     *      });
	     *
	     * @class RotateInput
	     * @extends Inputs._TwoFingerInput
	     * @uses Core._OptionsManager
	     * @constructor
	     * @param options {Object}              Options
	     * @param [options.scale=1] {Number}    Scale the response to pinch
	     */
	    function RotateInput(options) {
	        this.options = OptionsManager.setOptions(this, options);

	        this._eventInput = new TwoFingerInput(this.options);
	        this._eventOutput = new EventHandler();

	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this._eventInput.on('twoFingerStart', start.bind(this));
	        this._eventInput.on('twoFingerUpdate', update.bind(this));
	        this._eventInput.on('twoFingerEnd', end.bind(this));

	        this.payload = {
	            count : 0,
	            delta : 0,
	            velocity : 0,
	            value : 1,
	            cumulate : 0,
	            center : []
	        };

	        this._angle = 0;
	        this._previousAngle = 0;
	        this.cumulate = 0;
	    }

	    RotateInput.prototype = Object.create(TwoFingerInput.prototype);
	    RotateInput.prototype.constructor = RotateInput;

	    RotateInput.DEFAULT_OPTIONS = {
	        scale : 1
	    };

	    function start(data) {
	        this._previousAngle = TwoFingerInput.calculateAngle.call(this, data[0].position, data[1].position);
	        var center = TwoFingerInput.calculateCenter.call(this, data[0].position, data[1].position);

	        this._angle = 0;

	        var payload = this.payload;
	        payload.count = event.touches.length;
	        payload.value = this._angle;
	        payload.cumulate = this.cumulate;
	        payload.center = center;

	        this._eventOutput.emit('start', this.payload);
	    }

	    function update(data) {
	        var currAngle = TwoFingerInput.calculateAngle.call(this, data[0].position, data[1].position);
	        var center = TwoFingerInput.calculateCenter.call(this, data[0].position, data[1].position);

	        var scale = this.options.scale;

	        var delta = scale * (currAngle - this._previousAngle);
	        var velocity = delta / data.dt;

	        this._angle += delta;
	        this.cumulate += delta;

	        var payload = this.payload;
	        payload.delta = delta;
	        payload.cumulate = this.cumulate;
	        payload.velocity = velocity;
	        payload.value = this._angle;
	        payload.center = center;

	        this._eventOutput.emit('update', payload);

	        this._previousAngle = currAngle;
	    }

	    function end(data){
	        this._eventOutput.emit('update', this.payload);
	    }

	    module.exports = RotateInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module){
	    var EventHandler = __webpack_require__(3);
	    var TwoFingerInput = __webpack_require__(50);
	    var OptionsManager = __webpack_require__(27);

	    /**
	     * Detects two-finger pinching motion and emits `start`, `update` and
	     *  `end` events with the payload data:
	     *
	     *      `value`         - Distance between the two touches
	     *      `delta`         - Differential in successive distances
	     *      `velocity`      - Relative velocity between two touches
	     *      `displacement`  - Total accumulated displacement
	     *      `center`        - Midpoint between the two touches
	     *
	     * @example
	     *
	     *      var pinchInput = new PinchInput();
	     *
	     *      pinchInput.subscribe(Engine) // listens on `window` events
	     *
	     *      pinchInput.on('start', function(payload){
	     *          console.log('start', payload);
	     *      });
	     *
	     *      pinchInput.on('update', function(payload){
	     *          console.log('update', payload);
	     *      });
	     *
	     *      pinchInput.on('end', function(payload){
	     *          console.log('end', payload);
	     *      });
	     *
	     * @class PinchInput
	     * @extends Inputs._TwoFingerInput
	     * @uses Core._OptionsManager
	     * @constructor
	     * @param options {Object}                  Options
	     * @param [options.scale=1] {Number}        Scale the response to pinch
	     * @param [options.direction] {Number}      Direction to project movement onto.
	     *                                          Options found in TouchInput.DIRECTION.
	     * @param [options.rails=false] {Boolean}   If a direction is specified, movement in the
	     *                                          orthogonal direction is suppressed
	     */
	    function PinchInput(options){
	        this.options = OptionsManager.setOptions(this, options);

	        this._eventInput = new TwoFingerInput(this.options);
	        this._eventOutput = new EventHandler();

	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this._eventInput.on('twoFingerStart', start.bind(this));
	        this._eventInput.on('twoFingerUpdate', update.bind(this));
	        this._eventInput.on('twoFingerEnd', end.bind(this));

	        this.payload = {
	            delta : null,
	            velocity : null,
	            value : null,
	            center : []
	        };

	        this.value = 0;
	        this.direction = [];
	    }

	    PinchInput.prototype = Object.create(TwoFingerInput.prototype);
	    PinchInput.prototype.constructor = PinchInput;

	    PinchInput.DIRECTION = {
	        X : 0,
	        Y : 1
	    };

	    PinchInput.DEFAULT_OPTIONS = {
	        scale : 1,
	        direction : undefined,
	        rails : true
	    };

	    function start(data){
	        var center = TwoFingerInput.calculateCenter.call(this, data[0].position, data[1].position);
	        var distance = TwoFingerInput.calculateDistance.call(this, data[0].position, data[1].position);
	        this.direction = TwoFingerInput.calculateOrientation.call(this, data[0].position, data[1].position);

	        var payload = this.payload;
	        payload.value = distance;
	        payload.center = center;

	        this._eventOutput.emit('start', payload);

	        this.value = distance;
	    }

	    function update(data){
	        var center = TwoFingerInput.calculateCenter.call(this, data[0].position, data[1].position);
	        var distance = TwoFingerInput.calculateDistance.call(this, data[0].position, data[1].position);
	        var currDirection = TwoFingerInput.calculateOrientation.call(this, data[0].position, data[1].position);

	        var changedDirection = TwoFingerInput.detectOrientationChange.call(this, currDirection, this.direction);
	        var scale = this.options.scale;
	        var delta;

	        if (changedDirection) distance *= -1;
	        delta = scale * (distance - this.value);

	        var velocity = 2 * delta / (data[0].dt + data[1].dt);

	        var payload = this.payload;
	        payload.delta = delta;
	        payload.velocity = velocity;
	        payload.value = this.value;
	        payload.center = center;

	        this._eventOutput.emit('update', payload);

	        this.value = distance;
	    }

	    function end(){
	        this._eventOutput.emit('end', this.payload);
	    }

	    module.exports = PinchInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    module.exports = {
	        DrawerLayout: __webpack_require__(54),
	        FlexibleLayout: __webpack_require__(57),
	        GridLayout: __webpack_require__(59),
	        SequentialLayout: __webpack_require__(60),
	        HeaderFooterLayout: __webpack_require__(61),
	        Scrollview: __webpack_require__(62)
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Transform = __webpack_require__(9);
	    var Transitionable = __webpack_require__(11);
	    var View = __webpack_require__(25);
	    var Stream = __webpack_require__(16);
	    var Differential = __webpack_require__(55);
	    var Accumulator = __webpack_require__(56);
	    var EventMapper = __webpack_require__(13);

	    var CONSTANTS = {
	        DIRECTION : {
	            X : 0,
	            Y : 1
	        },
	        SIDE : {
	            LEFT : 0,
	            TOP : 1,
	            RIGHT : 2,
	            BOTTOM : 3
	        },
	        ORIENTATION : {
	            POSITIVE :  1,
	            NEGATIVE : -1
	        }
	    };

	    /**
	     * A layout composed of two sections: content and drawer.
	     *
	     *  The drawer is initially hidden behind the content, until it is moved
	     *  by a call to setPosition. The source of the movement can be by subscribing
	     *  the layout to user input (like a Mouse/Touch/Scroll input), or by manually
	     *  calling setPosition with a transition.
	     *
	     *  The layout emits a `start`, `update` and `end` Stream with payload
	     *
	     *      `progress` - Number between 0 and 1 indicating how open the drawer is
	     *      `value` - Pixel displacement in how open the drawer is
	     *
	     *  It also emits `close` and `open` events.
	     *
	     *  The drawer can be revealed from any side of the content (top, left, bottom, right),
	     *  by specifying a side option.
	     *
	     *  @class DrawerLayout
	     *  @constructor
	     *  @namespace Layouts
	     *  @extends Core.View
	     *  @param [options] {Object}                       Options
	     *  @param [options.side] {Number}                  Side to reveal the drawer from. Defined in DrawerLayout.SIDES
	     *  @param [options.revealLength] {Number}          The maximum length to reveal the drawer
	     *  @param [options.velocityThreshold] {Number}     The velocity needed to complete the drawer transition
	     *  @param [options.positionThreshold] {Number}     The displacement needed to complete the drawer transition
	     *  @param [options.transitionClose] {Object}       A transition definition for closing the drawer
	     *  @param [options.transitionOpen] {Object}        A transition definition for opening the drawer
	     */
	    var DrawerLayout = View.extend({
	        defaults : {
	            side : CONSTANTS.SIDE.LEFT,
	            revealLength : undefined,
	            velocityThreshold : Infinity,
	            positionThreshold : 0,
	            transitionOpen : true,
	            transitionClose : true
	        },
	        events : {
	            change : _updateState
	        },
	        initialize : function initialize(options){
	            // DERIVED STATE

	            // vertical or horizontal movement
	            this.direction = _getDirectionFromSide(options.side);

	            // positive or negative movement along the direction
	            this.orientation = _getOrientationFromSide(options.side);

	            // scale the revealLength by the parity of the direction
	            this.options.revealLength *= this.orientation;

	            // open state (needed for toggling)
	            this.isOpen = false;

	            // STREAMS
	            
	            // responsible for manually moving the content without user input
	            this.transitionStream = new Transitionable(0);

	            // responsible for moving the content from user input
	            var gestureDelta = new Stream({
	                start : function (){
	                    this.transitionStream.halt();
	                    return 0;
	                }.bind(this),
	                update : function (data){
	                    // modify the delta from user input to be constrained
	                    // by the revealLength
	                    var delta = data.delta;
	                    var newDelta = delta;
	                    var revealLength = options.revealLength;

	                    var currentPosition = this.position.get();
	                    var newPosition = currentPosition + delta;

	                    var MIN_LENGTH = 0;
	                    var MAX_LENGTH = 0;

	                    if (this.orientation === CONSTANTS.ORIENTATION.POSITIVE)
	                        MAX_LENGTH = revealLength;
	                    else
	                        MIN_LENGTH = revealLength;

	                    if (newPosition >= MAX_LENGTH || newPosition <= MIN_LENGTH){
	                        if (newPosition > MAX_LENGTH && newPosition > MIN_LENGTH && currentPosition !== MAX_LENGTH)
	                            newDelta = MAX_LENGTH - currentPosition;
	                        else if (newPosition < MIN_LENGTH && currentPosition !== MIN_LENGTH)
	                            newDelta = MIN_LENGTH - currentPosition;
	                        else
	                            newDelta = 0;
	                    }

	                    return newDelta;
	                }.bind(this),
	                end : function (data){
	                    var velocity = data.velocity;

	                    var orientation = this.orientation;
	                    var position = this.position.get();

	                    var length = options.revealLength;
	                    var MAX_LENGTH = orientation * length;
	                    var positionThreshold = options.positionThreshold || MAX_LENGTH / 2;
	                    var velocityThreshold = options.velocityThreshold;

	                    if (position === 0) {
	                        this.isOpen = false;
	                        return false;
	                    }

	                    if (position === MAX_LENGTH) {
	                        this.isOpen = true;
	                        return false;
	                    }

	                    var shouldOpen =
	                        (position >= positionThreshold) && ((velocity > -velocityThreshold) || (velocity > velocityThreshold)) ||
	                        (position <  positionThreshold) && ((velocity >  velocityThreshold));

	                    if (shouldOpen){
	                        this.options.transitionOpen.velocity = velocity;
	                        this.open(this.options.transitionOpen, function(){
	                            this.options.transitionOpen.velocity = 0;
	                        }.bind(this));
	                    }
	                    else {
	                        this.options.transitionClose.velocity = velocity;
	                        this.close(this.options.transitionClose, function(){
	                            this.options.transitionClose.velocity = 0;
	                        }.bind(this));
	                    }
	                }.bind(this)
	            });

	            gestureDelta.subscribe(this.input);

	            var transitionDelta = new Differential();
	            transitionDelta.subscribe(this.transitionStream);

	            this.position = new Accumulator(0);
	            this.position.subscribe(gestureDelta);
	            this.position.subscribe(transitionDelta);

	            var outputMapper = new EventMapper(function(position){
	                return {
	                    value : position,
	                    progress : position / this.options.revealLength
	                }
	            }.bind(this));

	            this.output.subscribe(outputMapper).subscribe(this.position);
	        },
	        /**
	         * Set the drawer component with a Surface of View.
	         *
	         * @method addDrawer
	         * @param drawer {Surface|View}
	         */
	        addDrawer : function addDrawer(drawer){
	            if (this.options.revealLength === undefined)
	                this.options.revealLength = drawer.getSize()[this.direction];

	            this.drawer = drawer;
	            this.add({transform : Transform.behind}).add(this.drawer);
	        },
	        /**
	         * Set the content component with a Surface or View.
	         *
	         * @method addContent
	         * @param content {Surface|View}
	         */
	        addContent : function addContent(content){
	            var transform = this.position.map(function(position){
	                return (this.direction === CONSTANTS.DIRECTION.X)
	                    ? Transform.translateX(position)
	                    : Transform.translateY(position)
	            }.bind(this));

	            this.add({transform : transform}).add(content);
	        },
	        /**
	         * Reveals the drawer with a transition.
	         *   Emits an `open` event when an opening transition has been committed to.
	         *
	         * @method open
	         * @param [transition] {Boolean|Object} transition definition
	         * @param [callback] {Function}         callback
	         */
	        open : function open(transition, callback){
	            if (transition === undefined) transition = this.options.transitionOpen;
	            this.setPosition(this.options.revealLength, transition, callback);
	            if (!this.isOpen) {
	                this.isOpen = true;
	                this.emit('open');
	            }
	        },
	        /**
	         * Conceals the drawer with a transition.
	         *   Emits a `close` event when an closing transition has been committed to.
	         *
	         * @method close
	         * @param [transition] {Boolean|Object} transition definition
	         * @param [callback] {Function}         callback
	         */
	        close : function close(transition, callback){
	            if (transition === undefined) transition = this.options.transitionClose;
	            this.setPosition(0, transition, callback);
	            if (this.isOpen){
	                this.isOpen = false;
	                this.emit('close');
	            }
	        },
	        /**
	         * Toggles between open and closed states.
	         *
	         * @method toggle
	         * @param [transition] {Boolean|Object} transition definition
	         */
	        toggle : function toggle(transition){
	            if (this.isOpen) this.close(transition);
	            else this.open(transition);
	        },
	        /**
	         * Sets the position in pixels for the content's displacement.
	         *
	         * @method setPosition
	         * @param position {Number}             position
	         * @param [transition] {Boolean|Object} transition definition
	         * @param [callback] {Function}         callback
	         */
	        setPosition : function setPosition(position, transition, callback) {
	            this.transitionStream.reset(this.position.get());
	            this.transitionStream.set(position, transition, callback);
	        },
	        /**
	         * Resets to last state of being open or closed
	         *
	         * @method reset
	         * @param [transition] {Boolean|Object} transition definition
	         */
	        reset : function reset(transition) {
	            if (this.isOpen) this.open(transition);
	            else this.close(transition);
	        }
	    }, CONSTANTS);

	    function _getDirectionFromSide(side) {
	        var SIDE = CONSTANTS.SIDE;
	        var DIRECTION = CONSTANTS.DIRECTION;
	        return (side === SIDE.LEFT || side === SIDE.RIGHT)
	            ? DIRECTION.X
	            : DIRECTION.Y;
	    }

	    function _getOrientationFromSide(side) {
	        var SIDES = CONSTANTS.SIDE;
	        return (side === SIDES.LEFT || side === SIDES.TOP)
	            ? CONSTANTS.ORIENTATION.POSITIVE
	            : CONSTANTS.ORIENTATION.NEGATIVE;
	    }

	    function _updateState(data){
	        var key = data.key;
	        var value = data.value;
	        if (key !== 'side') {
	            this.direction = _getDirectionFromSide(value);
	            this.orientation = _getOrientationFromSide(value);
	        }
	        this.options.revealLength *= this.direction;
	    }

	    module.exports = DrawerLayout;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module){
	    var Stream = __webpack_require__(16);
	    var OptionsManager = __webpack_require__(27);

	    /**
	     * Differential is a Stream that emits differentials of consecutive
	     *  input values.
	     *
	     *  It emits `start`, `update` and `end` events.
	     *
	     *  @example
	     *
	     *      var differential = new Differential();
	     *      // this gives differentials of mouse input
	     *      differential.subscribe(mouseInput.pluck('value'));
	     *
	     *
	     * @class Differential
	     * @extends Streams.Stream
	     * @uses Core._OptionsManager
	     * @namespace Streams
	     * @constructor
	     * @param [options] {Object}        Options
	     * @param [options.scale] {Number}  Scale to apply to differential
	     */
	    function Differential(options){
	        this.options = OptionsManager.setOptions(this, options);

	        var previous = undefined;
	        var delta = undefined;
	        var tempDelta = undefined;
	        var hasUpdated = false;

	        Stream.call(this, {
	            update: function () { return delta; }
	        });

	        this._eventInput.on('start', function (value) {
	            hasUpdated = false;
	            var scale = this.options.scale;
	            if (value instanceof Array){
	                if (previous !== undefined){
	                    tempDelta = [];
	                    for (var i = 0; i < value.length; i++)
	                        tempDelta[i] = scale * (value[i] - previous[i]);
	                }
	                previous = value.slice();
	            }
	            else {
	                if (previous !== undefined)
	                    tempDelta = scale * (value - previous);
	                previous = value;
	            }
	        }.bind(this));

	        this._eventInput.on('update', function (value) {
	            hasUpdated = true;
	            var scale = this.options.scale;
	            if (previous instanceof Array) {
	                delta = [];
	                for (var i = 0; i < previous.length; i++) {
	                    delta[i] = scale * (value[i] - previous[i]);
	                    previous[i] = value[i];
	                }
	            }
	            else {
	                delta = scale * (value - previous);
	                previous = value;
	            }
	        }.bind(this));

	        this._eventInput.on('end', function(value){
	            // Emit update if immediate set called
	            if (!hasUpdated && tempDelta !== undefined) {
	                this.emit('update', tempDelta);
	                previous = value;
	            }
	        }.bind(this));
	    }

	    Differential.DEFAULT_OPTIONS = {
	        scale : 1
	    };

	    Differential.prototype = Object.create(Stream.prototype);
	    Differential.prototype.constructor = Differential;

	    module.exports = Differential;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module){
	    var OptionsManager = __webpack_require__(27);
	    var Stream = __webpack_require__(16);
	    var preTickQueue = __webpack_require__(6);
	    var dirtyQueue = __webpack_require__(7);

	    /**
	     * Accumulator is a Stream that accumulates a value given by a
	     *  number or array of numbers.
	     *
	     *  It emits `start`, `update` and `end` events.
	     *
	     *  @example
	     *
	     *      var accumulator = new Accumulator(0);
	     *
	     *      // this gives the total displacement of mouse input
	     *      accumulator.subscribe(mouseInput.pluck('delta'));
	     *
	     *
	     * @class Accumulator
	     * @extends Streams.Stream
	     * @uses Core._OptionsManager
	     * @namespace Streams
	     * @constructor
	     * @param [sum] {Number|Array}    Initial value
	     * @param [options] {Object}      Options
	     * @param [options.min] {Number}  Set a minimum value
	     * @param [options.max] {Number}  Set a maximum value
	     */
	    function Accumulator(sum, options){
	        this.options = OptionsManager.setOptions(this, options);

	        // TODO: is this state necessary?
	        this.sum = undefined;

	        if (sum !== undefined) this.set(sum);

	        Stream.call(this, {
	            start : function(){ return this.sum || 0; }.bind(this),
	            update : function(){ return this.sum; }.bind(this),
	            end : function(){ return this.sum || 0; }.bind(this)
	        });

	        // TODO: is `start` event necessary?
	        this._eventInput.on('start', function(value){
	            if (this.sum !== undefined) return;
	            if (value instanceof Array) {
	                this.sum = [];
	                for (var i = 0; i < value.length; i++)
	                    this.sum[i] = clamp(value[i], this.options.min, this.options.max);
	            }
	            else this.sum = clamp(value, this.options.min, this.options.max);
	        }.bind(this));

	        this._eventInput.on('update', function(delta){
	            if (delta instanceof Array){
	                for (var i = 0; i < delta.length; i++){
	                    this.sum[i] += delta[i];
	                    this.sum[i] = clamp(this.sum[i], this.options.min, this.options.max);
	                }
	            }
	            else {
	                this.sum += delta;
	                this.sum = clamp(this.sum, this.options.min, this.options.max);
	            }
	        }.bind(this));
	    }

	    Accumulator.prototype = Object.create(Stream.prototype);
	    Accumulator.prototype.constructor = Accumulator;

	    Accumulator.DEFAULT_OPTIONS = {
	        min : -Infinity,
	        max :  Infinity
	    };

	    function clamp(value, min, max){
	        return Math.min(Math.max(value, min), max);
	    }

	    /**
	     * Set accumulated value.
	     *
	     * @method set
	     * @param sum {Number}              Current value
	     * @param [silent=false] {Boolean}  Flag to suppress events
	     */
	    Accumulator.prototype.set = function(sum, silent){
	        this.sum = sum;
	        if (silent === true) return;
	        var self = this;
	        preTickQueue.push(function(){
	            self.trigger('start', sum);
	            dirtyQueue.push(function(){
	                self.trigger('end', sum);
	            });
	        })
	    };

	    /**
	     * Returns current accumulated value.
	     *
	     * @method get
	     * @return {Number}
	     */
	    Accumulator.prototype.get = function(){
	        return this.sum;
	    };

	    module.exports = Accumulator;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module){
	    var Transform = __webpack_require__(9);
	    var View = __webpack_require__(25);
	    var Stream = __webpack_require__(16);
	    var ReduceStream = __webpack_require__(58);
	    var Accumulator = __webpack_require__(56);
	    var Differential = __webpack_require__(55);

	    var CONSTANTS = {
	        DIRECTION : {
	            X : 0,
	            Y : 1
	        }
	    };

	    // Default map to convert displacement to transform
	    function DEFAULT_LENGTH_MAP(length){
	        return (this.options.direction === CONSTANTS.DIRECTION.X)
	            ? Transform.translateX(length)
	            : Transform.translateY(length);
	    }

	    /**
	     * A layout which arranges items vertically or horizontally within a containing size.
	     *  Items with a definite size in the specified direction keep their size, where
	     *  items with an `undefined` size in the specified direction have a flexible size.
	     *  Flexible sized items split up the left over size relative to their flex value.
	     *
	     * @class FlexLayout
	     * @constructor
	     * @namespace Layouts
	     * @extends Core.View
	     * @param [options] {Object}                        Options
	     * @param [options.direction]{Number}               Direction to lay out items
	     * @param [options.spacing]{Number}                 Spacing between items
	     */
	    var FlexLayout = View.extend({
	        defaults : {
	            direction : CONSTANTS.DIRECTION.X,
	            spacing : 0
	        },
	        initialize : function initialize(options){
	            // Store nodes and flex values
	            this.nodes = [];
	            this.flexs = [];

	            // Displacement for each item
	            this.lengthStream = new ReduceStream(function(prev, size){
	                if (!size) return false;
	                return prev + size[options.direction] + options.spacing;
	            });

	            // Amount of length used by fixed sized items
	            this.usedLength = new ReduceStream(function(prev, size){
	                if (!size) return false;
	                return prev + size[options.direction];
	            });

	            // Amount of length left over for flex items
	            this.availableLength = Stream.lift(function(totalSize, usedLength){
	                if (!totalSize) return false;
	                return totalSize[options.direction] - usedLength;
	            }, [this.size, this.usedLength.headOutput]);

	            // Total amount of flex
	            this.totalFlex = new Accumulator(0);

	            // Map to convert displacement to transform
	            this.setLengthMap(DEFAULT_LENGTH_MAP);
	        },
	        /*
	         * Set a custom map from length displacements to transforms.
	         * `this` will automatically be bound to the instance.
	         *
	         * @method setLengthMap
	         * @param map {Function} Map `(length) -> transform`
	         */
	        setLengthMap : function(map){
	            this.transformMap = map.bind(this);
	        },
	        /*
	         * Add a renderable to the end of the layout
	         *
	         * @method push
	         * @param item {Surface|View}           Renderable
	         * @param flex {Number|Transitionable}  Flex amount
	         */
	        push : function(item, flex){
	            this.nodes.push(item);
	            this.flexs.push(flex);

	            if (flex === undefined) this.usedLength.push(item.size);
	            var length = this.lengthStream.push(item.size);
	            var node = createNodeFromLength.call(this, length, flex);
	            this.add(node).add(item);
	        },
	        /*
	         * Unlink the last renderable in the layout
	         *
	         * @method pop
	         * @return item
	         */
	        pop : function(){
	            return this.unlink(this.nodes.length - 1);
	        },
	        /*
	         * Add a renderable to the beginning of the layout
	         *
	         * @method unshift
	         * @param item {Surface|View}           Renderable
	         * @param flex {Number|Transitionable}  Flex amount
	         */
	        unshift : function(item, flex){
	            this.nodes.unshift(item);
	            this.flexs.unshift(flex);

	            if (flex === undefined) this.usedLength.push(item.size);
	            var length = this.lengthStream.unshift(item.size);
	            var node = createNodeFromLength.call(this, length, flex);
	            this.add(node).add(item);
	        },
	        /*
	         * Unlink the first renderable in the layout
	         *
	         * @method shift
	         * @return item
	         */
	        shift : function(){
	            return this.unlink(0);
	        },
	        /*
	         * Add a renderable after a specified renderable
	         *
	         * @method insertAfter
	         * @param prevItem {Number|Surface|View}    Index or renderable to insert after
	         * @param item {Surface|View}               Renderable to insert
	         * @param flex {Number|Transitionable}      Flex amount
	         */
	        insertAfter : function(prevItem, item, flex){
	            var index;
	            if (typeof prevItem === 'number'){
	                index = prevItem + 1;
	                prevItem = this.nodes[prevItem];
	            }
	            else index = this.nodes.indexOf(prevItem) + 1;

	            this.nodes.splice(index, 0, item);
	            this.flexs.splice(index, 0, flex);

	            if (flex === undefined) this.usedLength.push(item.size);
	            var length = this.lengthStream.insertAfter(prevItem.size, item.size);
	            var node = createNodeFromLength.call(this, length, flex);
	            this.add(node).add(item);
	        },
	        /*
	         * Add a renderable before a specified renderable
	         *
	         * @method insertAfter
	         * @param prevItem {Number|Surface|View}    Index or renderable to insert before
	         * @param item {Surface|View}               Renderable to insert
	         * @param flex {Number|Transitionable}      Flex amount
	         */
	        insertBefore : function(postItem, item, flex){
	            var index;
	            if (typeof postItem === 'number'){
	                index = postItem - 1;
	                postItem = this.nodes[postItem];
	            }
	            else index = this.nodes.indexOf(postItem) - 1;

	            this.nodes.splice(index + 1, 0, item);
	            this.flexs.splice(index + 1, 0, flex);

	            if (flex === undefined) this.usedLength.push(item.size);
	            var length = this.lengthStream.insertBefore(postItem.size, item.size);
	            var node = createNodeFromLength.call(this, length, flex);
	            this.add(node).add(item);
	        },
	        /*
	         * Unlink the renderable.
	         *  To remove the renderable, call the `.remove` method on it after unlinking.
	         *
	         * @method unlink
	         * @param item {Number|Surface|View}        Index or item to remove
	         * @return item
	         */
	        unlink : function(item){
	            var index = (typeof item === 'number')
	                ? item
	                : this.nodes.indexOf(item);

	            item = this.nodes.splice(index, 1)[0];
	            var flex = this.flexs.splice(index, 1)[0];

	            if (flex === undefined) this.usedLength.remove(item.size);
	            else {
	                if (typeof flex === 'number')
	                    this.totalFlex.set(this.totalFlex.get() - flex);
	                else
	                    this.totalFlex.set(this.totalFlex.get() - flex.get());
	            }
	            this.lengthStream.remove(item.size);

	            return item;
	        },
	        length : function(){
	            return this.nodes.length;
	        },
	        /*
	         * Returns flex for an item or index
	         *
	         * @method getFlexFor
	         * @param item {Index|Surface|View} Index or item to get flex for
	         * @return flex {Number|Transitionable}
	         */
	        getFlexFor : function(item){
	            if (item === undefined) return this.getFlexes();
	            return (typeof item === 'number')
	                ? this.flexs[item]
	                : this.flexs[this.nodes.indexOf(item)];
	        },
	        /*
	         * Returns flexes of all current renderables
	         *
	         * @method getFlexes
	         * @return flexes {Array}
	         */
	        getFlexes : function(){
	            return this.flexs;
	        }
	    }, CONSTANTS);

	    function createNodeFromLength(length, flex){
	        var transform = length.map(this.transformMap);

	        if (flex !== undefined){
	            var size;
	            if (typeof flex === 'number'){
	                this.totalFlex.set(this.totalFlex.get() + flex);
	                // Flexible sized item: layout defines the size and transform
	                size = Stream.lift(function(availableLength, totalFlex){
	                    if (!availableLength) return false;
	                    var itemLength = (availableLength - (this.nodes.length - 1) * this.options.spacing) * (flex / totalFlex);
	                    return (this.options.direction === CONSTANTS.DIRECTION.X)
	                        ? [itemLength, undefined]
	                        : [undefined, itemLength];
	                }.bind(this), [this.availableLength, this.totalFlex]);
	            }
	            else {
	                this.totalFlex.set(this.totalFlex.get() + flex.get());

	                var flexDelta = new Differential();
	                flexDelta.subscribe(flex);
	                this.totalFlex.subscribe(flexDelta);

	                size = Stream.lift(function(availableLength, flex, totalFlex){
	                    if (!availableLength) return false;
	                    var itemLength = (availableLength - (this.nodes.length - 1) * this.options.spacing) * (flex / totalFlex);
	                    return (this.options.direction === CONSTANTS.DIRECTION.X)
	                        ? [itemLength, undefined]
	                        : [undefined, itemLength];
	                }.bind(this), [this.availableLength, flex, this.totalFlex]);
	            }

	            return {transform : transform, size : size};
	        }
	        else {
	            // Fixed size item: layout only defines the transform
	            return {transform : transform};
	        }
	    }

	    module.exports = FlexLayout;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Stream = __webpack_require__(16);
	    var SimpleStream = __webpack_require__(12);
	    var Observable = __webpack_require__(31);

	    function ReduceStream(reducer, value, options) {
	        this.reducer = reducer;
	        this.options = options || {offset : 0};

	        this.prev = null;
	        this.next = null;

	        this.head = this;
	        this.headOutput = new SimpleStream();

	        if (value) {
	            this.value = value;
	            this.input = new SimpleStream();
	            this.output = (options.sources)
	                ? Stream.lift(this.reducer, [this.input, this.value].concat(options.sources))
	                : Stream.lift(this.reducer, [this.input, this.value]);
	        }
	        else {
	            this.value = null;

	            if (typeof this.options.offset === 'number'){
	                this.output = new Observable(this.options.offset);
	            }
	            else {
	                this.output = new SimpleStream();
	                this.output.subscribe(this.options.offset);
	            }
	        }

	        setHeadOutput.call(this, this.head.output);
	    }

	    ReduceStream.prototype = Object.create(Stream.prototype);
	    ReduceStream.prototype.constructor = ReduceStream;

	    ReduceStream.prototype.push = function(stream) {
	        // refire the initial value if adding to an empty list
	        if (this.head === this && this.output.set)
	            this.output.set(this.options.offset || 0);

	        var sizeArray = new ReduceStream(this.reducer, stream, this.options);
	        connect(this.head, sizeArray);

	        this.head = sizeArray;
	        setHeadOutput.call(this, this.head.output);

	        return sizeArray.input;
	    };

	    ReduceStream.prototype.pop = function() {
	        var prev = this.head.prev;

	        sever(prev, this.head);
	        this.head = prev;

	        setHeadOutput.call(this, this.head.output);
	    };

	    ReduceStream.prototype.unshift = function(value) {
	        var curr = this;
	        var next = curr.next;

	        if (!next) return this.push(value);

	        var newNode = new ReduceStream(this.reducer, value, this.options);

	        sever(curr, next);
	        connect(curr, newNode);
	        connect(newNode, next);

	        if (this.output.set) this.output.set(this.options.offset || 0);
	        
	        return newNode.input;
	    };

	    ReduceStream.prototype.shift = function(){
	        this.remove(this.next.value);
	    };

	    ReduceStream.prototype.insertAfter = function(target, value) {
	        var curr = getNode.call(this, target);
	        if (!curr) return;

	        var next = curr.next;

	        if (next) {
	            var newNode = new ReduceStream(this.reducer, value, this.options);

	            sever(curr, next);
	            connect(newNode, next);
	            connect(curr, newNode);

	            return newNode.input;
	        }
	        else return this.push(value);
	    };

	    ReduceStream.prototype.insertBefore = function(target, value){
	        var curr = getNode.call(this, target);
	        if (!curr) return;

	        var prev = curr.prev;

	        if (prev !== this){
	            var newNode = new ReduceStream(this.reducer, value, this.options);
	            sever(prev, curr);
	            connect(newNode, curr);
	            connect(prev, newNode);
	            return newNode.input;
	        }
	        else return this.unshift(value);
	    };

	    ReduceStream.prototype.remove = function(value){
	        var curr = getNode.call(this, value);
	        if (!curr) return;

	        var prev = curr.prev;
	        var next = curr.next;

	        if (next){
	            sever(curr, next);
	            sever(prev, curr);
	            connect(prev, next);

	            if (this.output.set) this.output.set(this.options.offset || 0);
	        }
	        else this.pop();
	    };

	    function getNode(value){
	        var node = this;
	        while (node && node.value !== value)
	            node = node.next;

	        return node;
	    }

	    function sever(node1, node2){
	        node1.next = null;
	        node2.prev = null;
	        node2.input.unsubscribe(node1.output)
	    }

	    function connect(node1, node2){
	        node1.next = node2;
	        node2.prev = node1;
	        node2.input.subscribe(node1.output);
	    }

	    function setHeadOutput(output){
	        this.headOutput.unsubscribe();
	        this.headOutput.subscribe(output);
	    }

	    module.exports = ReduceStream;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module){
	    var View = __webpack_require__(25);
	    var FlexLayout = __webpack_require__(57);

	    /**
	     * A layout that arranges items in a grid and can rearrange the grid responsively.
	     *
	     *  The user provides the number of items per row in an array or a dictionary
	     *  with keys that are pixel values. The items will be sized to fill the available space.
	     *
	     *  @class GridLayout
	     *  @constructor
	     *  @extends Core.View
	     *  @param [options] {Object}                           Options
	     *  @param [options.spacing=0] {Array}                  Gap space between successive rows and columns
	     */
	    var GridLayout = View.extend({
	        defaults : {
	            spacing : [0, 0]
	        },
	        initialize : function initialize(options){
	            this.rows = [];
	            this.col = new FlexLayout({
	                direction: FlexLayout.DIRECTION.Y,
	                spacing: options.spacing[1]
	            });

	            this.add(this.col);
	        },
	        push : function(item, flex, row){
	            if (row > this.rows.length) return;

	            if (row === -1){
	                this.unshift(item, flex, row);
	                return;
	            }

	            if (row === undefined) row = this.rows.length;

	            var flexRow;
	            if (row === this.rows.length){
	                // append a new row
	                flexRow = new FlexLayout({
	                    direction: FlexLayout.DIRECTION.X,
	                    spacing: this.options.spacing[0]
	                });

	                this.rows.push(flexRow);
	                this.col.push(flexRow, 1);
	            }
	            else flexRow = this.rows[row];

	            flexRow.push(item, flex);
	        },
	        pop : function(row){
	            if (row === undefined) row = this.rows.length - 1;

	            var flexRow = this.rows[row];

	            var item = flexRow.pop();

	            if (flexRow.length() === 0)
	                removeRow.call(this, row);

	            return item;
	        },
	        unshift : function(item, flex, row){
	            if (row < -1) return;

	            if (row === this.rows.length){
	                this.push(item, flex, row);
	                return;
	            }

	            if (row === undefined) row = -1;

	            var flexRow;
	            if (row === -1){
	                // prepend a new row
	                flexRow = new FlexLayout({
	                    direction : FlexLayout.DIRECTION.X,
	                    spacing : this.options.spacing[0]
	                });

	                this.rows.unshift(flexRow);
	                this.col.unshift(flexRow, 1);
	            }
	            else flexRow = this.rows[row];

	            flexRow.unshift(item, flex);
	        },
	        shift : function(row){
	            if (row === undefined) row = 0;
	            var flexRow = this.rows[row];

	            var item = flexRow.shift();

	            if (this.rows[row].length() === 0)
	                removeRow.call(this, row);

	            return item;
	        },
	        insertAfter : function(row, col, item, flex){
	            var flexRow = this.rows[row];
	            flexRow.insertAfter(col, item, flex);
	        },
	        insertBefore : function(row, col, item, flex){
	            var flexRow = this.rows[row];
	            flexRow.insertBefore(col, item, flex);
	        },
	        unlink : function(row, col){
	            var flexRow = this.rows[row];
	            flexRow.unlink(col);
	        },
	        advance : function(row){
	            var nextRow = row + 1;

	            var numRows = this.rows.length;

	            var surface = this.pop(row);
	            surface.remove();

	            nextRow -= (numRows - this.rows.length);

	            var flex = 1;
	            this.unshift(surface, flex, nextRow);
	        },
	        retreat : function(row){
	            var prevRow = row - 1;

	            var surface = this.shift(row);
	            surface.remove();

	            var flex = 1;
	            this.push(surface, flex, prevRow);
	        },
	        resize : function(colsPerRow){
	            for (var row = 0; row < colsPerRow.length; row++){
	                var nCols = colsPerRow[row];
	                var count = this.rows[row].nodes.length;

	                while (count > nCols) {
	                    this.advance(row);
	                    count--;
	                }

	                while (count < nCols) {
	                    this.retreat(row + 1);
	                    count++;
	                }
	            }
	        }
	    });

	    function removeRow(rowIndex){
	        var emptyRow = this.col.unlink(this.rows[rowIndex]);
	        emptyRow.remove();
	        this.rows.splice(rowIndex, 1);
	    }

	    module.exports = GridLayout;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Transform = __webpack_require__(9);
	    var View = __webpack_require__(25);
	    var ReduceStream = __webpack_require__(58);
	    var Stream = __webpack_require__(16);

	    var CONSTANTS = {
	        DIRECTION : {
	            X : 0, 
	            Y : 1
	        }
	    };

	    // Default map to convert displacement to transform
	    function DEFAULT_LENGTH_MAP(length){
	        return (this.options.direction === CONSTANTS.DIRECTION.X)
	            ? Transform.translateX(length)
	            : Transform.translateY(length);
	    }

	    /**
	     * A layout which arranges items in series based on their size.
	     *  Items can be arranged vertically or horizontally.
	     *
	     * @class SequentialLayout
	     * @constructor
	     * @namespace Layouts
	     * @extends Core.View
	     * @param [options] {Object}                        Options
	     * @param [options.direction]{Number}               Direction to lay out items
	     * @param [options.spacing] {Transitionable|Number} Gutter spacing between items
	     */
	    var SequentialLayout = View.extend({
	        defaults : {
	            direction : CONSTANTS.DIRECTION.X,
	            spacing : 0,
	            offset : 0
	        }, 
	        initialize : function initialize(options) {
	            // Store nodes and flex values
	            this.nodes = [];

	            this.stream = new ReduceStream(function(prev, size, spacing){
	                if (!size) return false;
	                return prev + size[options.direction] + spacing;
	            }, undefined, {sources : [options.spacing], offset : options.offset});

	            this.setLengthMap(DEFAULT_LENGTH_MAP);

	            var length = Stream.lift(function(length, spacing){
	                return Math.max(length - spacing, 0);
	            }, [this.stream.headOutput, options.spacing]);

	            this.output.subscribe(length);

	            // SequentialLayout derives its size from its content
	            var size = [];
	            this.size = Stream.lift(function(parentSize, length){
	                if (!parentSize || length === undefined) return;
	                size[options.direction] = length;
	                size[1 - options.direction] = parentSize[1 - options.direction];
	                return size;
	            }, [this._size, length]);
	        },
	        /*
	        * Set a custom map from length displacements to transforms.
	        * `this` will automatically be bound to the instance.
	        *
	        * @method setLengthMap
	        * @param map [Function] Map `(length) -> transform`
	        */
	        setLengthMap : function(map, sources){
	            this.transformMap = map.bind(this);
	            if (sources) this.setSources(sources);
	        },
	        setSources : function(sources){
	            this.sources = sources;
	        },
	        /*
	         * Add a renderable to the end of the layout
	         *
	         * @method push
	         * @param map [Function] Map `(length) -> transform`
	         */
	        push : function(item) {
	            this.nodes.push(item);
	            var length = this.stream.push(item.size);

	            var transform = (this.sources)
	                ? Stream.lift(this.transformMap, [length].concat(this.sources))
	                : length.map(this.transformMap);

	            this.add({transform : transform}).add(item);
	        },
	        /*
	         * Unlink the last renderable in the layout
	         *
	         * @method pop
	         * @return item
	         */
	        pop : function(){
	            return this.unlink(this.nodes.length - 1);
	        },
	        /*
	         * Add a renderable to the beginning of the layout
	         *
	         * @method unshift
	         * @param item {Surface|View} Renderable
	         */
	        unshift : function(item){
	            this.nodes.unshift(item);
	            var length = this.stream.unshift(item.size);
	            var transform = length.map(this.transformMap);
	            this.add({transform : transform}).add(item);
	        },
	        /*
	         * Unlink the first renderable in the layout
	         *
	         * @method shift
	         * @return item
	         */
	        shift : function(){
	            return this.unlink(0);
	        },
	        /*
	         * Add a renderable after a specified renderable
	         *
	         * @method insertAfter
	         * @param prevItem {NumberSurface|View} Index or renderable to insert after
	         * @param item {Surface|View}           Renderable to insert
	         */
	        insertAfter : function(prevItem, item) {
	            var index;
	            if (typeof prevItem === 'number'){
	                index = prevItem + 1;
	                prevItem = this.nodes[prevItem];
	            }
	            else index = this.nodes.indexOf(prevItem) + 1;

	            this.nodes.splice(index, 0, item);

	            if (!prevItem) return this.push(item);
	            var length = this.stream.insertAfter(prevItem.size, item.size);
	            var transform = length.map(this.transformMap);
	            this.add({transform : transform}).add(item);
	        },
	        /*
	         * Add a renderable before a specified renderable
	         *
	         * @method insertAfter
	         * @param prevItem {Number|Surface|View} Index or renderable to insert before
	         * @param item {Surface|View}            Renderable to insert
	         */
	        insertBefore : function(postItem, item){
	            var index;
	            if (typeof postItem === 'number'){
	                index = postItem - 1;
	                postItem = this.nodes[postItem];
	            }
	            else index = this.nodes.indexOf(postItem) - 1;

	            this.nodes.splice(index + 1, 0, item);
	            
	            if (!postItem) return this.unshift(item);
	            var length = this.stream.insertBefore(postItem.size, item.size);
	            var transform = length.map(this.transformMap);
	            this.add({transform : transform}).add(item);
	        },
	        /*
	         * Unlink the renderable.
	         *  To remove the renderable, call the `.remove` method on it after unlinking.
	         *
	         * @method unlink
	         * @param item {Surface|View} Item to remove
	         * @return item
	         */
	        unlink : function(item){
	            var index;
	            if (typeof item === 'number'){
	                index = item;
	                item = this.nodes[item];
	            }
	            else index = this.nodes.indexOf(item);

	            if (!item || !item.size) return;
	            this.nodes.splice(index, 1);
	            this.stream.remove(item.size);

	            return item;
	        }
	    }, CONSTANTS);

	    module.exports = SequentialLayout;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module){
	    var Transform = __webpack_require__(9);
	    var View = __webpack_require__(25);
	    var Stream = __webpack_require__(16);

	    /**
	     *
	     * A 3-part layout that arranges content in a header section, content section and footer section.
	     *  The header and footer sections are each optional (though one of the two must be specified).
	     *  If the header's or footer's size changes, the content will size appropriately to fit.
	     * 
	     * @class HeaderFooterLayout
	     * @constructor
	     * @namespace Layouts
	     * @extends Core.View
	     * @param [options] {Object}                Options
	     * @param options.header {Surface|View}     Surface or View acting as a header
	     * @param options.footer {Surface|View}     Surface or View acting as a footer
	     * @param [options.content] {Surface|View}  Surface or View acting as content
	     */
	    var HeaderFooterLayout = View.extend({
	        defaults : {
	            header : null,
	            content : null,
	            footer : null
	        },
	        initialize : function initialize(options){
	            this.contentNode = null;
	            var size, transform;

	            if (options.header) {
	                transform = options.header.size.map(function(size){
	                    if (!size) return false;
	                    return Transform.translateY(size[1]);
	                });

	                size = (options.footer)
	                    ? Stream.lift(function(headerSize, footerSize, parentSize){
	                        if (!headerSize || !footerSize) return false;
	                        return [parentSize[0], parentSize[1] - headerSize[1] - footerSize[1]];
	                    }, [options.header.size, options.footer.size, this.size])
	                    : Stream.lift(function(headerSize, parentSize){
	                        if (!headerSize || !parentSize) return false;
	                        return [parentSize[0], parentSize[1] - headerSize[1]];
	                    }, [options.header.size, this.size]);

	                this.add(options.header);
	                this.contentNode = this.add({transform : transform, size : size});
	            }
	            else if (options.footer){
	                size = Stream.lift(function(footerSize, parentSize){
	                    if (!footerSize) return false;
	                    return [parentSize[0], parentSize[1] - footerSize[1]];
	                }, [options.footer.size, this.size]);

	                this.contentNode = this.add({size : size});
	            }

	            if (options.footer){
	                transform = options.footer.size.map(function(size){
	                    return Transform.translateY(-size[1]);
	                });

	                this.add({align : [0, 1], transform : transform}).add(options.footer);
	            }

	            if (options.content) this.addContent(options.content);
	        },
	        /*
	         * Set the content. Can be used to reset the content as well.
	         *
	         * @method addContent
	         * @param content {Surface|View} Either a surface or view to act as content
	         */
	        addContent : function(content){
	            this.options.content = content;
	            this.contentNode.add(content);
	        }
	    });

	    module.exports = HeaderFooterLayout;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	// This code is still in beta. Documentation forthcoming.

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    var Transform = __webpack_require__(9);
	    var Transitionable = __webpack_require__(11);
	    var View = __webpack_require__(25);
	    var Stream = __webpack_require__(16);
	    var Accumulator = __webpack_require__(56);
	    var Differential = __webpack_require__(55);

	    var SequentialLayout = __webpack_require__(60);
	    var ContainerSurface = __webpack_require__(38);

	    var GenericInput = __webpack_require__(44);
	    var ScrollInput = __webpack_require__(48);
	    var TouchInput = __webpack_require__(46);
	    var MouseInput = __webpack_require__(45);

	    GenericInput.register({
	        touch: TouchInput,
	        scroll: ScrollInput,
	        mouse: MouseInput
	    });

	    var CONSTANTS = {
	        DIRECTION: {
	            X: 0,
	            Y: 1
	        }
	    };

	    var EDGE = {
	        TOP: -1,
	        BOTTOM : 1,
	        NONE: 0
	    };

	    var Scrollview = View.extend({
	        defaults: {
	            direction: CONSTANTS.DIRECTION.Y,
	            drag: 0.3,
	            paginated: false,
	            pageChangeSpeed: 0.5,
	            startPosition: 0,
	            marginTop: 0,
	            marginBottom: 0,
	            clip: true,
	            enableMouseDrag: false,
	            pageTransition: {
	                curve : 'spring',
	                period : 100,
	                damping : 0.8
	            },
	            edgeTransition: {
	                curve: 'spring',
	                period: 100,
	                damping: 1
	            },
	            edgeGrip: 0.5
	        },
	        initialize: function (options) {
	            this._currentIndex = 0;
	            this._previousIndex = 0;
	            this.itemOffset = 0;
	            this.items = [];
	            this.velocity = 0;
	            this.overflow = 0;

	            var isTouching = false;
	            var isMouseWheelActive = false;
	            var edge = EDGE.NONE;

	            this.layout = new SequentialLayout({
	                direction: options.direction
	            });

	            var inputs = options.enableMouseDrag
	                ? ['touch', 'scroll', 'mouse']
	                : ['touch', 'scroll'];

	            var genericInput = new GenericInput(inputs, {
	                direction: options.direction
	            });

	            var position = new Accumulator(-options.startPosition);

	            this.drag = new Transitionable(0);
	            this.spring = new Transitionable(0);

	            var dragDifferential = new Differential();
	            var springDifferential = new Differential();
	            var gestureDifferential = genericInput.pluck('delta');

	            dragDifferential.subscribe(this.drag);
	            springDifferential.subscribe(this.spring);

	            position.subscribe(gestureDifferential);
	            position.subscribe(dragDifferential);
	            position.subscribe(springDifferential);

	            var scrollInput = genericInput.getInput('scroll');
	            scrollInput.on('start', function(){
	                isMouseWheelActive = true;
	            });

	            scrollInput.on('end', function(){
	                isMouseWheelActive = false;
	            });

	            genericInput.on('start', function () {
	                isTouching = true;
	                this.drag.halt();
	                this.spring.halt();
	            }.bind(this));

	            genericInput.on('update', function (data) {
	                this.velocity = data.velocity;
	            }.bind(this));

	            genericInput.on('end', function (data) {
	                isTouching = false;

	                switch (edge){
	                    case EDGE.NONE:
	                        (this.options.paginated)
	                            ? handlePagination.call(this, data.velocity)
	                            : handleDrag.call(this, data.velocity);
	                        break;
	                    case EDGE.TOP:
	                        handleEdge.call(this, this.overflow, data.velocity);
	                        break;
	                    case EDGE.BOTTOM:
	                        handleEdge.call(this, this.overflow, data.velocity);
	                        break;
	                }
	            }.bind(this));

	            this.drag.on('update', function(){
	                this.velocity = this.drag.getVelocity();
	            }.bind(this));

	            this.spring.on('update', function(){
	                this.velocity = this.spring.getVelocity();
	            }.bind(this));

	            position.on('end', function () {
	                if (!this.spring.isActive())
	                    changePage.call(this, this._currentIndex);
	            }.bind(this));

	            // overflow is a measure of how much of the content
	            // extends past the viewport
	            var overflowStream = Stream.lift(function (contentLength, viewportSize) {
	                if (!contentLength) return false;
	                var overflow = viewportSize[options.direction] - options.marginBottom - contentLength;
	                return (overflow >= 0) ? false : overflow;
	            }, [this.layout, this.size]);

	            this.offset = Stream.lift(function (top, overflow) {
	                if (!overflow) return false;

	                if (this.spring.isActive()) return Math.round(top);

	                if (top > 0) { // reached top of scrollview
	                    if (isMouseWheelActive){
	                        edge = EDGE.TOP;
	                        position.set(0, true);
	                        changePage.call(this, this._currentIndex);
	                        return 0;
	                    }

	                    this.overflow = top;

	                    if (edge !== EDGE.TOP){
	                        genericInput.setOptions({scale: this.options.edgeGrip});

	                        edge = EDGE.TOP;
	                        if (!isTouching)
	                            handleEdge.call(this, this.overflow, this.velocity);
	                    }
	                }
	                else if(top < overflow) { // reached bottom of scrollview
	                    if (isMouseWheelActive) {
	                        edge = EDGE.BOTTOM;
	                        position.set(overflow, true);
	                        changePage.call(this, this._currentIndex);
	                        return overflow;
	                    }

	                    this.overflow = top - overflow;

	                    if (edge !== EDGE.BOTTOM){
	                        genericInput.setOptions({scale: .5});

	                        edge = EDGE.BOTTOM;

	                        if (!isTouching)
	                            handleEdge.call(this, this.overflow, this.velocity);
	                    }
	                }
	                else if(top > overflow && top < 0 && edge !== EDGE.NONE){
	                    this.overflow = 0;
	                    genericInput.setOptions({scale: 1});
	                    edge = EDGE.NONE;
	                }

	                return Math.round(top);
	            }.bind(this), [position, overflowStream]);

	            var transform = this.offset.map(function (position) {
	                position += options.marginTop;
	                return options.direction === CONSTANTS.DIRECTION.Y
	                    ? Transform.translateY(position)
	                    : Transform.translateX(position);
	            });

	            this.container = new ContainerSurface({
	                properties: {overflow : 'hidden'}
	            });

	            genericInput.subscribe(this.container);

	            this.container.add({transform : transform}).add(this.layout);
	            this.add(this.container);
	        },
	        setPerspective: function(){
	            ContainerSurface.prototype.setPerspective.apply(this.container, arguments);
	        },
	        getVelocity: function(){
	            return this.velocity;
	        },
	        goTo: function (index, transition, callback) {
	            transition = transition || this.options.pageTransition;
	            var position = this.itemOffset;
	            var i;

	            if (index > this._currentIndex && index < this.items.length) {
	                for (i = this._currentIndex; i < index; i++)
	                    position -= this.items[i].getSize()[this.options.direction];
	            }
	            else if (index < this._currentIndex && index >= 0) {
	                for (i = this._currentIndex; i > index; i--)
	                    position += this.items[i].getSize()[this.options.direction];
	            }

	            this.spring.halt();
	            this.spring.reset(0);
	            this.spring.set(Math.ceil(position), transition, callback);
	        },
	        getCurrentIndex: function(){
	            return this._currentIndex;
	        },
	        addItems: function (items) {
	            for (var i = 0; i < items.length; i++) 
	                this.layout.push(items[i]);
	            
	            this.items = items;

	            var args = [this.offset];
	            for (i = 0; i < items.length; i++) {
	                args.push(items[i].size);
	            }

	            var accumLength = 0;
	            var itemOffsetStream = Stream.lift(function () {
	                if (arguments[0] === undefined || arguments[1] === undefined)
	                    return false;

	                var offset = arguments[0];
	                var direction = this.options.direction;
	                var index = this._currentIndex;
	                var currentSize = arguments[index + 1];

	                if (!currentSize) return false;

	                var progress = 0;
	                var itemOffset = -offset - accumLength;
	                var currentLength = currentSize[direction];

	                if (itemOffset >= currentLength && this._currentIndex !== items.length - 1) {
	                    // pass currentNode forwards
	                    this._currentIndex++;
	                    progress = 0;
	                    accumLength += currentLength;
	                }
	                else if (itemOffset < 0 && this._currentIndex !== 0) {
	                    // pass currentNode backwards
	                    this._currentIndex--;
	                    progress = 1;
	                    currentLength = arguments[this._currentIndex + 1][direction];
	                    accumLength -= currentLength;
	                }
	                else {
	                    progress = itemOffset / currentLength;
	                }

	                this.itemOffset = itemOffset;

	                return {
	                    index: this._currentIndex,
	                    progress: progress
	                };
	            }.bind(this), args);

	            this.output.subscribe(itemOffsetStream);

	            itemOffsetStream.on('start', function () {});
	            itemOffsetStream.on('update', function () {});
	            itemOffsetStream.on('end', function () {});
	        }
	    }, CONSTANTS);

	    function changePage(index) {
	        if (index === this._previousIndex) return;
	        this.emit('page', index);
	        this._previousIndex = index;
	    }

	    function handleEdge(overflow, velocity){
	        this.drag.halt();
	        this.spring.reset(overflow);
	        this.options.edgeTransition.velocity = velocity;
	        this.spring.set(0, this.options.edgeTransition);
	    }

	    function handlePagination(velocity){
	        var pageChangeSpeed = this.options.pageChangeSpeed;
	        var currentLength = this.items[this._currentIndex].getSize()[this.options.direction];

	        var backLength = this.itemOffset;
	        var forwardLength = this.itemOffset - currentLength;

	        var position = this.itemOffset;
	        var positionThreshold = currentLength / 2;

	        var target;
	        if (velocity < 0){
	            // moving forward
	            target = (position > positionThreshold || velocity < -pageChangeSpeed)
	                ? forwardLength
	                : backLength;
	        }
	        else {
	            // moving backward
	            target = (position < positionThreshold || velocity > pageChangeSpeed)
	                ? backLength
	                : forwardLength;
	        }

	        this.options.pageTransition.velocity = velocity;
	        this.spring.halt();
	        this.spring.reset(-target);
	        this.spring.set(0, this.options.pageTransition);
	    }

	    function handleDrag(velocity){
	        this.drag.halt();
	        this.drag.reset(0);
	        this.drag.set(0, {
	            curve: 'inertia',
	            velocity: velocity,
	            drag: this.options.drag
	        });
	    }

	    module.exports = Scrollview;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    module.exports = {
	        Accumulator: __webpack_require__(56),
	        Differential: __webpack_require__(55),
	        SimpleStream: __webpack_require__(12),
	        Stream: __webpack_require__(16),
	        Observable: __webpack_require__(31)
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    module.exports = {
	        Camera: __webpack_require__(65),
	        TrackballCamera: __webpack_require__(68),
	        Quaternion: __webpack_require__(66),
	        QuatTransitionable: __webpack_require__(67)
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module){
	    var Quaternion = __webpack_require__(66);
	    var QuatTransitionable = __webpack_require__(67);
	    var Transform = __webpack_require__(9);
	    var Transitionable = __webpack_require__(11);
	    var LayoutNode = __webpack_require__(29);
	    var RenderTreeNode = __webpack_require__(28);
	    var OptionsManager = __webpack_require__(27);
	    var Stream = __webpack_require__(16);

	    /**
	     * A way to transition numeric values and arrays of numbers between start and end states.
	     *  Transitioning happens through one of many possible interpolations, such as easing
	     *  curves like 'easeIn', or physics curves like 'spring' and 'inertia'. The choice
	     *  of interpolation is specified when `.set` is called. If no interpolation is specified
	     *  then the value changes immediately. Non-numeric values in arrays, such as `undefined`
	     *  or `true`, are safely ignored.
	     *
	     *  Transitionables are streams, so they emit `start`, `update` and `end` events, with a payload
	     *  that is their current value. As streams, they can also be mapped, filtered, composed, etc.
	     *
	     * @class Camera
	     * @constructor
	     * @namespace Camera
	     * @param options {Object}                              Options
	     * @param [options.orientation=[1,0,0,0]] {Quaternion}  Initial orientation of camera
	     * @param [options.position=[0,0,0]] {Array}            Initial position of camera
	     */
	    function Camera(options){
	        this.options = OptionsManager.setOptions(this, options);

	        this.orientationState = Quaternion.create(options.orietation);
	        this.position = new Transitionable(options.position);
	        this.orientation = new QuatTransitionable(this.orientationState);

	        var transform = Stream.lift(function(position, orientation){
	            Quaternion.conjugate(orientation, this.orientationState);
	            var transform = Quaternion.toTransform(this.orientationState);
	            return Transform.thenMove(transform, position);
	        }.bind(this), [this.position, this.orientation]);

	        var layout = new LayoutNode({transform : transform});
	        this._node = new RenderTreeNode(layout);
	    }

	    Camera.DEFAULT_OPTIONS = {
	        position: [0, 0, 0],
	        orientation: Quaternion.create()
	    };

	    /**
	     * Set the position.
	     *
	     * @method setPosition
	     * @param position {Number[]}               End position
	     * @param [transition] {Object}             Transition definition
	     * @param [callback] {Function}             Callback
	     */
	    Camera.prototype.setPosition = function(position, transition, callback){
	        this.position.set(position, transition, callback);
	    }

	    /**
	     * Get the position.
	     *
	     * @method getPosition
	     * @return {Array}                          Position
	     */
	    Camera.prototype.getPosition = function(){
	        return this.position.get();
	    }

	    /**
	     * Set the orientation.
	     *
	     * @method setOrientation
	     * @param orientation {Array}               [angle, x-axis, y-axis, z-axis]
	     * @param [transition] {Object}             Transition definition
	     * @param [callback] {Function}             Callback
	     */
	    Camera.prototype.setOrientation = function(orientation, transition, callback){
	        Quaternion.fromAngleAxis(orientation, this.orientationState);
	        this.orientation.set(this.orientationState, transition, callback);
	    }

	    /**
	     * Get the orientation.
	     *
	     * @method getOrientation
	     * @return {Array}                          Orientation as [angle, x-axis, y-axis, z-axis]
	     */
	    Camera.prototype.getOrientation = function(){
	        return Quaternion.toAngleAxis(this.orientation.get());
	    }

	    /**
	     * Move the position of the camera in the z-direction by a given amount.
	     *
	     * @method zoomBy
	     * @param delta {Number}                    Relative amount to zoom by
	     * @param [transition] {Object}             Transition definition
	     * @param [callback] {Function}             Callback
	     */
	    Camera.prototype.zoomBy = function(delta, transition, callback){
	        var position = this.position.get();
	        var newPosition = [position[0], position[1], position[2] + delta];
	        this.position.set(newPosition, transition, callback);
	    }

	    /**
	     * Move the position of the camera in the z-direction to the given zoom.
	     *
	     * @method setZoom
	     * @param zoom {Number}                     Absolute amount to zoom
	     * @param [transition] {Object}             Transition definition
	     * @param [callback] {Function}             Callback
	     */
	    Camera.prototype.setZoom = function(zoom, transition, callback){
	        var position = this.getPosition();
	        var previousZoom = position[2];
	        var delta = zoom - previousZoom;
	        this.zoomBy(delta, transition, callback);
	    }

	    /**
	     * Rotate the orientation of the camera by a given rotation.
	     *
	     * @method rotateBy
	     * @param rotation {Array}                  Rotation as [angle, x-axis, y-axis, z-axis]
	     * @param [transition] {Object}             Transition definition
	     * @param [callback] {Function}             Callback
	     */
	    Camera.prototype.rotateBy = function(rotation, transition, callback){
	        var currentOrientation = this.orientation.get();
	        Quaternion.multiply(currentOrientation, rotation, this.orientationState);
	        this.orientation.set(this.orientationState, transition, callback);
	    }

	    /**
	     * Translate relative to current position of camera.
	     *
	     * @method translateBy
	     * @param delta {Array}                     Relative amount to translate by [x, y, z]
	     * @param [transition] {Object}             Transition definition
	     * @param [callback] {Function}             Callback
	     */
	    Camera.prototype.translateBy = function(delta, transition, callback){
	        var currentPosition = this.position.get();
	        var newPosition = [
	            currentPosition[0] + delta[0],
	            currentPosition[1] + delta[1],
	            currentPosition[2] + delta[2]
	        ];
	        this.position.set(newPosition, transition, callback);
	    }

	    /**
	     * Face the camera towards a Transform. The Transform is decomposed into
	     *  its position and rotation parts to calulate where to orient the camera.
	     *
	     * @method lookAt
	     * @param transform {Transform}             Transform to face camera toward
	     * @param [transition] {Object}             Transition definition
	     * @param [callback] {Function}             Callback
	     */
	    Camera.prototype.lookAt = function(transform, transition, callback){
	        var result = Transform.interpret(transform);
	        var rotation = result.rotate;

	        Quaternion.fromEulerAngles(rotation, this.orientationState);
	        Quaternion.conjugate(this.orientationState, this.orientationState);

	        this.orientation.set(this.orientationState, transition);
	    }

	    Camera.prototype._onAdd = function(parent){
	        return parent.add(this._node);
	    }

	    /**
	     * Extends the render tree subtree with a new node.
	     *
	     * @method add
	     * @param object {SizeNode|LayoutNode|Surface} Node
	     * @return {RenderTreeNode}
	     */
	    Camera.prototype.add = function(){
	        return RenderTreeNode.prototype.add.apply(this._node, arguments);
	    }

	    /**
	     * Remove the Camera from the RenderTree. All Surfaces added to the View
	     *  will also be removed. The Camera can be added back at a later time and
	     *  all of its data and Surfaces will be restored.
	     *
	     * @method remove
	     */
	    Camera.prototype.remove = function(){
	        return RenderTreeNode.prototype.remove.apply(this._node, arguments);
	    }

	    module.exports = Camera;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module){
	    var identity = [1, 0, 0, 0];

	    /**
	     * Quaternion is a singleton with helper methods for quaternionic math.
	     *  Quaternions are represented as 4-dimensional arrays [w, x, y, z].
	     *
	     * @class Quaternion
	     * @namespace Camera
	     * @static
	     * @private
	     */
	    var Quaternion = {};

	    /**
	     * Create a quaternion. Either provide a quaternion to clone, otherwise
	     *  the identity quaternion is returned.
	     *
	     * @method create
	     * @static
	     * @param [q] {Array}       Given quaternion
	     * @return {Quaternion}     Created quaternion
	     */
	    Quaternion.create = function create(q){
	        return (q || identity).slice();
	    }

	    /**
	     * Set a quaternion with coordinates from a given quaternion.
	     *
	     * @method set
	     * @static
	     * @param q {Array}         Given quaternion
	     * @param out {Quaternion}  The resulting quaternion
	     */
	    Quaternion.set = function(q, out){
	        out[0] = q[0];
	        out[1] = q[1];
	        out[2] = q[2];
	        out[3] = q[3];
	    }

	    /**
	     * Output a quaternion that represents a rotation of a given angle about a given axis.
	     *
	     * @method fromAngleAxis
	     * @static
	     * @param values {Array}    Values in the form of [angle, x, y, z]
	     *                          where [x, y, z] is the axis of rotation,
	     *                          and angle is the angle about this axis.
	     * @param out {Quaternion}  The resulting quaternion
	     */
	    Quaternion.fromAngleAxis = function fromAngleAxis(values, out) {
	        var angle = values[0];

	        var x = values[1];
	        var y = values[2];
	        var z = values[3];

	        var len = Math.hypot(x, y, z);

	        if (len === 0) {
	            out[0] = 1;
	            out[1] = out[2] = out[3] = 0;
	        }
	        else {
	            var halfAngle = 0.5 * angle;
	            var s = Math.sin(halfAngle) / len;
	            out[0] = Math.cos(halfAngle);
	            out[1] = s * x;
	            out[2] = s * y;
	            out[3] = s * z;
	        }
	    };

	    /**
	     * Output a quaternion from given Euler angles [x, y, z].
	     *
	     * @method fromEulerAngles
	     * @static
	     * @param angles {Array}    Euler angles [x, y, z]
	     * @param out {Quaternion}  The resulting quaternion
	     */
	    Quaternion.fromEulerAngles = function fromEulerAngles(angles, out) {
	        var hx = 0.5 * angles[0];
	        var hy = 0.5 * angles[1];
	        var hz = 0.5 * angles[2];

	        var sx = Math.sin(hx);
	        var sy = Math.sin(hy);
	        var sz = Math.sin(hz);
	        var cx = Math.cos(hx);
	        var cy = Math.cos(hy);
	        var cz = Math.cos(hz);

	        out[0] = cx * cy * cz - sx * sy * sz;
	        out[1] = sx * cy * cz + cx * sy * sz;
	        out[2] = cx * sy * cz - sx * cy * sz;
	        out[3] = cx * cy * sz + sx * sy * cz;
	    };

	    /**
	     * Sum two quaternions.
	     *
	     * @method sum
	     * @static
	     * @param q1 {Quaternion}
	     * @param q2 {Quaternion}
	     * @param out {Quaternion} The resulting quaternion
	     */
	    Quaternion.sum = function sum(q1, q2, out) {
	        out[0] = q1[0] + q2[0];
	        out[1] = q1[1] + q2[1];
	        out[2] = q1[2] + q2[2];
	        out[3] = q1[3] + q2[3];
	    };

	    /**
	     * Multiply two quaternions.
	     *
	     * @method multiply
	     * @static
	     * @param q1 {Quaternion}
	     * @param q2 {Quaternion}
	     * @param out {Quaternion} The resulting quaternion
	     */
	    Quaternion.multiply = function multiply(q1, q2, out) {
	        var w1 = q1[0];
	        var x1 = q1[1];
	        var y1 = q1[2];
	        var z1 = q1[3];

	        var w2 = q2[0];
	        var x2 = q2[1];
	        var y2 = q2[2];
	        var z2 = q2[3];

	        out[0] = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
	        out[1] = x1 * w2 + x2 * w1 + y2 * z1 - y1 * z2;
	        out[2] = y1 * w2 + y2 * w1 + x1 * z2 - x2 * z1;
	        out[3] = z1 * w2 + z2 * w1 + x2 * y1 - x1 * y2;
	    };

	    /**
	     * Scale a quaternion.
	     *
	     * @method scalarMultiply
	     * @static
	     * @param q1 {Quaternion}
	     * @param s {Number}
	     * @param out {Quaternion} The resulting quaternion
	     */
	    Quaternion.scalarMultiply = function scalarMultiply(q, s, out) {
	        out[0] = s * q[0];
	        out[1] = s * q[1];
	        out[2] = s * q[2];
	        out[3] = s * q[3];
	    };

	    /**
	     * Conjugate a quaternion.
	     *
	     * @method conjugate
	     * @static
	     * @param q {Quaternion}
	     * @param out {Quaternion} The resulting quaternion
	     */
	    Quaternion.conjugate = function conjugate(q, out) {
	        out[0] =  q[0];
	        out[1] = -q[1];
	        out[2] = -q[2];
	        out[3] = -q[3];
	    };

	    /**
	     * Negate a quaternion.
	     *
	     * @method negate
	     * @static
	     * @param q {Quaternion}
	     * @param out {Quaternion} The resulting quaternion
	     */
	    Quaternion.negate = function negate(q, out) {
	        out[0] = -q[0];
	        out[1] = -q[1];
	        out[2] = -q[2];
	        out[3] = -q[3];
	    };

	    /**
	     * Normalize a quaternion to be of unit length.
	     *
	     * @method normalize
	     * @static
	     * @param q {Quaternion}
	     * @param out {Quaternion} The resulting quaternion
	     */
	    Quaternion.normalize = function normalize(q, out) {
	        var len = Quaternion.length(q);
	        Quaternion.scalarMultiply(q, 1 / len, out);
	    };

	    /**
	     * Spherical linear interpolation between quaternions with a given weight.
	     *
	     * @method slerp
	     * @static
	     * @param start {Quaternion}    Starting quaternion
	     * @param end {Quaternion}      Ending quaternion
	     * @param t {Number}            Weight of interpolation
	     * @param out {Quaternion}      The resulting quaternion
	     */
	    Quaternion.slerp = function slerp(start, end, t, out) {
	        if (t === 0)
	            Quaternion.set(start, out);
	        else if (t === 1)
	            Quaternion.set(end, out);
	        else {
	            var scaleFrom, scaleTo;
	            var cosTheta = Quaternion.dot(start, end);

	            if (cosTheta < 1) {
	                var theta = Math.acos(cosTheta);
	                var sinTheta = Math.sin(theta);
	                scaleFrom = Math.sin((1 - t) * theta) / sinTheta;
	                scaleTo = Math.sin(t * theta) / sinTheta;
	            }
	            else {
	                scaleFrom = 1 - t;
	                scaleTo = t;
	            }

	            var result1 = [];
	            var result2 = [];
	            Quaternion.scalarMultiply(start, scaleFrom, result1)
	            Quaternion.scalarMultiply(end, scaleTo, result2),
	            Quaternion.sum(result1, result2, out);
	        }
	    };

	    /**
	     * Get the length of a quaternion.
	     *
	     * @method length
	     * @static
	     * @param q {Quaternion}
	     * @return length {Quaternion}
	     */
	    Quaternion.length = function length(q) {
	        return Math.hypot.apply(null, q);
	    };

	    /**
	     * Dot product of two quaternions.
	     *
	     * @method dot
	     * @static
	     * @param q1 {Quaternion}
	     * @param q2 {Quaternion}
	     * @return {Number}
	     */
	    Quaternion.dot = function dot(q1, q2) {
	        return q1[0] * q2[0] + q1[1] * q2[1] + q1[2] * q2[2] + q1[3] * q2[3];
	    };

	    /**
	     * Calculate the corresponding matrix transform from a quaternion.
	     *
	     * @method toTransform
	     * @static
	     * @param q {Quaternion}
	     * @return {Transform}
	     */
	    Quaternion.toTransform = function toTransform(q) {
	        var w = q[0];
	        var x = q[1];
	        var y = q[2];
	        var z = q[3];

	        var xx = x * x;
	        var yy = y * y;
	        var zz = z * z;
	        var xy = x * y;
	        var xz = x * z;
	        var yz = y * z;
	        var wx = w * x;
	        var wy = w * y;
	        var wz = w * z;

	        return [
	            1 - 2 * (yy + zz),
	            2 * (xy - wz),
	            2 * (xz + wy),
	            0,
	            2 * (xy + wz),
	            1 - 2 * (xx + zz),
	            2 * (yz - wx),
	            0,
	            2 * (xz - wy),
	            2 * (yz + wx),
	            1 - 2 * (xx + yy),
	            0,
	            0, 0, 0, 1
	        ];
	    };

	    /**
	     * Calculate the corresponding euler angles from a quaternion.
	     *
	     * @method toEulerAngles
	     * @static
	     * @param q {Quaternion}
	     * @return {Array}
	     */
	    Quaternion.toEulerAngles = function toEulerAngles(q) {
	        var w = q[0];
	        var x = q[1];
	        var y = q[2];
	        var z = q[3];

	        var xx = x * x;
	        var yy = y * y;
	        var zz = z * z;

	        var ty = 2 * (x * z + y * w);
	        ty = ty < -1 ? -1 : ty > 1 ? 1 : ty;

	        return [
	            Math.atan2(2 * (x * w - y * z), 1 - 2 * (xx + yy)),
	            Math.asin(ty),
	            Math.atan2(2 * (z * w - x * y), 1 - 2 * (yy + zz))
	        ];
	    };

	    /**
	     * Calculate the corresponding angle/axis representation of a quaternion.
	     *
	     * @method toAngleAxis
	     * @static
	     * @param q {Quaternion}
	     * @return {Array}
	     */
	    Quaternion.toAngleAxis = function toAngleAxis(q){
	        var len = Quaternion.length(q);
	        var halfAngle = Math.acos(q[0]);

	        if (halfAngle === 0) {
	            return [0, 1, 0, 0];
	        }

	        var s = len / Math.sin(halfAngle);

	        var angle = 2 * halfAngle;
	        var x = s * q[1];
	        var y = s * q[2];
	        var z = s * q[3];

	        return [angle, x, y, z];
	    }

	     /**
	     * Get the angle associated with the quaternion rotation.
	     *
	     * @method getAngle
	     * @static
	     * @param q {Quaternion}    Quaternion
	     * @return {Number}         Angle
	     */
	    Quaternion.getAngle = function getAngle(q){
	        return 2 * Math.acos(q[0]);
	    }

	     /**
	     * Get the axis associated with the quaternion rotation.
	     *
	     * @method getAxis
	     * @static
	     * @param q {Quaternion}    Quaternion
	     * @return {Array}          Axis
	     */
	    Quaternion.getAxis = function getAngle(q){
	        var len = Quaternion.length(q);
	        var halfAngle = Math.acos(q[0]);

	        if (halfAngle === 0) {
	            return [1, 0, 0];
	        }

	        var s = len / Math.sin(halfAngle);

	        var x = s * q[1];
	        var y = s * q[2];
	        var z = s * q[3];

	        return [x, y, z];
	    }

	     /**
	     * Set the angle of a quaternion, keeping its axis constant.
	     *
	     * @method setAngle
	     * @static
	     * @param q {Quaternion}    Quaternion
	     * @param angle {Number}    New angle
	     * @param out {Quaternion}  The resulting quaternion
	     */
	    Quaternion.setAngle = function getAngle(q, angle, out){
	        var axis = Quaternion.getAxis(q);
	        axis.unshift(angle);
	        Quaternion.fromAngleAxis(axis, out);
	    }

	     /**
	     * Rotate a vector (3-dimensional array) by a quaternion.
	     *  v' = ~q * v * q.
	     *
	     * @method rotateVector
	     * @static
	     * @param q {Quaternion}    Quaternion representing rotation
	     * @param v {Array}         Vector. 3-dimensional array [x, y, z]
	     * @return {Array}          Rotated vector
	     */
	    Quaternion.rotateVector = function rotateVector(q, v) {
	        var result = [];
	        var w = [0, v[0], v[1], v[2]];

	        Quaternion.conjugate(q, result);
	        Quaternion.multiply(result, w, result);
	        Quaternion.multiply(result, q, result);

	        result.shift();
	        return result;
	    };

	    module.exports = Quaternion;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module){
	    var Quaternion = __webpack_require__(66);
	    var Transitionable = __webpack_require__(11);
	    var SimpleStream = __webpack_require__(12);
	    var EventHandler = __webpack_require__(3);

	    /**
	     * An extension of Transitionable to transition Quaternions via spherical linear interpolation (slerp).
	     *
	     * @class QuatTransitionable
	     * @private
	     * @constructor
	     * @namespace Camera
	     * @extends Streams.SimpleStream
	     * @param value {Quaternion}   Starting quaternion
	     */
	    function QuatTransitionable(quaternion){
	        this.start = Quaternion.create();
	        this.end = Quaternion.create();
	        this.value = Quaternion.create();

	        this.t = new Transitionable(0);

	        this._eventOutput = this.t.map(function(t){
	            Quaternion.slerp(this.start, this.end, t, this.value);
	            return this.value;
	        }.bind(this));

	        EventHandler.setOutputHandler(this, this._eventOutput);
	    }

	    QuatTransitionable.prototype = Object.create(SimpleStream.prototype);
	    QuatTransitionable.prototype.constructor = QuatTransitionable;

	    /**
	     * Define a new end value that will be transitioned towards with the prescribed
	     *  transition. An optional callback can fire when the transition completes.
	     *
	     * @method set
	     * @param quaternion {Quaternion}           Quaternion end value
	     * @param [transition] {Object}             Transition definition
	     * @param [callback] {Function}             Callback
	     */
	    QuatTransitionable.prototype.set = function(quaternion, transition, callback){
	        Quaternion.set(this.get(), this.start);

	        // go shorter way around
	        if (Quaternion.dot(this.start, quaternion) < 0)
	            Quaternion.negate(this.start, this.start);

	        Quaternion.set(quaternion, this.end);

	        this.t.reset(0);
	        this.t.set(1, transition, callback);
	    }

	    /**
	     * Sets the value and velocity of the transition without firing any events.
	     *
	     * @method reset
	     * @param quaternion {Quaternion}       New quaternion
	     * @param [velocity] {Number|Number[]}  New velocity
	     */
	    QuatTransitionable.prototype.reset = function(quaternion, velocity){
	        Quaternion.set(quaternion, this.start);
	        Transitionable.prototype.getVelocity.call(this.t, 0);
	    }

	    /**
	     * Determine is the transition is ongoing, or has completed.
	     *
	     * @method isActive
	     * @return {Boolean}
	     */
	    QuatTransitionable.prototype.isActive = function(){
	        return Transitionable.prototype.isActive.apply(this.t, arguments);
	    }

	    /**
	     * Ends the transition in place.
	     *
	     * @method halt
	     */
	    QuatTransitionable.prototype.halt = function(){
	        Quaternion.set(this.get(), this.value);
	        Transitionable.prototype.halt.apply(this.t, arguments);
	    }

	    /**
	     * Return the current value of the transition.
	     *
	     * @method get
	     * @return {Quaternion}    Current quaternion
	     */
	    QuatTransitionable.prototype.get = function(){
	        return this.value;
	    }

	    /**
	     * Return the current velocity of the transition.
	     *
	     * @method getVelocity
	     * @return {Number|Number[]}    Current velocity
	     */
	    QuatTransitionable.prototype.getVelocity = function(){
	        return Transitionable.prototype.getVelocity.apply(this.t, arguments);
	    }

	    module.exports = QuatTransitionable;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015-2016 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module){
	    var Camera = __webpack_require__(65);
	    var Quaternion = __webpack_require__(66);
	    var Controller = __webpack_require__(26);
	    var Transform = __webpack_require__(9);
	    var Transitionable = __webpack_require__(11);
	    var Stream = __webpack_require__(16);

	    var MouseInput = __webpack_require__(45);
	    var TouchInput = __webpack_require__(46);
	    var ScrollInput = __webpack_require__(48);
	    var PinchInput = __webpack_require__(52);
	    var GenericInput = __webpack_require__(44);

	    GenericInput.register({
	        mouse : MouseInput,
	        touch : TouchInput,
	        pinch : PinchInput,
	        scroll : ScrollInput
	    });

	    /**
	     * A tackball camera. This is a camera that rotates (in place) what is added to its render tree. It can
	     *  also zoom in and out. These actions are tied to DOM events. Rotation is connected to mouse and touch events,
	     *  and zooming is connected to the scrollwheel and pinch (two-finger touch) input.
	     *
	     *  @class TrackballCamera
	     *  @constructor
	     *  @namespace Camera
	     *  @extends Core.Controller
	     *  @param [options] {Object}                       Options
	     *  @param [options.radius=500] {Number}            Radius of the trackball camera
	     *  @param [options.rotationScale=1] {Number}       Amount to scale the rotation
	     *  @param [options.zoomScale=1] {Number}           Amount to scale the zoom
	     *  @param [options.inertia=true] {Boolean}         Include inertia for rotation and zooming
	     *  @param [options.position=[0,0,0]] {Array}       Starting position of the camera
	     *  @param [options.orientation=[1,0,0,0]] {Array}  Starting orientation of the camera
	     */
	    var TrackballCamera = Controller.extend({
	        defaults : {
	            radius: 500,
	            rotationScale: 1,
	            zoomScale: 1,
	            inertia: true,
	            position: Camera.DEFAULT_OPTIONS.position,
	            orientation: Camera.DEFAULT_OPTIONS.orientation
	        },
	        initialize : function(options){
	            this.camera = new Camera(options);
	            this.delta = Quaternion.create();

	            this.orientation = this.camera.orientation;
	            this.position = this.camera.position;

	            // get the coordinates of the center of the camera
	            // TODO: make work if inside of ContainerSurfaces
	            this.center = [];
	            var centerStream = Stream.lift(function(size, layout){
	                if (!size || !layout) return false;
	                var pos = Transform.getTranslate(layout.transform);
	                this.center[0] = pos[0] + 0.5 * size[0];
	                this.center[1] = pos[1] + 0.5 * size[1];
	            }.bind(this), [this.camera._node._size, this.camera._node.layout]);

	            centerStream.on('start', function(center){});
	            centerStream.on('update', function(center){});
	            centerStream.on('end', function(center){});

	            var rotationInertia = options.inertia ? new Transitionable(0) : false;
	            var zoomInertia = options.inertia ? new Transitionable(0) : false;

	            var rotationInput = new GenericInput(['mouse', 'touch'], {scale : options.rotationScale, limit: 1});
	            var zoomInput = new GenericInput({
	                pinch : {scale: options.zoomScale},
	                scroll : {scale: options.zoomScale, direction: ScrollInput.DIRECTION.Y}
	            });

	            rotationInput.subscribe(this.input);
	            zoomInput.subscribe(this.input);

	            // update rotation based on mouse and touch dragging
	            var hasMoved = false;
	            rotationInput.on('start', function(data){
	                hasMoved = false;
	                if (rotationInertia && rotationInertia.isActive()) rotationInertia.halt();

	                this.emit('start', {
	                    position: this.getPosition(),
	                    orientation: this.getOrientation()
	                });
	            }.bind(this));

	            rotationInput.on('update', function(data){
	                hasMoved = true;
	                var angleAxis = convertInputToAngleAxis.call(this, data);
	                Quaternion.fromAngleAxis(angleAxis, this.delta);
	                this.rotateBy(this.delta);

	                this.emit('update', {
	                    position: this.getPosition(),
	                    orientation: this.getOrientation()
	                });
	            }.bind(this));

	            // at end of rotation, apply inertia to Quaternion if inertia is allowed
	            rotationInput.on('end', function(data){
	                if (!hasMoved || !rotationInertia) {
	                    this.emit('end', {
	                        position: this.getPosition(),
	                        orientation: this.getOrientation()
	                    });
	                }
	                else {
	                    var angle = Quaternion.getAngle(this.delta);
	                    rotationInertia.reset(angle);
	                    rotationInertia.set(angle, {
	                        curve : 'damp',
	                        damping : .9
	                    });
	                }
	            }.bind(this));

	            if (rotationInertia){
	                rotationInertia.on('update', function(angle){
	                    Quaternion.setAngle(this.delta, angle, this.delta);
	                    this.rotateBy(this.delta);

	                    this.emit('update', {
	                        position: this.getPosition(),
	                        orientation: this.getOrientation()
	                    });
	                }.bind(this));

	                rotationInertia.on('end', function(value){
	                    this.emit('end', {
	                        position: this.getPosition(),
	                        orientation: this.getOrientation()
	                    });
	                }.bind(this));
	            }

	            // update zoom based on mousewheel and pinch events
	            zoomInput.on('update', function(data){
	                var zoom = data.delta;
	                this.zoomBy(zoom);

	                this.emit('update', {
	                    position: this.getPosition(),
	                    orientation: this.getOrientation()
	                });
	            }.bind(this));

	            // at end of zooming (on pinch), apply inertia to zoom
	            zoomInput.on('end', function(data){
	                if (!zoomInertia){
	                    this.emit('end', {
	                        position: this.getPosition(),
	                        orientation: this.getOrientation()
	                    });
	                }
	                else if (data.velocity !== 0){
	                    var z = this.getPosition()[2];
	                    zoomInertia.reset(z);
	                    zoomInertia.set(z, {
	                        curve : 'inertia',
	                        damping: .2,
	                        velocity : data.velocity
	                    });
	                }
	            }.bind(this));

	            if (zoomInertia){
	                zoomInertia.on('update', function(value){
	                    this.setZoom(value);
	                    this.emit('update', {
	                        position: this.getPosition(),
	                        orientation: this.getOrientation()
	                    });
	                }.bind(this));

	                zoomInertia.on('end', function(value){
	                    this.emit('end', {
	                        position: this.getPosition(),
	                        orientation: this.getOrientation()
	                    });
	                }.bind(this));
	            }
	        },
	        _onAdd : function(){
	            return Camera.prototype._onAdd.apply(this.camera, arguments);
	        },
	        /**
	         * Extends the render tree subtree with a new node.
	         *
	         * @method add
	         * @param object {SizeNode|LayoutNode|Surface} Node
	         * @return {RenderTreeNode}
	         */
	        add : function(){
	            return Camera.prototype.add.apply(this.camera, arguments);
	        },
	        /**
	         * Remove from the RenderTree. All Surfaces added to the View
	         *  will also be removed. The Camera can be added back at a later time and
	         *  all of its data and Surfaces will be restored.
	         *
	         * @method remove
	         */
	        remove : function(){
	            return Camera.prototype.remove.apply(this.camera, arguments);
	        },
	        /**
	         * Set the position.
	         *
	         * @method setPosition
	         * @param position {Number[]}               End position
	         * @param [transition] {Object}             Transition definition
	         * @param [callback] {Function}             Callback
	         */
	        setPosition : function(position, transition, callback){
	            Camera.prototype.setPosition.apply(this.camera, arguments);
	        },
	        /**
	         * Get the position.
	         *
	         * @method getPosition
	         * @return {Array}                          Position
	         */
	        getPosition : function(){
	            return Camera.prototype.getPosition.apply(this.camera);
	        },
	        /**
	         * Set the orientation.
	         *
	         * @method setOrientation
	         * @param orientation {Array}               [angle, x-axis, y-axis, z-axis]
	         * @param [transition] {Object}             Transition definition
	         * @param [callback] {Function}             Callback
	         */
	        setOrientation : function(orientation, transition, callback){
	            Camera.prototype.setOrientation.apply(this.camera, arguments);
	        },
	        /**
	         * Get the orientation.
	         *
	         * @method getOrientation
	         * @return {Array}                          Orientation as [angle, x-axis, y-axis, z-axis]
	         */
	        getOrientation : function(){
	            return Camera.prototype.getOrientation.apply(this.camera);
	        },
	        /**
	         * Move the position of the camera in the z-direction by a given amount.
	         *
	         * @method zoomBy
	         * @param delta {Number}                    Relative amount to zoom by
	         * @param [transition] {Object}             Transition definition
	         * @param [callback] {Function}             Callback
	         */
	        zoomBy : function(delta, transition, callback){
	            Camera.prototype.zoomBy.apply(this.camera, arguments);
	        },
	        /**
	         * Move the position of the camera in the z-direction to the given zoom.
	         *
	         * @method setZoom
	         * @param zoom {Number}                     Absolute amount to zoom
	         * @param [transition] {Object}             Transition definition
	         * @param [callback] {Function}             Callback
	         */
	        setZoom : function(zoom, transition, callback){
	            Camera.prototype.setZoom.apply(this.camera, arguments);
	        },
	        /**
	         * Rotate the orientation of the camera by a given rotation.
	         *
	         * @method rotateBy
	         * @param rotation {Array}                  Rotation as [angle, x-axis, y-axis, z-axis]
	         * @param [transition] {Object}             Transition definition
	         * @param [callback] {Function}             Callback
	         */
	        rotateBy : function(rotation, transition, callback){
	            Camera.prototype.rotateBy.apply(this.camera, arguments);
	        },
	        /**
	         * Face the camera towards a Transform. The Transform is decomposed into
	         *  its position and rotation parts to calulate where to orient the camera.
	         *
	         * @method lookAt
	         * @param transform {Transform}             Transform to face camera toward
	         * @param [transition] {Object}             Transition definition
	         * @param [callback] {Function}             Callback
	         */
	        lookAt : function(transform, transition, callback){
	            Camera.prototype.lookAt.apply(this.camera, arguments);
	        }
	    });

	    // convert mouse/touch input delta into a rotation for the camera
	    function convertInputToAngleAxis(data){
	        var delta = data.delta;

	        var dx = delta[0];
	        var dy = delta[1];

	        var px = data.x - this.center[0];
	        var py = data.y - this.center[1];
	        var pz = this.options.radius;

	        var qx = px + dx;
	        var qy = py + dy;
	        var qz = this.options.radius;

	        var dpInv = 1 / Math.hypot(px, py, pz);
	        var dqInv = 1 / Math.hypot(qx, qy, qz);

	        px *= dpInv;
	        py *= dpInv;
	        pz *= dpInv;
	        qx *= dqInv;
	        qy *= dqInv;
	        qz *= dqInv;

	        var angle = Math.acos(px * qx + py * qy + pz * qz);

	        var axisX = py * qz - pz * qy;
	        var axisY = pz * qx - px * qz;
	        var axisZ = px * qy - py * qx;

	        return [angle, axisX, axisY, axisZ];
	    }

	    module.exports = TrackballCamera;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ])
});
;