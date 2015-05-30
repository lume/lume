define(function(require, exports, module){
    var Stream = require('famous/streams/Stream');
    var OptionsManager = require('famous/core/OptionsManager');

    function Differential(options){
        var previous = undefined;

        options = options || {};
        var scale = options.scale || 1;

        Stream.call(this, {
            start : function(data){
                previous = data.value;
                this.emit('start', data);
            },
            update : function(data){
                var value = data.value;
                var delta;

                if (previous instanceof Array){
                    delta = [];
                    for (var i = 0; i < previous.length; i++){
                        delta[i] = scale * (value[i] - previous[i]);
                    }
                }
                else delta = scale * (value - previous);

                previous = data.value;

                this.emit('update', {delta : delta});
            }.bind(this)
        });
    }

    Differential.DEFAULT_OPTIONS = {
        scale : 1
    };

    Differential.prototype = Object.create(Stream.prototype);
    Differential.prototype.constructor = Differential;

    module.exports = Differential;
});