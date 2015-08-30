define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');
    var EventMapper = require('samsara/events/EventMapper');
    var SimpleStream = require('samsara/streams/SimpleStream');
    var dirtyObjects = require('samsara/core/dirtyObjects');

    var preTickQueue = require('samsara/core/queues/preTickQueue');
    var postTickQueue = require('samsara/core/queues/postTickQueue');
    var dirtyQueue = require('samsara/core/queues/dirtyQueue');
    var State = require('samsara/core/SUE');

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

        var batchCount = 0;
        var batchTotal = 0;
        var total = 0;
        var isUpdating = false;

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

        this._eventInput.on(EVENTS.START, function(data){
            batchCount++;
            batchTotal++;
            total++;

            (function(currentCount){
                preTickQueue.push(function streamStart(){
                    if (currentCount == batchCount){
                        batchCount = 0;
                        batchTotal = 0;
                        if (isUpdating) return;
                        var payload = options && options.start ? options.start(data) : data;
                        if (payload !== false) self.emit(EVENTS.START, payload);
                    }
                });
            })(batchCount)
        });

        this._eventInput.on(EVENTS.UPDATE, function(data){
            batchCount++;
            batchTotal++;
            isUpdating = true;
            (function(currentCount){
                postTickQueue.push(function streamUpdate(){
                    if (currentCount == batchTotal) {
                        var payload = options && options.update ? options.update(data) : data;
                        if (payload !== false) self.emit(EVENTS.UPDATE, payload);
                        batchCount = 0;
                        batchTotal = 0;
                    }
                });
            })(batchCount);
        });

        this._eventInput.on(EVENTS.END, function(data){
            total--;
            (function(currentTotal){
                dirtyQueue.push(function streamEnd(){
                    if (currentTotal == 0){
                        isUpdating = false;
                        var payload = options && options.end ? options.end(data) : data;
                        if (payload !== false) self.emit(EVENTS.END, payload);
                    }
                });
            })(total);
        });

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

    Stream.prototype = Object.create(SimpleStream.prototype);
    Stream.prototype.constructor = Stream;

    Stream.lift = SimpleStream.lift;

    Stream.merge = function(streamObj){
        var mergedStream = new Stream();
        var mergedData = (streamObj instanceof Array) ? [] : {};

        mergedStream.addStream = function(key, stream){
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
