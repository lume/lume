/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');
    var SimpleStream = require('samsara/streams/SimpleStream');
    var ResizeStream = require('samsara/streams/ResizeStream');
    var SizeObservable = require('samsara/core/SizeObservable');

    function SizeNode(sources) {
        this.stream = this.createStream(sources);
        this._eventInput = new EventHandler();

        this.stream._eventInput.on('start', function(data){
            this.stream.trigger('resize', data);
        }.bind(this));

        this.stream._eventInput.on('update', function(data){
            this.stream.trigger('resize', data);
        }.bind(this));

        this.stream._eventInput.on('end', function(data){
            this.stream.trigger('resize', data);
        }.bind(this));

        EventHandler.setInputHandler(this, this.stream);
        EventHandler.setOutputHandler(this, this.stream);
    }

    SizeNode.prototype.createStream = function (sources){
        for (var key in sources){
            var value = sources[key];
            if (typeof value == 'number' || value instanceof Array){
                var source = new SizeObservable(value);
                sources[key] = source;
            }
        }
        return ResizeStream.merge(sources);
    };

    SizeNode.prototype.set = function(obj){
        for (var key in obj){
            var value = obj[key];

            var source = (value instanceof SimpleStream)
                ? value
                : new SizeObservable(value);

            this.stream.addStream(key, source);
        }
    };

    module.exports = SizeNode;
});
