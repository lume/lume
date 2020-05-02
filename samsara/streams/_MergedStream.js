/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var Stream = require('./_Stream');
    var Observable = require('./Observable');

    function MergedStream(streams) {
        this.mergedData = streams instanceof Array ? [] : {};
        this.streamCache = {};

        var boundEmit = function(){ return this.mergedData; }.bind(this);

        Stream.call(this, {
            set : boundEmit,
            start : boundEmit,
            update : boundEmit,
            end : boundEmit
        });

        if (streams) this.set(streams);
    }

    MergedStream.prototype = Object.create(Stream.prototype);
    MergedStream.prototype.constructor = MergedStream;

    MergedStream.prototype.set = function(sources){
        for (var key in sources) {
            var source = sources[key];
            this.addStream(key, source);
        }
    };

    MergedStream.prototype.addStream = function(key, stream) {
        var mergedData = this.mergedData;
        mergedData[key] = (stream.get instanceof Function)
            ? stream.get()
            : undefined;

        if (!stream.on) {
            stream = new Observable(stream);
            stream.on('set', function(data){
                mergedData[key] = data;
            });
        }
        else {
            stream.on(['set', 'start', 'update', 'end'], function(data){
                mergedData[key] = data;
            });
        }

        this.subscribe(stream);

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
        else delete this.mergedData[key];
    };

    MergedStream.prototype.replaceStream = function(key, stream) {
        this.removeStream(key);
        this.addStream(key, stream);
    };

    module.exports = MergedStream;
});
