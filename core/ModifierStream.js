define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var Stream = require('famous/streams/Stream');
    var Observable = require('famous/core/Observable');
    var postTickQueue = require('famous/core/postTickQueue');

    function Modifier(sources) {
        var stream = this.createStream(sources);
        EventHandler.setOutputHandler(this, stream);
    }

    Modifier.prototype.createStream = function (sources){
        for (var key in sources){
            var value = sources[key];
            if (value instanceof Number || value instanceof Array){
                var source = new Observable();
                var value = sources[key];
                sources[key] = source;

                (function(source, value){
                    postTickQueue.push(function(){
                        source.set(value);
                    });
                })(source, value);
            }
        }

        return Stream.merge(sources);
    };

    module.exports = Modifier;
});
