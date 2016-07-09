/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module) {
    var SimpleStream = require('./SimpleStream');
    var EventMapper = require('../events/EventMapper');

    function LiftedStream(map, mergedStream) {
        SimpleStream.call(this);
        var mappedStream = new EventMapper(function liftMap(data) {
            return map.apply(null, data);
        });
        this.mergedStream = mergedStream;
        this.subscribe(mappedStream).subscribe(mergedStream);
    }

    LiftedStream.prototype = Object.create(SimpleStream.prototype);
    LiftedStream.prototype.constructor = LiftedStream;

    LiftedStream.prototype.replaceStream = function() {
        this.mergedStream.replaceStream.apply(this.mergedStream, arguments);
    };
    
    module.exports = LiftedStream;
});
