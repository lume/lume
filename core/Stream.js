define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var EventMapper = require('famous/events/EventMapper');
    var EventFilter = require('famous/events/EventFilter');
    var EventSplitter = require('famous/events/EventSplitter');

    var types = {
        start : true,
        update : true,
        end : true
    };

    function Stream(){
        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.typeFilter = new EventFilter(function(type){
            return types[type];
        });
    }

    Stream.prototype.map = function(fn){
        var mappedStream = new Stream();
        var mapper = new EventMapper(fn);
        mappedStream.subscribe(mapper).subscribe(this);
        return mappedStream;
    };

    Stream.prototype.filter = function(fn){
        var filter = new EventFilter(fn);
        var filteredStream = new Stream();
        filteredStream.subscribe(filter).subscribe(this);
        return filteredStream;
    };

    Stream.prototype.split = function(fn){
        var splitter = new EventSplitter(fn);
        var splitStream = new Stream();
        splitStream.subscribe(splitter).subscribe(this);
        return splitStream;
    };

    Stream.prototype.pluck = function(key){
        return this.map(function(value){
            return value[key];
        });
    };

    module.exports = Stream;
});
