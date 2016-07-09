/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    /**
     * This queue is executed before the postTickQueue and after the preTickQueue.
     *  however, it differs in that the Engine does not clear the queue.
     *  This must be done manually.
     *
     *  @private
     */

    module.exports = [];
});
