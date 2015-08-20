define(function(require, exports, module) {
    var Stream = require('samsara/streams/Stream');
    var preTickQueue = require('samsara/core/queues/preTickQueue');
    var dirtyQueue = require('samsara/core/queues/dirtyQueue');

    function Observable(value){
        Stream.call(this);
        this.value = value;

        if (value !== undefined) this.set(value);
    }

    Observable.prototype = Object.create(Stream.prototype);
    Observable.prototype.constructor = Observable;

    Observable.prototype.get = function(){
        return this.value;
    };

    Observable.prototype.set = function(value){
        preTickQueue.push(function(){
            this.value = value;
            this.emit('start', value);

            dirtyQueue.push(function(){
                this.emit('end', value);
            }.bind(this));
        }.bind(this))
    };

    module.exports = Observable;
});
