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
