/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var SimpleStream = require('famous/streams/SimpleStream');
    var Stream = require('famous/streams/Stream');
    var Observable = require('famous/core/Observable');

    function LayoutNode(sources) {
        this.stream = this.createStream(sources);
        this._eventOutput = new EventHandler();

        EventHandler.setOutputHandler(this, this.stream);
    }

    LayoutNode.prototype.createStream = function (sources){
        for (var key in sources){
            var value = sources[key];
            if (typeof value === 'number' || value instanceof Array){
                var source = new Observable(value);
                sources[key] = source;
            }
        }
        return Stream.merge(sources);
    };

    LayoutNode.prototype.set = function(obj){
        for (var key in obj){
            var value = obj[key];

            var source = (value instanceof SimpleStream)
                ? value
                : new Observable(value);

            this.stream.addStream(key, source);
        }
    };

    module.exports = LayoutNode;
});
