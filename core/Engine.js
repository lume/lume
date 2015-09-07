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
    var ResizeStream = require('samsara/streams/ResizeStream');

    var preTickQueue = require('./queues/preTickQueue');
    var dirtyQueue = require('./queues/dirtyQueue');
    var postTickQueue = require('./queues/postTickQueue');
    var State = require('samsara/core/SUE');
    var tickQueue = require('./queues/tickQueue');
    var Stream = require('samsara/streams/Stream');

    var Engine = {};

    var contexts = [];
    var rafId;
    var eventForwarders = {};
    var eventHandler = new EventHandler();
    var dirtyLock = 0;
    var listenOnTick = false;
    var size = new EventHandler();

    var options = {
        containerType: 'div',
        containerClass: 'samsara-context',
        appMode: true
    };
    var optionsManager = new OptionsManager(options);

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

    Engine.step = function step() {
        // browser events and their handlers happen before rendering begins
        while (preTickQueue.length) (preTickQueue.shift())();

        // tick signals base event flow coming in
        State.set(State.STATES.UPDATE);

        if (listenOnTick) eventHandler.emit('tick');
        
        for (var i = 0; i < tickQueue.length; i++) tickQueue[i]();

        // post tick is for resolving larger components from their incoming signals
        while (postTickQueue.length) (postTickQueue.shift())();

        State.set(State.STATES.END);

        for (var i = 0; i < contexts.length; i++) contexts[i].commit();

        while (dirtyQueue.length) (dirtyQueue.shift())();

        State.set(State.STATES.START);

        return dirtyLock;
    };

    function start(){
        preTickQueue.push(function start(){
            handleResize();
            for (var i = 0; i < contexts.length; i++)
                contexts[i].trigger('start');

            dirtyQueue.push(function(){
                for (var i = 0; i < contexts.length; i++)
                    contexts[i].trigger('end');
            });
        });

        loop();
    }

    // engage requestAnimationFrame
    function loop() {
        var dirty = Engine.step();
//        if (dirty)
            rafId = window.requestAnimationFrame(loop);
    }

    Engine.start = start;
//    window.requestAnimationFrame(start);
//    Engine.start = function(){};

    function handleResize() {
        var windowSize = [window.innerWidth, window.innerHeight];
        size.emit('resize', windowSize);
        eventHandler.emit('resize', windowSize);

        dirtyQueue.push(function engineResizeClean(){
            size.emit('resize', windowSize);
        });
    }
    window.addEventListener('resize', handleResize, false);
    window.addEventListener('touchmove', function(event) { event.preventDefault(); }, true);

    //TODO: add this only for app-mode
    document.body.classList.add('samsara-root');

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

    Engine.on = function engineOn(type, handler){
        if (type === 'tick') listenOnTick = true;
        if (!(type in eventForwarders)) {
            eventForwarders[type] = eventHandler.emit.bind(eventHandler, type);
            document.addEventListener(type, eventForwarders[type]);
        }
        return eventHandler.on(type, handler);
    };

    Engine.off = function engineOff (type, handler){
        if (type === 'tick') listenOnTick = false;
        if (!(type in eventForwarders)) {
            document.removeEventListener(type, eventForwarders[type]);
        }
        eventHandler.off(type, handler);
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
     * @param {string} [options.containerClass="samsara-container"] type of container element.  Defaults to 'samsara-container'.
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
        var needMountContainer = (el === undefined);
        if (needMountContainer) el = document.createElement(options.containerType);

        el.classList.add(options.containerClass);

        var context = new Context(el);
        Engine.registerContext(context);

        if (needMountContainer) document.body.appendChild(el);

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
        context.size.subscribe(size);
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
        context.size.unsubscribe(size);
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

    module.exports = Engine;
});
