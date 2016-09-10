/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var OptionsManager = require('../core/_OptionsManager');
    var Stream = require('../streams/Stream');
    var preTickQueue = require('../core/queues/preTickQueue');

    /**
     * Accumulator is a Stream that accumulates a value given by a
     *  number or array of numbers.
     *
     *  It emits `start`, `update` and `end` events.
     *
     *  @example
     *
     *      var accumulator = new Accumulator(0);
     *
     *      // this gives the total displacement of mouse input
     *      accumulator.subscribe(mouseInput.pluck('delta'));
     *
     *
     * @class Accumulator
     * @extends Streams.Stream
     * @uses Core._OptionsManager
     * @namespace Streams
     * @constructor
     * @param [sum] {Number|Array}    Initial value
     * @param [options] {Object}      Options
     * @param [options.min] {Number}  Set a minimum value
     * @param [options.max] {Number}  Set a maximum value
     */
    function Accumulator(sum, options){
        this.options = OptionsManager.setOptions(this, options);

        // TODO: is this state necessary?
        this.sum = undefined;

        if (sum !== undefined) this.set(sum);

        Stream.call(this,{
            in : {
                set: set.bind(this),
                start: start.bind(this),
                update: update.bind(this),
                end: function(data){
                    console.log('fuck')
                    debugger
                    return data;
                }
            },
            out : {
                set : function(){
                    // console.log('set', this.sum)
                    return this.sum || 0;
                }.bind(this),
                start : function(){
                    // console.log('start', this.sum)
                    return this.sum || 0;
                }.bind(this),
                update : function(){
                    // console.log('update', this.sum)
                    return this.sum;
                }.bind(this),
                end : function(){
                    // console.log('end', this.sum)
                    return this.sum || 0;
                }.bind(this)
            }
        });

        // TODO: is `start` event necessary?
        function set(value){
            if (value instanceof Array) {
                this.sum = [];
                for (var i = 0; i < value.length; i++)
                    this.sum[i] = clamp(value[i], this.options.min, this.options.max);
            }
            else this.sum = clamp(value, this.options.min, this.options.max);
        };

        function start(value){
            if (this.sum !== undefined) return;
            if (value instanceof Array) {
                this.sum = [];
                for (var i = 0; i < value.length; i++)
                    this.sum[i] = clamp(value[i], this.options.min, this.options.max);
            }
            else this.sum = clamp(value, this.options.min, this.options.max);
        };

        function update(delta){
            if (delta instanceof Array){
                for (var i = 0; i < delta.length; i++){
                    this.sum[i] += delta[i];
                    this.sum[i] = clamp(this.sum[i], this.options.min, this.options.max);
                }
            }
            else {
                this.sum += delta;
                this.sum = clamp(this.sum, this.options.min, this.options.max);
            }
        };
    }

    Accumulator.prototype = Object.create(Stream.prototype);
    Accumulator.prototype.constructor = Accumulator;

    Accumulator.DEFAULT_OPTIONS = {
        min : -Infinity,
        max :  Infinity
    };

    function clamp(value, min, max){
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Set accumulated value.
     *
     * @method set
     * @param sum {Number}              Current value
     * @param [silent=false] {Boolean}  Flag to suppress events
     */
    Accumulator.prototype.set = function(sum, silent){
        this.sum = sum;
        if (silent === true) return;
        var self = this;
        preTickQueue.push(function(){
            self.trigger('set', sum);
        });
    };

    /**
     * Returns current accumulated value.
     *
     * @method get
     * @return {Number}
     */
    Accumulator.prototype.get = function(){
        return this.sum;
    };

    module.exports = Accumulator;
});
