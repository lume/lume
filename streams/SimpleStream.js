define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var EventMapper = require('famous/events/EventMapper');
    var EventFilter = require('famous/events/EventFilter');
    var EventSplitter = require('famous/events/EventSplitter');

    function SimpleStream(){
        this._eventIO = new EventHandler();
        EventHandler.setInputHandler(this, this._eventIO);
        EventHandler.setOutputHandler(this, this._eventIO);
    }

    SimpleStream.prototype.map = function(fn){
        var stream = new SimpleStream();
        var mapper = new EventMapper(fn);
        stream.subscribe(mapper).subscribe(this);
        return stream;
    };

    SimpleStream.prototype.filter = function(fn){
        var filter = new EventFilter(fn);
        var filteredStream = new SimpleStream();
        filteredStream.subscribe(filter).subscribe(this);
        return filteredStream;
    };

    SimpleStream.prototype.split = function(fn){
        var splitter = new EventSplitter(fn);
        var splitStream = new SimpleStream();
        splitStream.subscribe(splitter).subscribe(this);
        return splitStream;
    };

    SimpleStream.prototype.pluck = function(key){
        return this.map(function(value){
            return value[key];
        });
    };

    //TODO: can this be inherited by other streams?
    SimpleStream.merge = function(){};

    SimpleStream.lift = function(fn, streams){
        //TODO: fix comma separated arguments
        var mergedStream = (streams instanceof Array)
            ? this.merge(streams)
            : this.merge.apply(null, Array.prototype.splice.call(arguments, 1));

        var mappedStream = new EventMapper(function liftMap(data){
            return fn.apply(null, data);
        });

        var liftedStream = new SimpleStream();
        liftedStream.subscribe(mappedStream).subscribe(mergedStream);

        return liftedStream;
    };

    module.exports = SimpleStream;
});
