define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var EventMapper = require('famous/events/EventMapper');
    var EventFilter = require('famous/events/EventFilter');
    var EventSplitter = require('famous/events/EventSplitter');

    var nextTickQueue = require('famous/core/queues/nextTickQueue');
    var tickQueue = require('famous/core/queues/tickQueue');
    var postTickQueue = require('famous/core/queues/postTickQueue');
    var dirtyQueue = require('famous/core/queues/dirtyQueue');
    var State = require('famous/core/SUE');

    var EVENTS = {
        START : 'start',
        UPDATE : 'update',
        END : 'end',
        RESIZE : 'resize'
    };

    function Stream(options){
        options = options || {};

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        var count = 0;
        var total = 0;

        var hasStarted = false;
        var hasEnded = false;
        var hasUpdated = false;

        if (options.start)
            this._eventInput.on(EVENTS.START, options.start.bind(this));
        else {
            this._eventInput.on(EVENTS.START, function(data){
                hasStarted = true;

                count++;
                total++;

                nextTickQueue.push(function(){
                    if (count == total && hasUpdated == false && hasEnded == false){
                        this.emit(EVENTS.START, data);
                        count = 0;
                    }
                }.bind(this));
            }.bind(this));
        }

        if (options.update)
            this._eventInput.on(EVENTS.UPDATE, options.update.bind(this));
        else {
            this._eventInput.on(EVENTS.UPDATE, function(data){
                hasUpdated = true;
                count++;

                postTickQueue.push(function(){
                    this.emit(EVENTS.UPDATE, data);
                    count = 0;
                }.bind(this));
            }.bind(this));
        }

        if (options.end)
            this._eventInput.on(EVENTS.END, options.end.bind(this));
        else {
            this._eventInput.on(EVENTS.END, function(data){
                hasEnded = true;

                total--;

                dirtyQueue.push(function(){
                    if (total === 0 && hasStarted == true){
                        this.emit(EVENTS.END, data);
                        count = 0;
                        hasEnded = false;
                        hasStarted = false;
                        hasUpdated = false;
                    }
                }.bind(this))
            }.bind(this));
        }

        if (options.resize){
            this._eventInput.on(EVENTS.RESIZE, options.resize.bind(this));
        }
        else {
            this._eventInput.on(EVENTS.RESIZE, function(data){
                var state = State.get();
                var queue;
                if (state == State.STATES.START) queue = nextTickQueue;
                if (state == State.STATES.UPDATE) queue = postTickQueue;

                queue.push(function(){
                    if (hasStarted == false){
                        this.trigger(EVENTS.START, data);
                        dirtyQueue.push(function(){
                            this.trigger(EVENTS.END, data);
                        }.bind(this));
                    }
                    else {
                        nextTickQueue.push(function(){
                            this.trigger(EVENTS.UPDATE, data);
                        }.bind(this));
                    }
                }.bind(this))

            }.bind(this))
        }
    }

    Stream.prototype.map = function(fn){
        var stream = new Stream();
        var mapper = new EventMapper(fn);
        stream.subscribe(mapper).subscribe(this);
        return stream;
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

        var hasStarted = false;
        var hasUpdated = false;
        var hasEnded = false;

        var mergedStream = new Stream({
            start : function(){
                hasStarted = true;

                count++;
                total++;

                nextTickQueue.push(function(){
                    if (count == total && hasUpdated == false && hasEnded == false){
                        this.emit(EVENTS.START, mergedData);
                        count = 0;
                    }
                }.bind(mergedStream));
            },
            update : function(){
                hasUpdated = true;
                count++;

                postTickQueue.push(function(){
                    if (count == total) {
                        this.emit(EVENTS.UPDATE, mergedData);
                        count = 0;
                    }
                }.bind(mergedStream));
            },
            end : function(){
                hasEnded = true;

                total--;

                dirtyQueue.push(function(){
                    if (total === 0 && hasStarted == true){
                        this.emit(EVENTS.END, mergedData);
                        count = 0;
                        hasEnded = false;
                        hasStarted = false;
                        hasUpdated = false;
                    }
                }.bind(mergedStream))
            },
            resize : function(){
                var state = State.get();
                var queue;
                if (state == State.STATES.START) queue = nextTickQueue;
                if (state == State.STATES.UPDATE) queue = postTickQueue;

                queue.push(function(){
                    if (hasStarted == false){
                        mergedStream.trigger(EVENTS.START, mergedData);
                        dirtyQueue.push(function(){
                            this.trigger(EVENTS.END, mergedData);
                        }.bind(mergedStream));
                    }
                    else {
                        postTickQueue.push(function(){
                            this.trigger(EVENTS.UPDATE, mergedData);
                        }.bind(mergedStream));
                    }
                }.bind(mergedStream));
            }
        });

        var mergedData = (streamObj instanceof Array) ? [] : {};

        mergedStream.addStream = function(key, stream){
            mergedData[key] = undefined;
            var mapper = (function(key){
                return new EventMapper(function(data){
                    mergedData[key] = data;
                    return mergedData;
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
