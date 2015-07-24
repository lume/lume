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

        var count = 0;
        var total = 0;
        var hasUpdated = false;

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

                count++;
                total++;
                (function(currentCount){
                    nextTickQueue.push(function streamStart(){
                        if (currentCount == total && !hasUpdated){
                            self.emit(EVENTS.START, data);
                            count = 0;
                        }
                    });
                })(count)

            }.bind(this));
        }

        if (options.update)
            this._eventInput.on(EVENTS.UPDATE, options.update.bind(this));
        else {
            this._eventInput.on(EVENTS.UPDATE, function(data){
                hasUpdated = true;
                count++;

                postTickQueue.push(function streamUpdate(){
                    self.emit(EVENTS.UPDATE, data);
                    count = 0;
                });
            });
        }

        if (options.end)
            this._eventInput.on(EVENTS.END, options.end.bind(this));
        else {
            this._eventInput.on(EVENTS.END, function(data){
                dirtyQueue.push(function streamEnd(){
                    total--;
                    if (total === 0){
                        self.emit(EVENTS.END, data);
                        count = 0;
                        hasUpdated = false;
                    }
                })
            });
        }

        if (options.resize)
            this._eventInput.on(EVENTS.RESIZE, options.resize.bind(this));
        else {
            this._eventInput.on(EVENTS.RESIZE, function(data){
                var state = State.get();

                if (state == State.STATES.START){
                    nextTickQueue.push(function(){
                        self.trigger(EVENTS.START, data);
                        dirtyQueue.push(function streamResize(){
                            self.trigger(EVENTS.END, data);
                        });
                    });
                }
                else {
                    this.trigger(EVENTS.UPDATE, data);
                }

            }.bind(this))
        }
    }

    Stream.prototype = Object.create(SimpleStream.prototype);
    Stream.prototype.constructor = Stream;

    Stream.lift = SimpleStream.lift;

    Stream.merge = function(streamObj){
        var count = 0;
        var total = 0;
        var hasUpdated = false;

        var mergedStream = new Stream({
            start : function(mergedData){
                count++;
                total++;

                (function(currentCount){
                    nextTickQueue.push(function mergedStreamStart(){
                        if (currentCount == total && !hasUpdated){
                            mergedStream.emit(EVENTS.START, mergedData);
                            count = 0;
                        }
                    });
                })(count);
            },
            update : function(mergedData){
                count++;
                hasUpdated = true;
                (function(currentCount){
                    postTickQueue.push(function mergedStreamUpdate(){
                        if (currentCount == total) {
                            mergedStream.emit(EVENTS.UPDATE, mergedData);
                            count = 0;
                        }
                    });
                })(count)
            },
            end : function(mergedData){
                dirtyQueue.push(function mergedStreamEnd(){
                    total--;
                    count--;
                    if (total === 0){
                        mergedStream.emit(EVENTS.END, mergedData);
                        count = 0;
                        hasUpdated = false;
                    }
                });
            },
            resize : function(mergedData){
                var state = State.get();

                if (state == State.STATES.START){
                    nextTickQueue.push(function mergedStreamResizeStart(){
                        mergedStream.trigger(EVENTS.START, mergedData);
                        dirtyQueue.push(function mergedStreamResizeEnd(){
                            mergedStream.trigger(EVENTS.END, mergedData);
                        });
                    });
                }
                else {
                    this.trigger(EVENTS.UPDATE, mergedData);
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
