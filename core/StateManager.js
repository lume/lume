/*
 * copyright © 2015 David Valdman
 */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var dirtyQueue = require('famous/core/dirtyQueue');

    function StateManager(stateTypes) {
        this.state = {};

        this._dirty = true;
        this._dirtyLock = 0;

        // on quick set
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('dirty', function(){
            if (!this._dirty){
                this._dirty = true;
                this._eventOutput.emit('dirty');
            }
            this._dirtyLock++;
        }.bind(this));

        this._eventInput.on('clean', function(){
            if (this._dirtyLock > 0) this._dirtyLock--;
            if (this._dirty && this._dirtyLock == 0) {
                this._dirty = false;
                this._eventOutput.emit('clean');
            }
        }.bind(this));

        var simpleTypes = [Number, Boolean, String, undefined, null];
        if (stateTypes) {
            for (var type in stateTypes) {
                var constructor = stateTypes[type];
                if (simpleTypes.indexOf(constructor) == -1)
                    this.addState(type, new stateTypes[type]());
                else
                    this.addState(type, stateTypes[type]);
            }
        }
    }

    StateManager.prototype.addState = function addState(key, state){
        if (state.set && state.get){
            if (state.emit) this._eventInput.subscribe(state);
            this[key] = state;
        }
        else{
            if (state.emit) this._eventInput.subscribe(state);
            Object.defineProperty(this, key, {
                get : function(){
                    return state;
                },
                set : function(value){
                    if (state === value) return;
                    if (!this._dirty){
                        this._dirty = true;
                        this.emit('dirty');
                    }
                    dirtyQueue.push(this);
                    state = value;
                }
            });
        }
    };

    StateManager.prototype.clean = function(){
        if (this._dirty && this._dirtyLock === 0) {
            this._dirty = false;
            this.emit('clean');
        }
    };

    module.exports = StateManager;
});
