define(function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var EventHandler = require('famous/core/EventHandler');
    var EventMapper = require('famous/events/EventMapper');
    var Stream = require('famous/streams/Stream');
    var Observable = require('famous/core/Observable');
    var postTickQueue = require('famous/core/postTickQueue');
    var dirtyQueue = require('famous/core/dirtyQueue');

    function Modifier(sources) {
        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        var stream = this.createStream(sources);
        this._eventOutput.subscribe(stream);
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
