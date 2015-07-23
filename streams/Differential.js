define(function(require, exports, module){
    var Stream = require('famous/streams/Stream');

    function Differential(options){
        var previous = undefined;

        options = options || {};
        var scale = options.scale || 1;

        Stream.call(this, {
            start : function(value){
                previous = value;
                this.emit('start', {delta : 0});
            }.bind(this),
            update : function(value){
                var delta;

                if (previous instanceof Array){
                    delta = [];
                    for (var i = 0; i < previous.length; i++)
                        delta[i] = scale * (value[i] - previous[i]);
                }
                else delta = scale * (value - previous);

                previous = value;

                this.emit('update', {delta : delta});
            }.bind(this),
            end : function(){
                this.emit('end');
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