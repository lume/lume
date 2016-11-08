/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('./SimpleStream');

    function StreamContract(output){
        this._isActive = false;
        this._cache = null;

        this._eventOutput = output || new EventHandler();

        this._eventOutput.on('start', function(data){
            this._isActive = true;
            this._cache = data;
        }.bind(this));

        this._eventOutput.on(['set', 'update'], function(data){
            this._cache = data;
        }.bind(this));

        this._eventOutput.on('end', function(data){
            this._isActive = false;
            this._cache = data;
        }.bind(this));
    }

    StreamContract.prototype = Object.create(SimpleStream.prototype);
    StreamContract.prototype.constructor = StreamContract;

    StreamContract.prototype.isActive = function(){
        return this._isActive;
    };

    StreamContract.prototype.get = function(){
        return this._cache;
    };

    StreamContract.prototype.emit = function(type, data){
        return EventHandler.prototype.emit.apply(this._eventOutput, arguments);
    };

    StreamContract.prototype.on = function(type, handler){
        return EventHandler.prototype.on.apply(this._eventOutput, arguments);
    };

    StreamContract.prototype.off = function(type, handler){
        return EventHandler.prototype.off.apply(this._eventOutput, arguments);
    };

    module.exports = StreamContract;
});
