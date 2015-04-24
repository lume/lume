/*
 * copyright © 2015 David Valdman
 */

define(function(require, exports, module) {
    var Transitionable = require('famous/core/Transitionable');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');
    var EventHandler = require('famous/core/EventHandler');

    //1 = dirty, 0 = clean
    function StateManager(state) {
        this.state = state || {};
        this.dirtyFlags = {};

        this.dirtyMask = 0;
        this.dirtyState = 0;
        this.dirtyLock = 0;
        this._dirty = true;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('start', function(){
            this._dirty = true;
            this._eventOutput.emit('dirty');
        }.bind(this));

        this._eventInput.on('end', function(){
            this._dirty = false;
            this._eventOutput.emit('clean');
        }.bind(this));
    }

    StateManager.prototype.set = function(state){
        this.state = state;

        var i = 0;
        for (var key in state){
            var dirtyFlag = Math.pow(2,i++);
            this.dirtyFlags[key] = dirtyFlag;
            this.dirtyMask |= dirtyFlag;

            if (state[key] instanceof Transitionable)
                this._eventInput.subscribe(state[key]);
        }
        this.dirtyState = ~this.dirtyMask; // initialize all to clean
    };

    StateManager.prototype.get = function(key){
        return this.state[key];
    };

    StateManager.prototype.setKey = function set(key, value, transition, callback){
        var state = this.state[key];
        if (state === undefined) return;
        if (state instanceof Transitionable || state instanceof TransitionableTransform) {
            this._eventInput.subscribe(state);

            state.set(value, transition, function() {
                // flip flag's key from 1 to 0
                this.dirtyState &= ~this.dirtyFlags[key];
                this.dirtyLock--;
                if (callback) callback();
            }.bind(this));
            this.dirtyLock++;
        }
        else{
            this.state[key] = value;
            this.dirtyState &= this.dirtyFlags[key];
        }
    };

    StateManager.prototype.getKey = function get(key){
        var state = this.state[key];
        if (state instanceof Transitionable || state instanceof TransitionableTransform)
            return state.get();
        else if (state instanceof Function)
            return state();
        else
            return state;
    };

    StateManager.prototype.isDirty = function(){
        if (this.dirtyLock > 0) return true;
        else return (this.dirtyState === this.dirtyMask);
    };

    module.exports = StateManager;
});
