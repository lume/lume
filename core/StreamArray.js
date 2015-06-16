define(function(require, exports, module) {
    var Stream = require('famous/streams/Stream');

    function StreamArray(array){
        Stream.call(this);
        this.array = [];
        if (array) this.set(array);
    }

    StreamArray.prototype = Object.create(Stream.prototype);
    StreamArray.prototype.constructor = StreamArray;

    StreamArray.prototype.set = function set(array){
        for (var i = 0; i < array.length; i++){
            var item = array[i];
            this._eventInput.subscribe(item);
            this.array[i] = item;
        }
    };


    module.exports = StreamArray;
});
