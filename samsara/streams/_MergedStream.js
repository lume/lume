/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var SimpleStream = require('./SimpleStream');

    function MergedStream(streams) {
        this.mergedData = streams instanceof Array ? [] : {};
        this.streamCache = {};

        var Stream = require('./Stream');

        Stream.call(this, {out : {
            set : function(){
                return this.mergedData;
            }.bind(this),
            start : function() {
                return this.mergedData;
            }.bind(this),
            update : function() {
                return this.mergedData;
            }.bind(this),
            end : function() {
                return this.mergedData;
            }.bind(this)
        }});

        for (var key in streams)
            this.addStream(key, streams[key]);
    }

    MergedStream.prototype = Object.create(SimpleStream.prototype);
    MergedStream.prototype.constructor = MergedStream;

    MergedStream.prototype.addStream = function(key, stream) {
        var mergedData = this.mergedData;

        if (stream instanceof Object && stream.on){
            mergedData[key] = undefined;

            stream.on(['set', 'start', 'update', 'end'], function(data){
                mergedData[key] = data;
            });

            this.subscribe(stream);
        }
        else mergedData[key] = stream;

        this.streamCache[key] = stream;
    };

    MergedStream.prototype.removeStream = function(key) {
        var stream = this.streamCache[key];
        this.unsubscribe(stream);

        delete this.streamCache[key];

        if (this.mergedData instanceof Array){
            var index = this.mergedData.indexOf(key);
            this.mergedData.splice(index, 1);
        }
        else
            delete this.mergedData[key];
    };

    MergedStream.prototype.replaceStream = function(key, stream) {
        this.removeStream(key);
        this.addStream(key, stream);
    };

    module.exports = MergedStream;
});
