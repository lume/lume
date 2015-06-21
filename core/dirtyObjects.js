/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var dirtyQueue = require('famous/core/queues/dirtyQueue');

    var eventOutput = new EventHandler();

    var dirtyObjects = {};

    dirtyObjects.trigger = eventOutput.emit.bind(eventOutput);

    dirtyObjects.on = eventOutput.on.bind(eventOutput);

    module.exports = dirtyObjects;
});