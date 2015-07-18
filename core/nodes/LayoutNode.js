/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var SimpleStream = require('famous/streams/SimpleStream');
    var Stream = require('famous/streams/Stream');
    var Observable = require('famous/core/Observable');
    var nextTickQueue = require('famous/core/queues/nextTickQueue');
    var dirtyObjects = require('famous/core/dirtyObjects');

    function LayoutNode(sources) {
        this.stream = this.createStream(sources);
        this._eventOutput = new EventHandler();

        EventHandler.setOutputHandler(this, this._eventOutput);

        //TODO: can eventOutput just be the stream
        this.stream.on('start', function(data){
            dirtyObjects.trigger('dirty');
            this._eventOutput.emit('start', data);
        }.bind(this));

        this.stream.on('update', function(data){
           this._eventOutput.emit('update', data)
        }.bind(this));

        this.stream.on('end', function(data){
            this._eventOutput.emit('end', data);
            dirtyObjects.trigger('clean');
        }.bind(this));
    }

    LayoutNode.prototype.createStream = function (sources){
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

        return Stream.merge(sources);
    };

    LayoutNode.prototype.set = function(obj){
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
        }
    };

    module.exports = LayoutNode;
});
