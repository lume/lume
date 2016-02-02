/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var SimpleStream = require('../streams/SimpleStream');
    var preTickQueue = require('../core/queues/preTickQueue');
    var dirtyQueue = require('../core/queues/dirtyQueue');

    /**
     * A SizeObservable is a stream for resize events set discretely in time, as opposed to continuously.
     *  It emits appropriate `resize` events upon calling the `set` method.
     *
     * @class Observable
     * @constructor
     * @private
     * @extends Streams.SimpleStream
     * @param value {Array} Size
     */
    function SizeObservable(value){
        SimpleStream.call(this);
        this.value = value;

        if (value !== undefined) this.set(value);
    }

    SizeObservable.prototype = Object.create(SimpleStream.prototype);
    SizeObservable.prototype.constructor = SizeObservable;

    /**
     * Getter for the provided size.
     *
     * @method get
     * @return {Array}
     */
    SizeObservable.prototype.get = function(){
        return this.value;
    };

    /**
     * Setter for the provided size.
     *
     * @method set
     * @param value {Array} Size
     */
    SizeObservable.prototype.set = function(value){
        var self = this;
        preTickQueue.push(function(){
            self.value = value;
            self.emit('resize', value);
            dirtyQueue.push(function(){
                self.emit('resize', value);
            });
        });
    };

    module.exports = SizeObservable;
});
