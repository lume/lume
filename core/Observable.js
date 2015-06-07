define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var dirtyQueue = require('famous/core/dirtyQueue');

    function Observable(value){
        this.value = value || undefined;
        this._eventHandler = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventHandler);
    }

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
