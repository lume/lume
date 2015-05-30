define(function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var EventHandler = require('famous/core/EventHandler');
    var EventMapper = require('famous/events/EventMapper');
    var Stream = require('famous/streams/Stream');
    var Observable = require('famous/core/Observable');

    function Modifier(sources) {
        this.result = {};
        var stream = this.createStream(sources);

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

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

    Modifier.prototype.createStream = function (sources){
        for (var key in sources){
            var value = sources[key];
            if (value instanceof Number || value instanceof Array){
                this.result[key] = value;
                delete sources[key];
            }
            else this.result[key] = value.get();
        }

        return Stream.merge(sources);
    };

    Modifier.prototype.get = function(){
        return this.result;
    };

    module.exports = Modifier;
});
