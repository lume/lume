/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module) {
    var MergedStream = require('./_MergedStream');
    var StreamOutput = require('./_StreamContract');
    var EventMapper = require('../events/EventMapper');

    function LiftedStream(map, streams) {
        StreamOutput.call(this);
        var mergedStream = new MergedStream(streams);

        function mapped (data){
            return map.apply(null, data);
        };

        this._mappedStream = new EventMapper(mapped);

        this.subscribe(this._mappedStream).subscribe(mergedStream);
    }

    LiftedStream.prototype = Object.create(StreamOutput.prototype);
    LiftedStream.prototype.constructor = LiftedStream;

    /**
     * Set a mapping function.
     *
     * @method setMap
     * @param map {Function} Mapping function
     */
    LiftedStream.prototype.setMap = function(map) {
        function mapped (data){
            return map.apply(null, data);
        };

        this._mappedStream.set(mapped);
    };

    module.exports = LiftedStream;
});
