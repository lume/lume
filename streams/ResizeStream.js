define(function(require, exports, module) {
    var Stream = require('famous/streams/Stream');
    var EventMapper = require('famous/events/EventMapper');
    var EventHandler = require('famous/core/EventHandler');

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

    //only listens to resize
    //emits SUE + resize

    function ResizeStream(options){
        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        if (options){
            this._eventInput = new EventHandler();
            EventHandler.setInputHandler(this, this._eventInput);

            this._eventInput.on(EVENTS.RESIZE, options.resize.bind(this));

            this._eventInput.on(EVENTS.START, function(data){
                nextTickQueue.push(function resizeStreamStart() {
                    this._eventOutput.emit(EVENTS.START, data);
                }.bind(this));
            }.bind(this));

            this._eventInput.on(EVENTS.UPDATE, function(data){
                postTickQueue.push(function resizeStreamResize() {
                    options.resize.call(this, data);
                }.bind(this))
            }.bind(this));

            this._eventInput.on(EVENTS.END, function resizeStreamEnd(data){
                dirtyQueue.push(function(){
                    this._eventOutput.emit(EVENTS.END, data);
                }.bind(this));
            }.bind(this));
        }
        else EventHandler.setInputHandler(this, this._eventOutput);
    }

    ResizeStream.prototype = Object.create(Stream.prototype);
    ResizeStream.prototype.constructor = ResizeStream;

    ResizeStream.merge = function(streamObj){
        var mergedStream = new ResizeStream({
            resize : function(){
                var state = State.get();
                var queue;
                if (state == State.STATES.START) queue = nextTickQueue;
                else if (state == State.STATES.UPDATE) queue = postTickQueue;

                queue.push(function mergedResizeStreamResize(){
                    mergedStream.emit(EVENTS.RESIZE, mergedData);
                }.bind(mergedStream));
            }.bind(this)
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

    ResizeStream.lift = function(fn, streams){
        //TODO: fix comma separated arguments
        var mergedStream = (streams instanceof Array)
            ? ResizeStream.merge(streams)
            : ResizeStream.merge.apply(null, Array.prototype.splice.call(arguments, 1));

        var mappedStream = new EventMapper(function(data){
            return fn.apply(null, data);
        });

        var liftedStream = new ResizeStream();
        liftedStream.subscribe(mappedStream).subscribe(mergedStream);

        return liftedStream;
    };

    module.exports = ResizeStream;
});
