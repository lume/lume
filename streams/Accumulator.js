define(function(require, exports, module){
    var Stream = require('famous/streams/Stream');
    var postTickQueue = require('famous/core/queues/postTickQueue');

    function Accumulator(){
        var sum = undefined;

        Stream.call(this, {
            start : function(value){
                value = value || 0;
                if (sum === undefined) {
                    if (value instanceof Array){
                        sum = [];
                        for (var i = 0; i < value.length; i++)
                            sum[i] = 0;
                    }
                    else sum = value;
                }
                this.emit('start', sum);
            }.bind(this),
            update : function(value){
                if (value instanceof Array){
                    for (var i = 0; i < value.length; i++)
                        sum[i] += value[i];
                }
                else sum += value;

                this.emit('update', sum);
            }.bind(this)
        });
    }

    Accumulator.DEFAULT_OPTIONS = {};

    Accumulator.prototype = Object.create(Stream.prototype);
    Accumulator.prototype.constructor = Accumulator;

    module.exports = Accumulator;
});