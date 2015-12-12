/* Copyright © 2015 David Valdman */

define(function(require, exports, module){
    var Stream = require('../streams/Stream');
    var OptionsManager = require('../core/OptionsManager');

    /**
     * Differential is a Stream that emits differentials of consecutive
     *  input values.
     *
     *  It emits `start`, `update` and `end` events.
     *
     *  @example
     *
     *      var differential = new Differential();
     *      // this gives differentials of mouse input
     *      differential.subscribe(mouseInput.pluck('value'));
     *
     *
     * @class Differential
     * @extends Streams.Stream
     * @uses Core.OptionsManager
     * @namespace Streams
     * @constructor
     * @param [options] {Object}        Options
     * @param [options.scale] {Number}  Scale to apply to differential
     */
    function Differential(options){
        this.options = OptionsManager.setOptions(this, options);

        var previous = undefined;
        var delta = undefined;

        Stream.call(this, {
            update: function () { return delta; }
        });

        this._eventInput.on('start', function(value){ previous = value; });
        this._eventInput.on('update', function(value){
            var scale = this.options.scale;
            if (previous instanceof Array) {
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
