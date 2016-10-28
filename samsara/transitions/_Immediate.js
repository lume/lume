/* Copyright © 2015-2016 David Valdman */

define(function (require, exports, module) {
    var Transition = require('./_Transition');
    var preTickQueue = require('../core/queues/preTickQueue');

    /**
     * An immediate transition, with no interpolation between values.
     *  Only emits `start` and `end` events.
     *
     * @method set
     * @param value {Number}                End value
     */
    function Immediate(value) {
        Transition.apply(this, arguments);
    }

    Immediate.DIMENSIONS = Infinity;

    Immediate.prototype = Object.create(Transition.prototype);
    Immediate.prototype.constructor = Immediate;

    /**
     * Set new value to transition to.
     *
     * @method set
     * @param value {Number}                End value
     * @param transition {Object}           Transition definition
     */
    Immediate.prototype.set = function(value){
        this.value = value;
        var self = this;
        preTickQueue.push(function(){
            self.emit('set', self.value);
        });

        this.start = this.get();
        this.end = value;
    }

    module.exports = Immediate;
});
