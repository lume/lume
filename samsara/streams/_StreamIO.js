/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('./SimpleStream');
    var StreamInput = require('./_StreamInput');
    var preTickQueue = require('../core/queues/preTickQueue');
    var nextTick = require('../core/queues/nextTick');

    function StreamIO(){
        SimpleStream.call(this);

        this._isActive = false;
        this._cache = null;

        this.on('start', function(data){
            this._isActive = true;
            this._cache = data;
        }.bind(this));

        this.on('update', function(data){
            this._isActive = true;
            this._cache = data;
        }.bind(this));

        this.on('set', function(data){
            nextTick.push(function(){
                this._isActive = false;
            }.bind(this));
            this._cache = data;
        }.bind(this));

        this.on('end', function(data){
            this._isActive = false;
            this._cache = data;
        }.bind(this));
    }

    StreamIO.prototype = Object.create(SimpleStream.prototype);
    StreamIO.prototype.constructor = StreamIO;

    StreamIO.prototype.isActive = function(){
        return this._isActive;
    };

    StreamIO.prototype.get = function(){
        return this._cache;
    };

    StreamIO.prototype.subscribe = function(source, silent){
        return StreamInput.prototype.subscribe.apply(this, arguments);
    };

    StreamIO.prototype.unsubscribe = function(source, silent){
        return StreamInput.prototype.unsubscribe.apply(this, arguments);
    };

    module.exports = StreamIO;
});
