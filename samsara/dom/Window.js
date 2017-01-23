/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');

    var eventOutput = new EventHandler();
    var eventForwarder = function eventForwarder(event) {
        eventOutput.emit(event.type, event);
    };

    var Window = {};

    /**
     * Adds a handler to the `type` channel which will be executed on `emit`.
     *  These events should be DOM events that occur on the DOM node the
     *  context has been mounted to.
     *
     * @method on
     * @param type {String}         Channel name
     * @param handler {Function}    Callback
     */
    Window.on = function on(type, handler){
        window.addEventListener(type, eventForwarder);
        EventHandler.prototype.on.apply(eventOutput, arguments);
    };

    /**
     * Removes the `handler` from the `type`.
     *  Undoes the work of `on`.
     *
     * @method off
     * @param type {String}         Channel name
     * @param handler {Function}    Callback
     */
    Window.off = function off(type, handler) {
        EventHandler.prototype.off.apply(eventOutput, arguments);
    };

    /**
     * Used internally when context is subscribed to.
     *
     * @method emit
     * @private
     * @param type {String}     Channel name
     * @param data {Object}     Payload
     */
    Window.emit = function emit(type, payload) {
        EventHandler.prototype.emit.apply(eventOutput, arguments);
    };

    module.exports = Window;
});
