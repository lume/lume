/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
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
     * @return {Boolean}              True if no more listeners remain. False otherwise.
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
});
