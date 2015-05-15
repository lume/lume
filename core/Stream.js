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
        this.source = null;
        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.typeFilter = new EventFilter(function(type){
            return types[type];
        });

        this.antiTypeFilter = new EventFilter(function(type){
            return !types[type];
        });
    }

    Stream.prototype.get = function(){
        return this.source.get();
    };

    Stream.prototype.map = function(fn){
        var mappedStream = new Stream();
        var mapper = new EventMapper(fn);
        mappedStream.subscribe(mapper).subscribe(this.typeFilter).subscribe(this);
        mappedStream.subscribe(this.antiTypeFilter).subscribe(this);

        mappedStream.source = {
            get : function(){
                return fn(this.source.get());
            }.bind(this)
        };

        return mappedStream;
    };

    Stream.prototype.filter = function(fn){
        var filter = new EventFilter(fn);
        var filteredStream = new Stream();
        filteredStream.subscribe(filter).subscribe(this);
        filteredStream.source = this.source;
        return filteredStream;
    };

    Stream.prototype.split = function(fn){
        var splitter = new EventSplitter(fn);
        var splitStream = new Stream();
        splitStream.subscribe(splitter).subscribe(this);
        splitStream.source = this.source;
        return splitStream;
    };

    Stream.prototype.pluck = function(key){
        return this.map(function(value){
            return value[key];
        });
    };

    Stream.prototype.subscribe = function(source){
        if (source.get instanceof Function) this.source = source;
        return EventHandler.prototype.subscribe.apply(this._eventOutput, arguments);
    };

    Stream.prototype.unsubscribe = function(source){
        if (source.get instanceof Function) this.source = null;
        return EventHandler.prototype.unsubscribe.apply(this._eventOutput, arguments);
    };

    module.exports = Stream;
});
