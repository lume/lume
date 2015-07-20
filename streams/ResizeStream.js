define(function(require, exports, module) {
    var SimpleStream = require('famous/streams/SimpleStream');
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

    function ResizeStream(){
        var count = 0;
        var total = 0;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        var self = this;

        this._eventInput.on(EVENTS.RESIZE, function(data){
            count++;
            total++;

            var state = State.get();

            (function(currentCount) {
                if (state === State.STATES.START) {
                    nextTickQueue.push(function ResizeStreamStart() {
                        if (currentCount == total) {
                            self.emit(EVENTS.RESIZE, data);
                            count = 0;
                            total = 0;
                        }
                    });
                }
                else {
                    postTickQueue.push(function ResizeStreamResize() {
                        if (currentCount == total) {
                            self.emit(EVENTS.RESIZE, data);
                            count = 0;
                            total = 0;
                        }
                    });
                }
            })(count);
        }.bind(this));

        this._eventInput.on(EVENTS.START, function ResizeStreamStart(data){
            this.trigger(EVENTS.RESIZE, data);
        }.bind(this));

        this._eventInput.on(EVENTS.UPDATE, function ResizeStreamUpdate(data){
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
