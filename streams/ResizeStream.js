define(function(require, exports, module) {
    var SimpleStream = require('samsara/streams/SimpleStream');
    var EventMapper = require('samsara/events/EventMapper');
    var EventHandler = require('samsara/core/EventHandler');
    var dirtyObjects = require('samsara/core/dirtyObjects');

    var preTickQueue = require('samsara/core/queues/preTickQueue');
    var postTickQueue = require('samsara/core/queues/postTickQueue');
    var dirtyQueue = require('samsara/core/queues/dirtyQueue');
    var State = require('samsara/core/SUE');

    var EVENTS = {
        RESIZE : 'resize'
    };

    function ResizeStream(){
        var dirtyResize = false;

        function resize(data){
            this.emit(EVENTS.RESIZE, data);
            dirtyResize = false;
        }

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on(EVENTS.RESIZE, function(data){
            if (!dirtyResize) {
                var queue;
                switch (State.get()){
                    case State.STATES.START:
                        queue = preTickQueue;
                        break;
                    case State.STATES.UPDATE:
                        queue = postTickQueue;
                        break;
                    case State.STATES.END:
                        queue = dirtyQueue;
                        break;
                }
                queue.push(resize.bind(this, data));
            }
            dirtyResize = true;
        }.bind(this));
    }

    ResizeStream.prototype = Object.create(SimpleStream.prototype);
    ResizeStream.prototype.constructor = ResizeStream;

    ResizeStream.lift = SimpleStream.lift;

    ResizeStream.merge = function(streamObj){
        var mergedStream = new ResizeStream();
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

    module.exports = ResizeStream;
});
