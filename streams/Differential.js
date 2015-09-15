/* Copyright © 2015 David Valdman */

/* Documentation in progress. May be outdated. */

define(function(require, exports, module){
    var Stream = require('samsara/streams/Stream');
    var OptionsManager = require('samsara/core/OptionsManager');

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
