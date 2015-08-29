define(function(require, exports, module) {
    var SimpleStream = require('samsara/streams/SimpleStream');
    var preTickQueue = require('samsara/core/queues/preTickQueue');
    var dirtyQueue = require('samsara/core/queues/dirtyQueue');

    function Observable(value){
        SimpleStream.call(this);
        this.value = value;

        if (value !== undefined) this.set(value);
    }

    Observable.prototype = Object.create(SimpleStream.prototype);
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
