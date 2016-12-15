/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('./SimpleStream');
    var preTickQueue = require('../core/queues/preTickQueue');
    var nextTick = require('../core/queues/nextTick');

    function StreamInput(){
        SimpleStream.call(this);
    }

    StreamInput.prototype = Object.create(SimpleStream.prototype);
    StreamInput.prototype.constructor = StreamInput;

    StreamInput.prototype.subscribe = function(source){
        var success = EventHandler.prototype.subscribe.apply(this, arguments);
        if (success) {
            if (source.isActive && source.isActive()) {
                preTickQueue.push(function(){
                    this.trigger('start', source.get());
                }.bind(this));
            }
            return source;
        }

        return success;
    };

    StreamInput.prototype.unsubscribe = function(source){
            if (!source){
            for (var i = 0; i < this.upstream.length; i++){
                var source = this.upstream[i]
                this.unsubscribe(source)
            }
            return true;
        }

        var success = EventHandler.prototype.unsubscribe.apply(this, arguments);
        if (success) {
            if (source.isActive && source.isActive()) {
                preTickQueue.push(function(){
                    this.trigger('end', source.get());
                }.bind(this));
            }
            return source;
        }

        return success;
    };

    module.exports = StreamInput;
});
