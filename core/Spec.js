define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    function Spec(){
        this.spec = {};
        this.size = [];

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('start', function(spec){
            this.spec = spec;
            this.emit('start', this);
        }.bind(this));

        this._eventInput.on('update', function(spec){
            this.spec = spec;
            this.emit('update', this);
        }.bind(this));

        this._eventInput.on('end', function(spec){
            this.spec = spec;
            this.emit('end', this);
        }.bind(this));

        this._eventInput.on('resize', function(size){
            this.size = size;
        }.bind(this));
    }

    Spec.prototype.get = function(){
        this.spec.size = this.size;
        return this.spec;
    };

    module.exports = Spec;
});
