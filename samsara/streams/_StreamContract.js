/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('./SimpleStream');

    function StreamOutput(){
        SimpleStream.call(this);

        this._isActive = false;
        this._cache = null;

        this.on('start', function(data){
            this._isActive = true;
            this._cache = data;
        }.bind(this));

        this.on(['set', 'update'], function(data){
            this._cache = data;
        }.bind(this));

        this.on('end', function(data){
            this._isActive = false;
            this._cache = data;
        }.bind(this));
    }

    StreamOutput.prototype = Object.create(SimpleStream.prototype);
    StreamOutput.prototype.constructor = StreamOutput;

    StreamOutput.prototype.isActive = function(){
        return this._isActive;
    };

    StreamOutput.prototype.get = function(){
        return this._cache;
    };

    module.exports = StreamOutput;
});
