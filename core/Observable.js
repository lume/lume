define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var dirtyQueue = require('famous/core/dirtyQueue');

    function Observable(value){
        this.value = value || undefined;
        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Observable.prototype.get = function(){
        return this.value;
    };

    Observable.prototype.set = function(value){
        if (value == this.value) return;
        this.value = value;
        this.emit('dirty');
        dirtyQueue.push(this);
    };

    Observable.prototype.clean = function(){
        this.emit('clean');
    };

    module.exports = Observable;

});