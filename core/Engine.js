/* Modified work copyright © 2015 David Valdman */
// TODO: cancel RAF when asleep
define(function(require, exports, module) {
    var State = require('./SUE');
    var postTickQueue = require('./queues/postTickQueue');
    var preTickQueue = require('./queues/preTickQueue');
    var dirtyQueue = require('./queues/dirtyQueue');
    var tickQueue = require('./queues/tickQueue');

    var rafId = 0;

    /**
     * Engine is a singleton object that is required to run a Samsara application.
     *  It is the "heartbeat" of the application, managing the batching of streams
     *  and creating `RootNodes` and `Contexts` to begin render trees.
     *
     *  It also listens and can respond to DOM events on the HTML `<body>` tag
     *  and `window` object. For instance the `resize` event.
     *
     * @class Engine
     * @namespace Core
     * @static
     * @private
     * @uses Core.EventHandler
     */
    var Engine = {};

    /**
     * Updates by a single frame of the application by looping through all function queues.
     *  This is repeatedly called within a requestAnimationFrame loop until the application
     *  is receiving no layout changes. At this point the requestAnimationFrame will be
     *  canceled until the next change.
     *
     * @private
     * @method step
     */
    Engine.step = function step() {
        // browser events and their handlers happen before rendering begins
        while (preTickQueue.length) (preTickQueue.shift())();

        // tick signals base event flow coming in
        State.set(State.STATES.UPDATE);

        for (var i = 0; i < tickQueue.length; i++) tickQueue[i]();

        // post tick is for resolving larger components from their incoming signals
        while (postTickQueue.length) (postTickQueue.shift())();

        State.set(State.STATES.END);

        while (dirtyQueue.length) (dirtyQueue.shift())();

        State.set(State.STATES.START);
    };

    /**
     * Initiate the Engine's request animation frame loop.
     *
     * @method start
     * @static
     */
    Engine.start = function start(){
        Engine.step();
        rafId = window.requestAnimationFrame(start);
    };

    module.exports = Engine;
});
