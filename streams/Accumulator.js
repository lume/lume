define(function(require, exports, module){
    var Stream = require('famous/streams/Stream');
    var postTickQueue = require('famous/core/queues/postTickQueue');

    function Accumulator(){
        this.sum = undefined;
        this.boundEmit = function(){
            this.emit('update', {value : this.sum});
        }.bind(this);

        Stream.call(this, {
            update : function(data){
                var delta = data.delta;

                if (this.sum === undefined) {
                    if (delta instanceof Array){
                        this.sum = [];
                        for (var i = 0; i < delta.length; i++){
                            this.sum[i] = 0;
                        }
                    }
                    else this.sum = 0;
                }

                if (delta instanceof Array){
                    for (var i = 0; i < delta.length; i++){
                        this.sum[i] += delta[i];
                    }
                }
                else this.sum += delta;

                postTickQueue.push(this.boundEmit);
            }.bind(this)
        });
    }

    Accumulator.DEFAULT_OPTIONS = {};

    Accumulator.prototype = Object.create(Stream.prototype);
    Accumulator.prototype.constructor = Accumulator;

    Accumulator.prototype.set = function(sum){
        this.sum = sum;
    };

    Accumulator.prototype.get = function(){
        return this.sum;
    };

    module.exports = Accumulator;
});