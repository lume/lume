/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var EventEmitter = require('./EventEmitter');

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
     * @param type {String|Array}       Event channel name or array of names
     * @param handler {Function}        Callback handler
     */
    EventHandler.prototype.on = function on(type, handler) {
        EventEmitter.prototype.on.apply(this, arguments);
        var i;
        if (type instanceof Array) {
            for (i = 0; i < type.length; i++)
                on.call(this, type[i], handler);
        }
        else if (!this.upstreamListeners[type]) {
            var upstreamListener = this.trigger.bind(this, type);
            this.upstreamListeners[type] = upstreamListener;
            for (i = 0; i < this.upstream.length; i++) {
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
     * @return {Boolean}              True if no more listeners remain. False otherwise.
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
        return empty;
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
     * @return {Boolean}              True if no source was unsubscribed. False if none found.
     */
    EventHandler.prototype.unsubscribe = function unsubscribe(source) {
        if (!source) {
            for (var i = 0; i < this.upstream.length; i++)
                this.unsubscribe(this.upstream[i]);
            return true;
        }
        else {
            var index = this.upstream.indexOf(source);
            if (index >= 0) {
                this.upstream.splice(index, 1);
                for (var type in this.upstreamListeners) {
                    source.off(type, this.upstreamListeners[type]);
                }
                return true;
            }
            else return false;
        }
    };

    module.exports = EventHandler;
});
