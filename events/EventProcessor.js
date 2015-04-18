/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    /**
     * EventProcessor modifies the data payload of an event based on
     *  a given function provided on initialization.
     *
     * @class EventProcesser
     * @constructor
     *
     * @param {function} mappingFunction function to modify the incoming
     *  event data payload
     */
    function EventProcesser(mappingFunction) {
        EventHandler.call(this);
        this._mappingFunction = mappingFunction;
    }

    EventProcesser.prototype = Object.create(EventHandler.prototype);
    EventProcesser.prototype.constructor = EventProcesser;

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
    EventProcesser.prototype.emit = function emit(type, data) {
        var data = this._mappingFunction(type, data);
        EventHandler.prototype.emit.call(this, type, data);
    };

    /**
     * Alias of emit.
     * @method trigger
     */
    EventProcesser.prototype.trigger = EventProcesser.prototype.emit;

    module.exports = EventProcesser;
});
