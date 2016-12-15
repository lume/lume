/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module){
    var Stream = require('./Stream');
    var SimpleStream = require('./SimpleStream');
    var StreamInput = require('./_StreamInput');
    var StreamOutput = require('./_StreamContract');

    function ReduceStream(reducer, stream, extras){
        this._input = new StreamInput();

        var sources = [this._input, stream];
        if (extras) sources = sources.concat(extras);

        this._output = Stream.lift(reducer, sources);

        this.position = new StreamOutput();
    }

    ReduceStream.prototype = Object.create(SimpleStream.prototype);
    ReduceStream.prototype.constructor = ReduceStream;

    ReduceStream.prototype.subscribe = function(source){
        return StreamInput.prototype.subscribe.apply(this._input, arguments);
    };

    ReduceStream.prototype.unsubscribe = function(source){
        return StreamInput.prototype.unsubscribe.apply(this._input, arguments);
    };

    ReduceStream.prototype.trigger = function(){
        return StreamInput.prototype.trigger.apply(this._input, arguments);
    };

    ReduceStream.prototype.emit = function(){
        return StreamOutput.prototype.emit.apply(this._output, arguments);
    };

    ReduceStream.prototype.on = function(){
        return StreamOutput.prototype.on.apply(this._output, arguments);
    };

    ReduceStream.prototype.off = function(){
        return StreamOutput.prototype.off.apply(this._output, arguments);
    };

    ReduceStream.prototype.isActive = function(){
        return StreamOutput.prototype.isActive.apply(this._output, arguments);
    };

    ReduceStream.prototype.get = function(){
        return StreamOutput.prototype.get.apply(this._output, arguments);
    };

    ReduceStream.prototype.setMap = function(map){
        this._output.setMap(map);
    };

    module.exports = ReduceStream;
});
