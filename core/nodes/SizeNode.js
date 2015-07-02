/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var ResizeStream = require('famous/streams/ResizeStream');
    var Observable = require('famous/core/Observable');
    var tickQueue = require('famous/core/queues/tickQueue');
    var nextTickQueue = require('famous/core/queues/nextTickQueue');
    var postTickQueue = require('famous/core/queues/postTickQueue');
    var dirtyObjects = require('famous/core/dirtyObjects');
    var dirtyQueue = require('famous/core/queues/dirtyQueue');

    function SizeNode(sources) {
        this.stream = this.createStream(sources);
        this._eventOutput = new EventHandler();

        EventHandler.setOutputHandler(this, this._eventOutput);

        var hasResized = false;

        this.stream.on('start', function(data){
//            if (!hasResized){
                dirtyObjects.trigger('dirty');
                this._eventOutput.emit('resize', data);
                hasResized = true;
//            }
        }.bind(this));

        this.stream.on('resize', function(data){
            this._eventOutput.emit('resize', data);
        }.bind(this));

        this.stream.on('end', function(data){
//            if (hasResized) {
                dirtyObjects.trigger('clean');
                hasResized = false;
//            }
        }.bind(this));
    }

    SizeNode.prototype.createStream = function (sources){
        for (var key in sources){
            var value = sources[key];
            if (value instanceof Number || value instanceof Array){
                var source = new Observable();
                var value = sources[key];
                sources[key] = source;

                (function(source, value){
                    nextTickQueue.push(function(){
                        source.set(value);
                    });
                })(source, value);
            }
        }

        return ResizeStream.merge(sources);
    };

    SizeNode.prototype.set = function(obj){
        for (var key in obj){
            var value = obj[key];
            var source = new Observable();

            (function(source, value){
                nextTickQueue.push(function(){
                    source.set(value);
                });
            })(source, value);

            this.stream.addStream(key, source)
        }
    };

    module.exports = SizeNode;
});
