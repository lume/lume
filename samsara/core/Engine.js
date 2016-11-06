/* Copyright © 2015-2016 David Valdman */
// TODO: cancel RAF when asleep
define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var postTickQueue = require('./queues/postTickQueue');
    var preTickQueue = require('./queues/preTickQueue');
    var dirtyQueue = require('./queues/dirtyQueue');
    var tickQueue = require('./queues/tickQueue');
    var Transform = require('./Transform');
    var Timer = require('./Timer');

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
        handleResize(true);
        handleLayout();
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
        Engine.size.emit('end', 'end');
        isResizing = false;
    }, resizeDebounceTime);

    // Emit a resize event if the window's height or width has changed
    function handleResize(firstStart) {
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
            Engine.size.emit('set');
        }
        else {
            if (newWidth === windowWidth && newHeight === windowHeight)
                return false;

            windowWidth = newWidth;
            windowHeight = newHeight;

            if (!isResizing){
                if (firstStart){
                    Engine.size.emit('set');
                }
                else {
                    isResizing = true;
                    Engine.size.emit('start');
                    resizeEnd();
                }
            }
            else {
                Engine.size.emit('update');
                resizeEnd(); // debounced resize
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
        Engine.layout.trigger('set', layoutSpec);
    }

    module.exports = Engine;
});
