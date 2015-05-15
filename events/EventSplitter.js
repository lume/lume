/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var EventHandler = require('../core/EventHandler');

    /**
     * EventSplitter routes events to various event destinations
     *  based on custom logic.  The function signature is arbitrary.
     *
     * @class EventSplitter
     * @constructor
     *
     * @param {function} mappingFunction function to determine where
     *  events are routed to.
     */
    function EventSplitter(mappingFunction) {
        EventHandler.call(this);
        this._mappingFunction = mappingFunction;
    }
    EventSplitter.prototype = Object.create(EventHandler.prototype);
    EventSplitter.prototype.constructor = EventSplitter;

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
    EventSplitter.prototype.emit = function emit(type, data) {
        var target = this._mappingFunction.apply(this, arguments);
        if (target && (target.emit instanceof Function)) target.emit(type, data);
    };

    /**
     * Alias of emit.
     * @method trigger
     */
    EventSplitter.prototype.trigger = EventSplitter.prototype.emit;

    module.exports = EventSplitter;
});
