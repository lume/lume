define(function(require, exports, module) {
    var SimpleStream = require('famous/streams/SimpleStream');
    var EventMapper = require('famous/events/EventMapper');
    var EventHandler = require('famous/core/EventHandler');
    var dirtyObjects = require('famous/core/dirtyObjects');

    var nextTickQueue = require('famous/core/queues/nextTickQueue');
    var postTickQueue = require('famous/core/queues/postTickQueue');
    var dirtyQueue = require('famous/core/queues/dirtyQueue');
    var State = require('famous/core/SUE');

    var EVENTS = {
        START : 'start',
        UPDATE : 'update',
        RESIZE : 'resize',
        END : 'end'
    };

    //listens to start/update/end/resize
    //emits only resize

    function ResizeStream(){
        var total = 0;
        var batchCount = 0; // progress of firings in each round of start/update/end
        var batchTotal = 0; // total firings in each round of start/update/end

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        var self = this;
        var dirty = false;

        this._eventInput.on(EVENTS.RESIZE, function(data){
            var state = State.get();

            if (state === State.STATES.START) {
                batchCount++;
                batchTotal++;
                total++;

                if (!dirty) dirtyObjects.trigger('dirty');
                dirty = true;

                (function(currentCount) {
                    nextTickQueue.push(function ResizeStreamStart() {
                        if (currentCount == batchTotal) {
                            batchCount = 0;
                            batchTotal = 0;
                            self.emit(EVENTS.RESIZE, data);
                            dirtyQueue.push(function () {
                                self.trigger(EVENTS.END, data);
                            });
                        }
                    });
                })(batchCount);
            }
            else if (state === State.STATES.UPDATE){
                batchCount++;
                batchTotal++;
                (function(currentCount){
                    postTickQueue.push(function ResizeStreamResize() {
                        if (currentCount == batchTotal) {
                            self.emit(EVENTS.RESIZE, data);
                            batchCount = 0;
                            batchTotal = 0;
                        }
                    });
                })(batchCount);
            }
            else if (state === State.STATES.END){
                total--;
                batchCount++;
                batchTotal++;

                if (dirty) dirtyObjects.trigger('clean');
                dirty = false;

                (function(currentCount){
                    dirtyQueue.push(function ResizeStreamResize() {
                        if (currentCount == batchTotal && total == 0) {
                            batchCount = 0;
                            batchTotal = 0;
                        }
                    });
                })(batchCount);
            }
        });

        this._eventInput.on(EVENTS.START, function ResizeStreamStart(data){
            this.trigger(EVENTS.RESIZE, data);
        }.bind(this));

        this._eventInput.on(EVENTS.UPDATE, function ResizeStreamUpdate(data){
            this.trigger(EVENTS.RESIZE, data);
        }.bind(this));

        this._eventInput.on(EVENTS.END, function ResizeStreamEnd(data){
            this.trigger(EVENTS.RESIZE, data);
        }.bind(this));
    }

    ResizeStream.prototype = Object.create(SimpleStream.prototype);
    ResizeStream.prototype.constructor = ResizeStream;

    ResizeStream.lift = SimpleStream.lift;

    ResizeStream.merge = function(streamObj){
        var mergedStream = new ResizeStream();

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

    module.exports = ResizeStream;
});
