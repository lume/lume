/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var dirtyQueue = require('famous/core/dirtyQueue');

    var eventOutput = new EventHandler();
    var dirty = false;

    var dirtyObjects = {};

    dirtyObjects.push = function(){
        if (!dirty) {
            eventOutput.emit('dirty');
            dirty = true;

            dirtyQueue.push(function(){
                eventOutput.emit('clean');
                dirty = false;
            });
        }
    };

    dirtyObjects.on = eventOutput.on.bind(eventOutput);

    module.exports = dirtyObjects;
});