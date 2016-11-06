/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module) {
    var Stream = require('./_Stream');
    var MergedStream = require('./_MergedStream');
    var EventMapper = require('../events/EventMapper');

    function LiftedStream(map, streams) {
        Stream.call(this);

        var mergedStream = new MergedStream(streams);
        this._map = map;

        // TODO: replace with mergedStream.map
        var mappedStream = new EventMapper(function liftMap(data) {
            return this._map.apply(null, data);
        }.bind(this));

        this.subscribe(mappedStream).subscribe(mergedStream);
    }

    LiftedStream.prototype = Object.create(MergedStream.prototype);
    LiftedStream.prototype.constructor = LiftedStream;

    /**
     * Set a mapping function.
     *
     * @method setMap
     * @param map {Function} Mapping function
     */
    LiftedStream.prototype.setMap = function(map) {
        this._map = map;
    };

    module.exports = LiftedStream;
});
