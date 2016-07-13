/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module) {
    var SimpleStream = require('./SimpleStream');
    var EventMapper = require('../events/EventMapper');

    function LiftedStream(map, mergedStream) {
        SimpleStream.call(this);
        this.mappedStream = new EventMapper(function liftMap(data) {
            return map.apply(null, data);
        });
        this.mergedStream = mergedStream;
        this.subscribe(this.mappedStream).subscribe(mergedStream);
    }

    LiftedStream.prototype = Object.create(SimpleStream.prototype);
    LiftedStream.prototype.constructor = LiftedStream;

    LiftedStream.prototype.replaceStream = function() {
        this.mergedStream.replaceStream.apply(this.mergedStream, arguments);
    };

    /**
     * Set a mapping function.
     *
     * @method setMap
     * @param map {Function} Mapping function
     */
    LiftedStream.prototype.setMap = function(map) {
        EventMapper.prototype.set.apply(this.mappedStream, arguments);
    };
    
    module.exports = LiftedStream;
});
