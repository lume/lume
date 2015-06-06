define(function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var EventHandler = require('famous/core/EventHandler');
    var EventMapper = require('famous/events/EventMapper');
    var Stream = require('famous/streams/Stream');
    var postTickQueue = require('famous/core/postTickQueue');
    var dirtyQueue = require('famous/core/dirtyQueue');

    function Modifier(sources) {
        this.result = {};

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        var stream = this.createStream(sources);

        if (stream){
            var mapper = new EventMapper(function(data){
                for (var key in data){
                    this.result[key] = data[key].value;
                }
                return this.result;
            }.bind(this));

            this._eventOutput
                .subscribe(mapper)
                .subscribe(stream);
        }
    }

    Modifier.prototype.createStream = function (sources){
        for (var key in sources){
            var value = sources[key];
            if (value instanceof Number || value instanceof Array){
                this.result[key] = value;
                delete sources[key];
            }
        }

        if (Object.keys(sources).length == 0){
            postTickQueue.push(function(){
                this.emit('start', this.result);
            }.bind(this));

            dirtyQueue.push(function(){
                this.emit('end', this.result);
            }.bind(this));

            return false;
        }

        return Stream.merge(sources);
    };

    module.exports = Modifier;
});
