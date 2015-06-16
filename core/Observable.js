define(function(require, exports, module) {
    var Stream = require('famous/streams/Stream');
    var nextTickQueue = require('famous/core/nextTickQueue');
    var dirtyQueue = require('famous/core/dirtyQueue');

    function Observable(value){
        Stream.call(this);
        this.value = value || undefined;

        if (value !== undefined){
            nextTickQueue.push(function(){
                this.set(value);
            }.bind(this));
        }
    }

    Observable.prototype = Object.create(Stream.prototype);
    Observable.prototype.constructor = Observable;

    Observable.prototype.get = function(){
        return this.value;
    };

    Observable.prototype.set = function(value){
        if (value == this.value) return;
        this.value = value;
        this.emit('start', value);

        dirtyQueue.push(function(){
            this.emit('end', value);
        }.bind(this));
    };

    module.exports = Observable;
});
