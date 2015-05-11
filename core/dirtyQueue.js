/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var queue = [];
    var dirtyQueue = {};

    dirtyQueue.push = function(obj){
        if (queue.indexOf(obj) !== -1) return;
        Array.prototype.push.apply(queue, arguments);
    };

    dirtyQueue.flush = function(){
        var L = queue.length;
        for (var i = 0; i < L; i++){
            (queue.shift()).clean();
        }
    };

    module.exports = dirtyQueue;
});