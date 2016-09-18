/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('./EventHandler');

    /**
     * EventFilter regulates the broadcasting of events based on
     *  a specified condition prescribed by a provided function
     *  with the signature `(type, data) -> Boolean`
     *
     *  @example
     *
     *      var eventFilter = new EventFilter(function(type, payload){
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
        if (!this._condition(type, data)) return;
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
});
