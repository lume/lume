/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var SimpleStream = require('./SimpleStream');

    function MergedStream(streams) {
        var Stream = require('./Stream');

        Stream.call(this, {
            start : function() {
                return this.mergedData;
            }.bind(this), update : function() {
                return this.mergedData;
            }.bind(this), end : function() {
                return this.mergedData;
            }.bind(this)
        });

        this.mergedData = streams instanceof Array ? [] : {};
        this.streamCache = {};

        for (var key in streams)
            this.addStream(key, streams[key]);
    }

    MergedStream.prototype = Object.create(SimpleStream.prototype);
    MergedStream.prototype.constructor = MergedStream;

    MergedStream.prototype.addStream = function(key, stream) {
        stream.on('start', function(size) {
            this.mergedData[key] = size;
        }.bind(this));
        stream.on('update', function(size) {
            this.mergedData[key] = size;
        }.bind(this));
        stream.on('end', function(size) {
            this.mergedData[key] = size;
        }.bind(this));
        this.subscribe(stream);
        this.mergedData[key] = null;
        this.streamCache[key] = stream;
    };

    MergedStream.prototype.removeStream = function(key) {
        // TODO : remove off('start', 'update', 'end', 'resize') 
        var stream = this.streamCache[key];
        this.unsubscribe(stream);
        delete this.mergedData[key];
        delete this.streamCache[key];
    };

    MergedStream.prototype.replaceStream = function(key, stream) {
        this.removeStream(key);
        this.addStream(key, stream);
    };
    
    module.exports = MergedStream;
});
