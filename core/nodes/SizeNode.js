/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var SimpleStream = require('famous/streams/SimpleStream');
    var ResizeStream = require('famous/streams/ResizeStream');
    var Observable = require('famous/core/Observable');
    var nextTickQueue = require('famous/core/queues/nextTickQueue');

    function SizeNode(sources) {
        this.stream = this.createStream(sources);
        this._eventOutput = new EventHandler();

        EventHandler.setOutputHandler(this, this._eventOutput);

        this.stream.on('resize', function(data){
            this._eventOutput.emit('resize', data);
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

            if (value instanceof SimpleStream)
                source = value;
            else {
                var source = new Observable();

                (function(source, value){
                    nextTickQueue.push(function(){
                        source.set(value);
                    });
                })(source, value);
            }

            this.stream.addStream(key, source);
        }
    };

    module.exports = SizeNode;
});
