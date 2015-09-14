define(function(require, exports, module) {
    var SimpleStream = require('samsara/streams/SimpleStream');
    var preTickQueue = require('samsara/core/queues/preTickQueue');
    var dirtyQueue = require('samsara/core/queues/dirtyQueue');

    /**
     * An Observable is a stream for events set discretely in time, as opposed to continuously.
     *  It emits appropriate `start` and `end` events upon calling the `set` method.
     *
     * @class Observable
     * @constructor
     * @private
     * @extends SimpleStream
     * @param value {Number, String, Array, Object} Value
     */
    function Observable(value){
        SimpleStream.call(this);
        this.value = value;

        if (value !== undefined) this.set(value);
    }

    Observable.prototype = Object.create(SimpleStream.prototype);
    Observable.prototype.constructor = Observable;

    /**
     * Getter for the provided value.
     *
     * @method get
     * @return {Number, String, Array, Object}
     */
    Observable.prototype.get = function(){
        return this.value;
    };

    /**
     * Setter for the provided value.
     *
     * @method set
     * @param value {Number, String, Array, Object} Value
     */
    Observable.prototype.set = function(value){
        var self = this;
        preTickQueue.push(function(){
            self.value = value;
            self.emit('start', value);

            dirtyQueue.push(function(){
                self.emit('end', value);
            });
        });
    };

    module.exports = Observable;
});
