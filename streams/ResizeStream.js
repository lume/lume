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
        END : 'end',
        RESIZE : 'resize'
    };

    function ResizeStream(options){
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
                    this.emit(EVENTS.RESIZE, data);
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

        if (options.resize)
            this._eventInput.on(EVENTS.RESIZE, options.resize.bind(this));
        else {
            this._eventInput.on(EVENTS.RESIZE, function(data){
                this._eventOutput.emit(EVENTS.RESIZE, data);
            }.bind(this));
        }
    }

    ResizeStream.prototype = Object.create(Stream.prototype);
    ResizeStream.prototype.constructor = ResizeStream;

    ResizeStream.merge = function(streamObj){
        var count = 0;
        var total = 0;

        var hasStarted = false;
        var hasUpdated = false;
        var hasEnded = false;

        var mergedStream = new ResizeStream({
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
                count++;
                hasUpdated = true;
                postTickQueue.push(function(){
                    if (count == total) {
                        mergedStream.emit(EVENTS.UPDATE, mergedData);
                        count = 0;
                    }
                }.bind(mergedStream));
                mergedStream.trigger(EVENTS.RESIZE, mergedData);
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
                mergedStream.emit(EVENTS.RESIZE, mergedData);
            }
        });

        var mergedData = (streamObj instanceof Array) ? [] : {};

        mergedStream.addStream = function(key, stream){
            mergedData[key] = undefined;
            var mapper = (function(key){
                return new EventMapper(function(data){
                    return mergedData[key] = data;
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
