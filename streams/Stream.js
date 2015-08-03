define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var EventMapper = require('famous/events/EventMapper');
    var SimpleStream = require('famous/streams/SimpleStream');
    var dirtyObjects = require('famous/core/dirtyObjects');

    var nextTickQueue = require('famous/core/queues/nextTickQueue');
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
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        options = options || {};

        var batchCount = 0;
        var batchTotal = 0;
        var total = 0;

        //TODO: emit result of given function instead of data

        var self = this;

        var dirty = false;
        this._eventInput.on('start', function(){
            if (dirty) return;
            dirtyObjects.trigger('dirty');
            dirty = true;
        });

        this._eventInput.on('end', function(){
            if (!dirty) return;
            dirtyObjects.trigger('clean');
            dirty = false;
        });

        if (options.start)
            this._eventInput.on(EVENTS.START, options.start.bind(this));
        else {
            this._eventInput.on(EVENTS.START, function(data){
                batchCount++;
                batchTotal++;
                total++;
                (function(currentCount){
                    nextTickQueue.push(function streamStart(){
                        if (currentCount == batchTotal){
                            self.emit(EVENTS.START, data);
                            batchCount = 0;
                            batchTotal = 0;
                        }
                    });
                })(batchCount)

            }.bind(this));
        }

        if (options.update)
            this._eventInput.on(EVENTS.UPDATE, options.update.bind(this));
        else {
            this._eventInput.on(EVENTS.UPDATE, function(data){
                self.emit(EVENTS.UPDATE, data);
            });
        }

        if (options.end)
            this._eventInput.on(EVENTS.END, options.end.bind(this));
        else {
            this._eventInput.on(EVENTS.END, function(data){
                batchCount++;
                batchTotal++;
                total--;
                (function(currentCount){
                    dirtyQueue.push(function streamEnd(){
                        if (currentCount === batchTotal && total == 0){
                            self.emit(EVENTS.END, data);
                            batchCount = 0;
                            batchTotal = 0;
                        }
                    });
                })(batchCount);
            });
        }

        if (options.resize)
            this._eventInput.on(EVENTS.RESIZE, options.resize.bind(this));
        else {
            this._eventInput.on(EVENTS.RESIZE, function(data){
                switch (State.get()){
                    case State.STATES.START:
                        self.trigger(EVENTS.START, data);
                        break;
                    case State.STATES.UPDATE:
                        self.trigger(EVENTS.UPDATE, data);
                        break;
                    case State.STATES.END:
                        self.trigger(EVENTS.END, data);
                        break;
                }
            });
        }
    }

    Stream.prototype = Object.create(SimpleStream.prototype);
    Stream.prototype.constructor = Stream;

    Stream.lift = SimpleStream.lift;

    Stream.merge = function(streamObj){
        var batchCount = 0;
        var batchTotal = 0;
        var total = 0;

        var mergedStream = new Stream({
            start : function(mergedData){
                total++;
                batchCount++;
                batchTotal++;

                (function(currentCount){
                    nextTickQueue.push(function mergedStreamStart(){
                        if (currentCount == batchTotal){
                            mergedStream.emit(EVENTS.START, mergedData);
                            batchCount = 0;
                            batchTotal = 0;
                        }
                    });
                })(batchCount);
            },
            update : function(mergedData){
                batchCount++;
                batchTotal++;
                (function(currentCount){
                    postTickQueue.push(function mergedStreamUpdate(){
                        if (currentCount == batchTotal) {
                            mergedStream.emit(EVENTS.UPDATE, mergedData);
                            batchCount = 0;
                            batchTotal = 0;
                        }
                    });
                })(batchCount);
            },
            end : function(mergedData){
                total--;
                batchCount++;
                batchTotal++;

                (function(currentCount){
                    dirtyQueue.push(function mergedStreamEnd(){
                        if (currentCount == batchTotal && total === 0){
                            mergedStream.emit(EVENTS.END, mergedData);
                            batchCount = 0;
                            batchTotal = 0;
                        }
                    });
                })(batchCount);
            },
            resize : function(mergedData){
                switch (State.get()){
                    case State.STATES.START:
//                        mergedStream.trigger(EVENTS.START, mergedData);
                        break;
                    case State.STATES.UPDATE:
                        mergedStream.trigger(EVENTS.UPDATE, mergedData);
                        break;
                    case State.STATES.END:
//                        mergedStream.trigger(EVENTS.END, mergedData);
                        break;
                }
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

    module.exports = Stream;
});
