/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');

    /**
     * EventMapper modifies the data payload of an event based on
     *  a provided function.
     *
     *  Note: it does not modify the event's type.
     *
     * @class EventMapper
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
});
