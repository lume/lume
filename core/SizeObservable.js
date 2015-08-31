define(function(require, exports, module) {
    var SimpleStream = require('samsara/streams/SimpleStream');
    var preTickQueue = require('samsara/core/queues/preTickQueue');
    var dirtyQueue = require('samsara/core/queues/dirtyQueue');

    function SizeObservable(value){
        SimpleStream.call(this);
        this.value = value;

        if (value !== undefined) this.set(value);
    }

    SizeObservable.prototype = Object.create(SimpleStream.prototype);
    SizeObservable.prototype.constructor = SizeObservable;

    SizeObservable.prototype.get = function(){
        return this.value;
    };

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
