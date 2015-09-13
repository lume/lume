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
    var EventHandler = require('./EventHandler');
    var ResizeStream = require('samsara/streams/ResizeStream');
    var preTickQueue = require('./queues/preTickQueue');
    var dirtyQueue = require('./queues/dirtyQueue');
    var postTickQueue = require('./queues/postTickQueue');
    var State = require('samsara/core/SUE');
    var tickQueue = require('./queues/tickQueue');
    var Stream = require('samsara/streams/Stream');

    var contexts = [];
    var rafId;
    var eventForwarders = {};
    var listenOnTick = false;
    var size = new EventHandler();
    var containerType = 'div';
    var containerClass = 'samsara-context';
    var eventHandler = new EventHandler();

    /**
     * Engine is a singleton object that is required to run a Samsara application.
     *   It is the "heartbeat" of the application, managing the batching of streams
     *   and the commiting of all RootNodes.
     *
     *   It also listens and can respond to DOM events on the HTML <body> tag.
     *
     * @class Engine
     */
    var Engine = {};

    EventHandler.setInputHandler(Engine, eventHandler);
    EventHandler.setOutputHandler(Engine, eventHandler);

    //TODO: add this only for full-screen apps
    //document.body.classList.add('samsara-root');

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

        for (var i = 0; i < contexts.length; i++) contexts[i].commit();

        while (dirtyQueue.length) (dirtyQueue.shift())();

        State.set(State.STATES.START);
    };

    /**
     * Creates a new Context from which a scene graph can be constructed.
     *
     * @method createContext
     * @param [DOMelement] {Node}   Pre-existing element in the document
     * @return {Context}
     */
    Engine.createContext = function createContext(DOMelement) {
        var needMountContainer = (DOMelement === undefined);
        if (needMountContainer) DOMelement = document.createElement(containerType);

        DOMelement.classList.add(containerClass);

        var context = new Context(DOMelement);
        Engine.registerContext(context);

        if (needMountContainer) document.body.appendChild(DOMelement);

        return context;
    };

    /**
     * Registers an existing Context to be updated by the run loop.
     *
     * @static
     * @method registerContext
     * @param context {Context}     Context to register
     */
    Engine.registerContext = function registerContext(context) {
        context.size.subscribe(size);
        contexts.push(context);
    };

    /**
     * Removes a Context from the run loop.
     *  Note: this does not do any cleanup.
     *
     * @method deregisterContext
     * @param context {Context}     Context to deregister
     */
    Engine.deregisterContext = function deregisterContext(context) {
        var i = contexts.indexOf(context);
        context.size.unsubscribe(size);
        if (i >= 0) contexts.splice(i, 1);
    };

    /**
     * Adds a handler to an event on the DOM <body>, e.g., "click".
     *
     * @method on
     * @param type {string}         DOM event name
     * @param handler {function}    Handler
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
     */
    Engine.start = start;

    function loop() {
        Engine.step();
        rafId = window.requestAnimationFrame(loop);
    }

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

    //window.requestAnimationFrame(start);
    //Engine.start = function(){};

    function handleResize() {
        var windowSize = [window.innerWidth, window.innerHeight];
        size.emit('resize', windowSize);
        eventHandler.emit('resize', windowSize);

        dirtyQueue.push(function engineResizeClean(){
            size.emit('resize', windowSize);
        });
    }

    window.addEventListener('resize', handleResize, false);
    window.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, true);

    module.exports = Engine;
});
