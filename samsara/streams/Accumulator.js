/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var OptionsManager = require('../core/_OptionsManager');
    var Stream = require('../streams/Stream');
    var preTickQueue = require('../core/queues/preTickQueue');
    var dirtyQueue = require('../core/queues/dirtyQueue');

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

        Stream.call(this, {
            start : function(){ return this.sum || 0; }.bind(this),
            update : function(){ return this.sum; }.bind(this),
            end : function(){ return this.sum || 0; }.bind(this)
        });

        // TODO: is `start` event necessary?
        this._eventInput.on('start', function(value){
            if (this.sum !== undefined) return;
            if (value instanceof Array) {
                this.sum = [];
                for (var i = 0; i < value.length; i++)
                    this.sum[i] = clamp(value[i], this.options.min, this.options.max);
            }
            else this.sum = clamp(value, this.options.min, this.options.max);
        }.bind(this));

        this._eventInput.on('update', function(delta){
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
        }.bind(this));
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
            self.trigger('start', sum);
            dirtyQueue.push(function(){
                self.trigger('end', sum);
            });
        })
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
