/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var STATE = {
        NONE : -1,
        START : 0,
        UPDATE : 1,
        END : 2
    };

    var currentState = STATE.START;

    /**
     * SUE specified the global state of the application, whether it is in a
     *  `start`, `update` or `end` state. This is necessary for coordinating
     *  `resize` events with `start`, `update`, `end` states in stream.
     *
     * @class SUE
     * @private
     */
    var SUE = {};

    SUE.STATES = STATE;

    SUE.set = function set(state){
        currentState = state;
    };

    SUE.get = function get(){
        return currentState;
    };

    module.exports = SUE;
});