/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');

    /**
     * EventMapper modifies the data payload of an event based on
     *  a given function provided on initialization.
     *
     * @class EventMapper
     * @constructor
     *
     * @param {function} mappingFunction function to modify the incoming
     *  event data payload
     */
    function EventMapper(mappingFunction) {
        EventHandler.call(this);
        this._mappingFunction = mappingFunction;
    }

    EventMapper.prototype = Object.create(EventHandler.prototype);
    EventMapper.prototype.constructor = EventMapper;

    /**
     * Trigger an event, sending to all mapped downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} data event data
     * @return {EventHandler} this
     */
    EventMapper.prototype.emit = function emit(type, data) {
        var mappedData = this._mappingFunction(data);
        EventHandler.prototype.emit.call(this, type, mappedData);
    };

    /**
     * Alias of emit.
     * @method trigger
     */
    EventMapper.prototype.trigger = EventMapper.prototype.emit;

    module.exports = EventMapper;
});
