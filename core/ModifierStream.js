define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var Stream = require('famous/streams/Stream');
    var Observable = require('famous/core/Observable');
    var nextTickQueue = require('famous/core/nextTickQueue');
    var dirtyObjects = require('famous/core/dirtyObjects');

    function Modifier(sources) {
        this.stream = this.createStream(sources);
        EventHandler.setOutputHandler(this, this.stream);

        this.on('start', function(){
            dirtyObjects.trigger('dirty');
        });

        this.on('end', function(){
            dirtyObjects.trigger('clean');
        });
    }

    Modifier.prototype.createStream = function (sources){
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

    Modifier.prototype.set = function(obj){
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

    module.exports = Modifier;
});
