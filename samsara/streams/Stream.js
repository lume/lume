/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module) {
    var _Stream = require('./_Stream');
    var _MergedStream = require('./_MergedStream');
    var _LiftedStream = require('./_LiftedStream');

    var Stream = _Stream;

    /**
     * Batches events for provided object of streams in
     *  {key : stream} pairs. Emits one event per Engine cycle.
     *
     * @method merge
     * @static
     * @param streams {Object}  Dictionary of `resize` streams
     */
    Stream.merge = function(streams) {
        return new _MergedStream(streams);
    };

    /**
     * Lift is like map, except it maps several event sources,
     *  not only one.
     *
     *  @example
     *
     *      var liftedStream = Stream.lift(function(payload1, payload2){
     *          return payload1 + payload2;
     *      }, [stream2, stream2]);
     *
     *      liftedStream.on('name'), function(data){
     *          // data = 3;
     *      });
     *
     *      stream2.emit('name', 1);
     *      stream2.emit('name', 2);
     *
     * @method lift
     * @static
     * @param map {Function}            Function to map stream payloads
     * @param streams {Array|Object}    Stream sources
     */
    Stream.lift = function(maps, streams){
        return new _LiftedStream(maps, streams);
    };

    module.exports = Stream;
});
