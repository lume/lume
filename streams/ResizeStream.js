define(function(require, exports, module) {
    var Stream = require('famous/streams/Stream');
    var EventMapper = require('famous/events/EventMapper');
    var EventHandler = require('famous/core/EventHandler');

    var nextTickQueue = require('famous/core/queues/nextTickQueue');
    var postTickQueue = require('famous/core/queues/postTickQueue');
    var dirtyQueue = require('famous/core/queues/dirtyQueue');

    var EVENTS = {
        START : 'start',
        UPDATE : 'update',
        RESIZE : 'resize',
        END : 'end'
    };

    //only listens to resize
    //emits SUE + resize

    function ResizeStream(options){
        options = options || {};

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        //batch these?

        if (options.resize)
            this._eventInput.on(EVENTS.RESIZE, options.resize.bind(this));
        else this._eventInput.on(EVENTS.RESIZE, function(data){
            this._eventOutput.emit(EVENTS.RESIZE, data)
        }.bind(this));

        this._eventInput.on(EVENTS.START, function(data){
            this._eventOutput.emit(EVENTS.START, data);
        }.bind(this));

        this._eventInput.on(EVENTS.UPDATE, function(data){
            this._eventOutput.emit(EVENTS.RESIZE, data);
        }.bind(this));

        this._eventInput.on(EVENTS.END, function(data){
            this._eventOutput.emit(EVENTS.END, data);
        }.bind(this));
    }

    ResizeStream.prototype = Object.create(Stream.prototype);
    ResizeStream.prototype.constructor = ResizeStream;

    ResizeStream.merge = function(streamObj){
        var hasResized = false;

        var mergedStream = new ResizeStream({
            resize : function(){
                nextTickQueue.push(function(){
                    if (!hasResized){
                        this.emit(EVENTS.RESIZE, mergedData);
                        hasResized = true;
                    }
                }.bind(mergedStream));

                dirtyQueue.push(function(){
                    hasResized = false;
                });
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

    ResizeStream.lift = function(fn, streams, queue){
        //TODO: fix comma separated arguments
        var mergedStream = (streams instanceof Array)
            ? ResizeStream.merge(streams, queue)
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
