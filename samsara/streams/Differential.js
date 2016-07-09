/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Stream = require('../streams/Stream');
    var OptionsManager = require('../core/_OptionsManager');

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
     * @uses Core._OptionsManager
     * @namespace Streams
     * @constructor
     * @param [options] {Object}        Options
     * @param [options.scale] {Number}  Scale to apply to differential
     */
    function Differential(options){
        this.options = OptionsManager.setOptions(this, options);

        var previous = undefined;
        var delta = undefined;
        var tempDelta = undefined;
        var hasUpdated = false;

        Stream.call(this, {
            update: function () { return delta; }
        });

        this._eventInput.on('start', function (value) {
            hasUpdated = false;
            var scale = this.options.scale;
            if (value instanceof Array){
                if (previous !== undefined){
                    tempDelta = [];
                    for (var i = 0; i < value.length; i++)
                        tempDelta[i] = scale * (value[i] - previous[i]);
                }
                previous = value.slice();
            }
            else {
                if (previous !== undefined)
                    tempDelta = scale * (value - previous);
                previous = value;
            }
        }.bind(this));

        this._eventInput.on('update', function (value) {
            hasUpdated = true;
            var scale = this.options.scale;
            if (previous instanceof Array) {
                delta = [];
                for (var i = 0; i < previous.length; i++) {
                    delta[i] = scale * (value[i] - previous[i]);
                    previous[i] = value[i];
                }
            }
            else {
                delta = scale * (value - previous);
                previous = value;
            }
        }.bind(this));

        this._eventInput.on('end', function(value){
            // Emit update if immediate set called
            if (!hasUpdated && tempDelta !== undefined) {
                this.emit('update', tempDelta);
                previous = value;
            }
        }.bind(this));
    }

    Differential.DEFAULT_OPTIONS = {
        scale : 1
    };

    Differential.prototype = Object.create(Stream.prototype);
    Differential.prototype.constructor = Differential;

    module.exports = Differential;
});
