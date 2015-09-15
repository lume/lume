/* Copyright © 2015 David Valdman */

/* Documentation in progress. May be outdated. */

define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');
    var EventMapper = require('samsara/events/EventMapper');
    var EventFilter = require('samsara/events/EventFilter');
    var EventSplitter = require('samsara/events/EventSplitter');

    function SimpleStream(){
        EventHandler.apply(this, arguments);
    }

    SimpleStream.prototype = Object.create(EventHandler.prototype);
    SimpleStream.prototype.constructor = SimpleStream;

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
