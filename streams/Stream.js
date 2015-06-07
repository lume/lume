define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var EventMapper = require('famous/events/EventMapper');
    var EventFilter = require('famous/events/EventFilter');
    var EventSplitter = require('famous/events/EventSplitter');
    var postTickQueue = require('famous/core/postTickQueue');

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

    Stream.merge = function(streamObj, queue){
        var count = 0;
        var total = 0;
        var update = false;

        if (queue === undefined) queue = postTickQueue;

        var mergedStream = new Stream({
            start : function(){
                count++;
                total++;
                update = false;

                queue.push(function(){
                    if (!update && count === total){
                        count = 0;
                        mergedStream.emit(EVENTS.START, mergedData);
                    }
                });
            },
            update : function(){
                count++;
                update = true;

                if (count === total){
                    count = 0;
                    mergedStream.emit(EVENTS.UPDATE, mergedData);
                }
            },
            end : function(){
                total--;

                if (total === 0){
                    count = 0;
                    mergedStream.emit(EVENTS.END, mergedData);
                }
            }
        });

        var mergedData = (streamObj instanceof Array) ? [] : {};

        mergedStream.addStream = function(key, stream){
            mergedData[key] = undefined;
            var mapper = (function(key){
                return new EventMapper(function(data){
                    mergedData[key] = data;
                });
            })(key);

            mergedStream.subscribe(mapper).subscribe(stream);
        };

        for (var key in streamObj){
            var stream = streamObj[key];
            mergedStream.addStream(key, stream);
        }

        return mergedStream;
    };

    Stream.lift = function(fn, streams, queue){
        //TODO: fix comma separated arguments
        var mergedStream = (streams instanceof Array)
            ? Stream.merge(streams, queue)
            : Stream.merge.apply(null, Array.prototype.splice.call(arguments, 1));

        var mappedStream = new EventMapper(function(data){
            return fn.apply(null, data);
        });

        var liftedStream = new Stream();
        liftedStream.subscribe(mappedStream).subscribe(mergedStream);

        return liftedStream;
    };

    module.exports = Stream;
});
