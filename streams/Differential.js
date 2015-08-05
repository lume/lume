define(function(require, exports, module){
    var Stream = require('famous/streams/Stream');
    var OptionsManager = require('famous/core/OptionsManager');

    function Differential(options){
        this.options = OptionsManager.setOptions(this, options);

        var previous = undefined;
        var delta = undefined;

        Stream.call(this, {
            update : function(){ return delta; }
        });

        this._eventInput.on('start', function(value){
            previous = value;
        });

        this._eventInput.on('update', function(value){
            var scale = this.options.scale;
            if (previous instanceof Array){
                delta = [];
                for (var i = 0; i < previous.length; i++)
                    delta[i] = scale * (value[i] - previous[i]);
            }
            else delta = scale * (value - previous);
            previous = value;
        }.bind(this));
    }

    Differential.DEFAULT_OPTIONS = {
        scale : 1
    };

    Differential.prototype = Object.create(Stream.prototype);
    Differential.prototype.constructor = Differential;

    module.exports = Differential;
});
