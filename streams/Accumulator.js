define(function(require, exports, module){
    var Stream = require('famous/streams/Stream');

    function Accumulator(){
        this.sum = undefined;

        Stream.call(this, {
            update : function(){ return this.sum; }.bind(this)
        });

        this._eventInput.on('start', function(value){
            value = value || 0;
            if (this.sum === undefined) {
                if (value instanceof Array){
                    this.sum = [];
                    for (var i = 0; i < value.length; i++)
                        this.sum[i] = value[i];
                }
                else this.sum = value;
            }
        }.bind(this));

        this._eventInput.on('update', function(value){
            if (value instanceof Array){
                if (!this.sum) this.sum = [];
                for (var i = 0; i < value.length; i++)
                    this.sum[i] += value[i];
            }
            else this.sum += value;
        }.bind(this));
    }

    Accumulator.DEFAULT_OPTIONS = {};

    Accumulator.prototype = Object.create(Stream.prototype);
    Accumulator.prototype.constructor = Accumulator;

    Accumulator.prototype.get = function(){
        return this.sum;
    };

    module.exports = Accumulator;
});
