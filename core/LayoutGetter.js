define(function(require, exports, module) {
    var Getter = require('famous/core/GetHelper');
    var EventHandler = require('famous/core/EventHandler');
    var dirtyQueue = require('famous/core/dirtyQueue');

    function LayoutGetter(array){
        this.viewArray = new ViewArray(array);
        Getter.call(this, this.viewArray);
    }

    LayoutGetter.prototype = Object.create(Getter.prototype);
    LayoutGetter.prototype.constructor = LayoutGetter;

    LayoutGetter.prototype.set = function(){
        ViewArray.prototype.set.apply(this.viewArray, arguments);
    };

    function ViewArray(array){
        this.array = [];
        this._dirty = false;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('resize', function(){
            if (!this._dirty){
                this._dirty = true;
                this._eventOutput.emit('dirty');
                dirtyQueue.push(this);
            }
        }.bind(this));

        if (array) this.set(array);
    }

    ViewArray.prototype.clean = function(){
        if (this._dirty){
            this._dirty = false;
            this._eventOutput.emit('clean');
        }
    };

    ViewArray.prototype.get = function(){
        return this.array;
    };

    ViewArray.prototype.set = function(array){
        //TODO: consider only pushing view.getSize() after size refactor
        for (var i = 0; i < array.length; i++){
            var view = array[i];
            this._eventInput.subscribe(view);
            this.array.push(view);
        }
    };

    module.exports = LayoutGetter;
});
