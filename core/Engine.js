/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Context = require('./Context');
    var Transform = require('./Transform');
    var State = require('./SUE');
    var RootNode = require('./nodes/RootNode');
    var postTickQueue = require('./queues/postTickQueue');
    var preTickQueue = require('./queues/preTickQueue');
    var dirtyQueue = require('./queues/dirtyQueue');
    var tickQueue = require('./queues/tickQueue');
    var EventHandler = require('../events/EventHandler');
    var ResizeStream = require('../streams/ResizeStream');
    var Stream = require('../streams/Stream');

    var rafId = 0;
    var eventForwarders = {};
    var listenOnTick = false;
    var size = new ResizeStream;
    var layout = new EventHandler();
    var eventHandler = new EventHandler();

    var layoutSpec = {
        transform : Transform.identity,
        opacity : 1,
        origin : null,
        align : null,
        nextSizeTransform : Transform.identity
    };

    /**
     * Engine is a singleton object that is required to run a Samsara application.
     *  It is the "heartbeat" of the application, managing the batching of streams
     *  and creating `RootNodes` and `Contexts` to begin render trees.
     *
     *  It also listens and can respond to DOM events on the HTML `<body>` tag
     *  and `window` object. For instance the `resize` event.
     *
     *  @example
     *
     *      var context = Engine.createContext();
     *
     *      var surface = new Surface({
     *          size : [100,100],
     *          properties : {background : 'red'}
     *      });
     *
     *      context.add(surface);
     *
     *      Engine.start();
     *
     *      Engine.on('click', function(){
     *          alert('clicked!');
     *      });
     *
     * @class Engine
     * @namespace Core
     * @static
     * @uses Core.EventHandler
     */
    var Engine = {};

    EventHandler.setInputHandler(Engine, eventHandler);
    EventHandler.setOutputHandler(Engine, eventHandler);

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

        // tick signals base event flow coming in
        State.set(State.STATES.UPDATE);

        if (listenOnTick) eventHandler.emit('tick');
        
        for (var i = 0; i < tickQueue.length; i++) tickQueue[i]();

        // post tick is for resolving larger components from their incoming signals
        while (postTickQueue.length) (postTickQueue.shift())();

        State.set(State.STATES.END);

        while (dirtyQueue.length) (dirtyQueue.shift())();

        State.set(State.STATES.START);
    };

    /**
     * A ResizeStream representing the document's <body> size.
     *
     * @property size
     */
    Engine.size = size;

    /**
     * Creates a new Root Node from which a render tree can be constructed.
     *  Use this to modify preexisting elements in 2D space.
     *
     * @method createRoot
     * @static
     * @return {RootNode}
     */
    Engine.createRoot = function createRoot(){
        var root = new RootNode();
        Engine.registerRoot(root);
        return root;
    };

    /**
     * Hook up listeners to a RootNode and add to an internal array for commiting.
     *
     * @method registerRoot
     * @static
     * @private
     */
    Engine.registerRoot = function registerRoot(root){
        root._size.subscribe(size);
        root._layout.subscribe(layout);
    };

    /**
     * Remove listeners to RootNode and remove from internal commit array.
     *
     * @method deregisterRoot
     * @static
     * @private
     */
    Engine.deregisterRoot = function deregisterRoot(root){
        root._size.unsubscribe(size);
        root._layout.unsubscribe(layout);
    };

    /**
     * Creates a new Context from which a render tree can be constructed.
     *  If no DOM element is specified, one will be created and appended
     *  to the document body.
     *
     * @method createContext
     * @static
     * @param [options] {Object}    Options
     * @param [options.el] {Node}   Pre-existing element in the document
     * @return {Context}
     */
    Engine.createContext = function createContext(options) {
        var context = new Context(options);
        Engine.registerContext(context);
        if (!options || !options.el)
            document.body.appendChild(context.container);
        return context;
    };

    /**
     * Registers an existing Context to be updated by the run loop.
     *
     * @method registerContext
     * @static
     * @private
     * @param context {Context}     Context to register
     */
    Engine.registerContext = function registerContext(context) {
        context._size.subscribe(size);
        context._layout.subscribe(layout);
    };

    /**
     * Removes a Context from the run loop.
     *  Note: this does not do any cleanup.
     *
     * @method deregisterContext
     * @static
     * @private
     * @param context {Context}     Context to deregister
     */
    Engine.deregisterContext = function deregisterContext(context) {
        context._size.unsubscribe(size);
        context._layout.unsubscribe(layout);
    };

    /**
     * Adds a handler to an event on the DOM <body>, e.g., "click".
     *
     * @method on
     * @static
     * @param type {String}         DOM event name
     * @param handler {Function}    Handler
     */
    Engine.on = function on(type, handler){
        if (type === 'tick') listenOnTick = true;
        if (!(type in eventForwarders)) {
            eventForwarders[type] = eventHandler.emit.bind(eventHandler, type);
            document.addEventListener(type, eventForwarders[type]);
        }
        eventHandler.on(type, handler);
    };

    /**
     * Removes a previously added handler.
     *
     * @method off
     * @static
     * @param type {String}         DOM event name
     * @param handler {Function}    Handler
     */
    Engine.off = function off(type, handler){
        if (type === 'tick') listenOnTick = false;
        if (!(type in eventForwarders)) {
            document.removeEventListener(type, eventForwarders[type]);
        }
        eventHandler.off(type, handler);
    };

    /**
     * Initiates the Engine's heartbeat.
     *
     * @method start
     * @static
     */
    Engine.start = start;

    function loop() {
        Engine.step();
        rafId = window.requestAnimationFrame(loop);
    }

    function start(){
        handleResize();
        preTickQueue.push(function start(){
            layout.emit('start', layoutSpec);
            dirtyQueue.push(function(){
                layout.emit('end', layoutSpec);
            });
        });

        loop();
    }

    function handleResize() {
        var windowSize = [window.innerWidth, window.innerHeight];
        size.emit('resize', windowSize);
        eventHandler.emit('resize', windowSize);

        dirtyQueue.push(function engineResizeClean(){
            size.emit('resize', windowSize);
        });
    }

    window.addEventListener('resize', handleResize, false);

    module.exports = Engine;
});
