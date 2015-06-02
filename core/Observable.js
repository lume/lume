define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var dirtyQueue = require('famous/core/dirtyQueue');

    function Observable(value){
        this.value = value || undefined;
        this._eventHandler = new EventHandler();
        EventHandler.setInputHandler(this, this._eventHandler);
        EventHandler.setOutputHandler(this, this._eventHandler);

        if (value instanceof Object && value.emit)
            this._eventHandler.subscribe(value);
    }

    Observable.prototype.get = function(){
        return this.value;
    };

    Observable.prototype.set = function(value){
        if (value == this.value) return;
        this.value = value;
        this.emit('start');
        dirtyQueue.push(this);
    };

    Observable.prototype.clean = function(){
        this.emit('end');
    };

    module.exports = Observable;

});