/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('../core/EventHandler');

    /**
     * EventFilter regulates the broadcasting of events based on
     *  a specified condition prescribed by a provided function
     *  with the signature `(type, data) -> Boolean`
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
