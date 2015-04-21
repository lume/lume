/*
 * copyright © 2015 David Valdman
 */

define(function(require, exports, module) {
    var Transitionable = require('famous/core/Transitionable');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');

    //1 = dirty, 0 = clean
    function StateManager(state) {
        this.state = state || {};
        this.dirtyFlags = {};

        this.dirtyMask = 0;
        this.dirtyState = 0;
        this.dirtyLock = [];
    }

    StateManager.prototype.set = function(state){
        this.state = state;

        var i = 0;
        for (var key in state){
            var dirtyFlag = Math.pow(2,i++);
            this.dirtyFlags[key] = dirtyFlag;
            this.dirtyMask |= dirtyFlag;
        }
        this.dirtyState = ~this.dirtyMask; // initialize all to clean
    };

    StateManager.prototype.setKey = function set(key, value, transition, callback){
        var state = this.state[key];
        if (state === undefined) return;
        if (state instanceof Transitionable || state instanceof TransitionableTransform) {
            state.set(value, transition, function() {
                // flip flag's key from 1 to 0
                this.dirtyState &= ~this.dirtyFlags[key];
                this.dirtyLock.pop();
                if (callback) callback();
            }.bind(this));
            this.dirtyLock.push(true);
        }
        else{
            this.state[key] = value;
            this.dirtyState &= this.dirtyFlags[key];
        }
    };

    StateManager.prototype.get = function get(key){
        var state = this.state[key];
        return (state instanceof Transitionable || state instanceof TransitionableTransform)
            ? state.get()
            : state;
    };

    StateManager.prototype.isDirty = function(){
        if (this.dirtyLock.length) return true;
        else return (this.dirtyState === this.dirtyMask);
    };

    module.exports = StateManager;
});
