define(function(require, exports, module) {
    var SimpleStream = require('samsara/streams/SimpleStream');
    var EventMapper = require('samsara/events/EventMapper');
    var EventHandler = require('samsara/core/EventHandler');
    var dirtyObjects = require('samsara/core/dirtyObjects');

    var preTickQueue = require('samsara/core/queues/preTickQueue');
    var postTickQueue = require('samsara/core/queues/postTickQueue');
    var dirtyQueue = require('samsara/core/queues/dirtyQueue');

    var EVENTS = {
        START : 'start',
        END : 'end',
        RESIZE : 'resize'
    };

    function ResizeStream(){
        var batchCount = 0; // progress of firings in each round of start/update/end
        var batchTotal = 0; // total firings in each round of start/update/end

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        var self = this;

        this._eventInput.on(EVENTS.RESIZE, function(data){
            batchCount++;
            batchTotal++;
            (function(count){
                postTickQueue.push(function(){
                    if (count == batchTotal){
                        self._eventOutput.emit(EVENTS.RESIZE, data);
                        batchCount = 0;
                        batchTotal = 0;
                    }
                });
            })(batchCount)
        });
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
