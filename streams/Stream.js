define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var EventMapper = require('famous/events/EventMapper');
    var EventFilter = require('famous/events/EventFilter');
    var EventSplitter = require('famous/events/EventSplitter');
    var nextTickQueue = require('famous/core/nextTickQueue');

    var EVENTS = {
        START : 'start',
        UPDATE : 'update',
        END : 'end'
    };

    function Stream(options){
        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        if (options){
            var start = options.start || Stream.DEFAULT_OPTIONS.start;
            var update = options.update || Stream.DEFAULT_OPTIONS.update;
            var end = options.end || Stream.DEFAULT_OPTIONS.end;

            this._eventInput = new EventHandler();
            this._eventInput.bindThis(this);
            EventHandler.setInputHandler(this, this._eventInput);

            this._eventInput.on(EVENTS.START, start);
            this._eventInput.on(EVENTS.UPDATE, update);
            this._eventInput.on(EVENTS.END, end);
        }
        else EventHandler.setInputHandler(this, this._eventOutput);
    }

    Stream.DEFAULT_OPTIONS = {
        start : function(data){this.emit(EVENTS.START, data)},
        update : function(data){this.emit(EVENTS.UPDATE, data)},
        end : function(data){this.emit(EVENTS.END, data)}
    };

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

    Stream.merge = function(streamObj){
        var count = 0;
        var total = 0;

        var mergedStream = new Stream({
            start : function(data){
                count++;
                total++;
                mergedData[data.streamId] = data;

                nextTickQueue.push(function(){
                    if (count === total){
                        count = 0;
                        mergedStream.emit(EVENTS.START, mergedData);
                    }
                });
            },
            update : function(data){
                count++;

                mergedData[data.streamId] = data;

                if (count === total){
                    count = 0;
                    mergedStream.emit(EVENTS.UPDATE, mergedData);
                }
            },
            end : function(data){
                total--;

                mergedData[data.streamId] = data;

                if (count == total) count = 0;

                if (total === 0)
                    mergedStream.emit(EVENTS.END, mergedData);
            }
        });

        var mergedData = (streamObj instanceof Array) ? [] : {};
        var streams = (streamObj instanceof Array) ? [] : {};

        for (var key in streamObj){
            var stream = streamObj[key];
            streams[key] = stream;
            mergedData[key] = null;

            var mapped = (function(streamId){
                return new EventMapper(function(data){
                    if (data === undefined) data = {};
                    data.streamId = streamId;
                    return data;
                });
            })(key);

            mergedStream.subscribe(mapped).subscribe(stream);
        }

        return mergedStream;
    };

    Stream.lift = function(fn, streams){
        var mergedStream = Stream.merge(streams);
        var mappedStream = new EventMapper(function(data){
            return fn.apply(null, data);
        });

        var liftedStream = new Stream();
        liftedStream.subscribe(mappedStream).subscribe(mergedStream);

        return liftedStream;
    };

    module.exports = Stream;
});
