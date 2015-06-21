/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {

    /**
     * The singleton object initiated upon process
     *   startup which manages all active Context instances, runs
     *   the render dispatch loop, and acts as a listener and dispatcher
     *   for events.  All methods are therefore static.
     *
     *   On static initialization, window.requestAnimationFrame is called with
     *     the event loop function.
     *
     *   Note: Any window in which Engine runs will prevent default
     *     scrolling behavior on the 'touchmove' event.
     *
     * @static
     * @class Engine
     */
    var Context = require('./Context');
    var EventHandler = require('./EventHandler');
    var OptionsManager = require('./OptionsManager');
    var Clock = require('famous/core/Clock');
    var ResizeStream = require('famous/streams/ResizeStream');

    var dirtyObjects = require('famous/core/dirtyObjects');
    var nextTickQueue = require('./queues/nextTickQueue');
    var dirtyQueue = require('./queues/dirtyQueue');
    var postTickQueue = require('./queues/postTickQueue');
    var tickQueue = require('./queues/tickQueue');
    var Stream = require('famous/streams/Stream');

    var Engine = {};

    var now = Date.now;
    var contexts = [];
    var currentFrame = 0;
    var nextTickFrame = 0;
    var lastTime = now();
    var rafId;
    var frameTime;
    var frameTimeLimit;
    var eventForwarders = {};
    var eventHandler = new EventHandler();
    var dirty = true;
    var dirtyLock = 0;
    var sizeStream = new ResizeStream();

    var options = {
        containerType: 'div',
        containerClass: 'famous-context',
        fpsCap: undefined,
        appMode: true
    };
    var optionsManager = new OptionsManager(options);

    nextTickQueue.push(function(){
        Engine.trigger('dirty');
    });

    dirtyQueue.push(function(){
        Engine.trigger('clean');
    });

    /**
     * Inside requestAnimationFrame loop, step() is called, which:
     *   calculates current FPS (throttling loop if it is over limit set in setFPSCap),
     *   emits dataless 'prerender' event on start of loop,
     *   calls in order any one-shot functions registered by nextTick on last loop,
     *   calls Context.update on all Context objects registered,
     *   and emits dataless 'postrender' event on end of loop.
     *
     * @static
     * @private
     * @method step
     */

    var firstFrame = true;
    Engine.step = function step() {
        // browser events and their handlers happen before rendering begins

        currentFrame++;
        nextTickFrame = currentFrame;

        var currentTime = now();

        // skip frame if we're over our framerate cap
        if (frameTimeLimit && currentTime - lastTime < frameTimeLimit) return;

        frameTime = currentTime - lastTime;
        lastTime = currentTime;

        while (nextTickQueue.length) (nextTickQueue.shift())();

        // tick signals base event flow coming in
        eventHandler.emit('tick');
        for (var i = 0; i < tickQueue.length; i++) tickQueue[i]();

        while (nextTickQueue.length) (nextTickQueue.shift())();

        // post tick is for resolving larger components from their incoming signals
        while (postTickQueue.length) (postTickQueue.shift())();

        for (var i = 0; i < contexts.length; i++)
            contexts[i].commit();

        while (dirtyQueue.length) (dirtyQueue.shift())();
    };

    // engage requestAnimationFrame
    function loop() {
        //TODO: this dirty check should be unecessary
        if (dirty) {
            Engine.step();
            rafId = window.requestAnimationFrame(loop);
        }
    }
    rafId = window.requestAnimationFrame(loop);

    function handleResize() {
        var size = [window.innerWidth, window.innerHeight];
        sizeStream.trigger('resize', size);
    }
    window.addEventListener('resize', handleResize, false);

    /**
     * Initialize famous for app mode
     *
     * @static
     * @private
     * @method initialize
     */
    function initialize() {
        // prevent scrolling via browser
        window.addEventListener('touchmove', function(event) {
            event.preventDefault();
        }, true);
        document.body.classList.add('famous-root');
        document.documentElement.classList.add('famous-root');
    }
    var initialized = false;

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @static
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    EventHandler.setInputHandler(Engine, eventHandler);
    EventHandler.setOutputHandler(Engine, eventHandler);
    Engine.on = function(type, handler){
        if (!(type in eventForwarders)) {
            eventForwarders[type] = eventHandler.emit.bind(eventHandler, type);
            document.addEventListener(type, eventForwarders[type]);
        }
        return eventHandler.on(type, handler);
    };

    eventHandler.on('dirty', function(){
        if (!dirty) {
            dirty = true;
            rafId = window.requestAnimationFrame(loop);
        }
        dirtyLock++;
    });

    eventHandler.on('clean', function(){
        dirtyLock--;
        if (dirty && dirtyLock === 0) {
            dirty = false;
            window.cancelAnimationFrame(rafId);
        }
    });

    /**
     * Return the current calculated frames per second of the Engine.
     *
     * @static
     * @method getFPS
     *
     * @return {Number} calculated fps
     */
    Engine.getFPS = function getFPS() {
        return 1000 / frameTime;
    };

    /**
     * Set the maximum fps at which the system should run. If internal render
     *    loop is called at a greater frequency than this FPSCap, Engine will
     *    throttle render and update until this rate is achieved.
     *
     * @static
     * @method setFPSCap
     *
     * @param {Number} fps maximum frames per second
     */
    Engine.setFPSCap = function setFPSCap(fps) {
        frameTimeLimit = Math.floor(1000 / fps);
    };

    /**
     * Return engine options.
     *
     * @static
     * @method getOptions
     * @param {string} key
     * @return {Object} engine options
     */
    Engine.getOptions = function getOptions(key) {
        return optionsManager.getOptions(key);
    };

    /**
     * Set engine options
     *
     * @static
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.fpsCap]  maximum fps at which the system should run
     * @param {boolean} [options.runLoop=true] whether the run loop should continue
     * @param {string} [options.containerType="div"] type of container element.  Defaults to 'div'.
     * @param {string} [options.containerClass="famous-container"] type of container element.  Defaults to 'famous-container'.
     */
    Engine.setOptions = function setOptions(options) {
        return optionsManager.setOptions.apply(optionsManager, arguments);
    };

    /**
     * Creates a new Context for rendering and event handling with
     *    provided document element as top of each tree. This will be tracked by the
     *    process-wide Engine.
     *
     * @static
     * @method createContext
     *
     * @param {Node} el will be top of Famo.us document element tree
     * @return {Context} new Context within el
     */
    Engine.createContext = function createContext(el) {
        if (!initialized && options.appMode) nextTickQueue.push(initialize);

        var needMountContainer = false;
        if (!el) {
            el = document.createElement(options.containerType);
            needMountContainer = true;
        }

        el.classList.add(options.containerClass);

        var context = new Context(el);
        Engine.registerContext(context);
        
        if (needMountContainer) {
            document.body.appendChild(el);
            nextTickQueue.push(function(){
                handleResize();
                context.trigger('start');
            });

            dirtyQueue.push(function(){
                context.trigger('end');
            });
        }
        return context;
    };

    /**
     * Registers an existing context to be updated within the run loop.
     *
     * @static
     * @method registerContext
     *
     * @param {Context} context Context to register
     * @return {FamousContext} provided context
     */
    Engine.registerContext = function registerContext(context) {
        context.subscribe(sizeStream, ['resize']);
        contexts.push(context);
        return context;
    };

    /**
     * Removes a context from the run loop. Note: this does not do any
     *     cleanup.
     *
     * @static
     * @method deregisterContext
     *
     * @param {Context} context Context to deregister
     */
    Engine.deregisterContext = function deregisterContext(context) {
        var i = contexts.indexOf(context);
        context.unsubscribe(sizeStream);
        if (i >= 0) contexts.splice(i, 1);
    };

    /**
     * Returns a list of all contexts.
     *
     * @static
     * @method getContexts
     * @return {Array} contexts that are updated on each tick
     */
    Engine.getContexts = function getContexts() {
        return contexts;
    };

    optionsManager.on('change', function(data) {
        var key = data.key;
        var value = data.value;
        if (key === 'fpsCap') Engine.setFPSCap(value);
    });

    Clock.subscribeEngine(Engine);
    Engine.subscribe(Clock);
    Engine.subscribe(dirtyObjects);
    sizeStream.subscribe(eventHandler);

    module.exports = Engine;
});
