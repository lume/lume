define(function(require, exports, module) {
    var Observable = require('famous/core/Observable');
    var EventHandler = require('famous/core/EventHandler');
    var dirtyQueue = require('famous/core/dirtyQueue');

    function ObservableArray(array){
        this.observables = [];
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventHandler);

        this._dirty = false;

        this._eventInput.on('dirty', function(){
            if (!this._dirty) return;
            this._dirty = true;
            this._eventOutput.on('dirty');
            dirtyQueue.push(this);
        }.bind(this));

        if (array) this.set(array);
    }

    ObservableArray.prototype.get = function(index){
        return (index === undefined)
            ? this.observables
            : this.observables[index];
    };

    ObservableArray.prototype.set = function(array){
        for (var i = 0; i < array.length; i++){
            var observer = new Observable(array[i]);
            this.observables.push(observer);
            this._eventInput.subscribe(observer);
        }
    };

    ObservableArray.prototype.clean = function(){
        this._dirty = true;
        this._eventOutput.emit('clean');
    };

    module.exports = ObservableArray;
});
