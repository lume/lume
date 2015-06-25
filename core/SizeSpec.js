define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    function SizeSpec(){
        this.size = [];

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('start', function(size){
            this.size = size;
            this.emit('start', this);
        }.bind(this));

        this._eventInput.on('update', function(size){
            this.size = size;
            this.emit('update', this);
        }.bind(this));

        this._eventInput.on('end', function(size){
            this.size = size;
            this.emit('end', this);
        }.bind(this));
    }

    SizeSpec.prototype.get = function(){
        return this.size;
    };

    module.exports = SizeSpec;
});
