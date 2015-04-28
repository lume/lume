/*
 * copyright © 2015 David Valdman
 */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    function StateManager(state) {
        this.state = state || {};

        this._dirtyLock = 0;
        this._dirty = true;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('start', function(data){
            if (this._dirtyLock == 0){
                this._dirty = true;
                this._eventOutput.emit('dirty');
            }
            this._dirtyLock++;
        }.bind(this));

        this._eventInput.on('end', function(data){
            this._dirtyLock--;
            if (this._dirtyLock === 0){
                this._dirty = false;
                this._eventOutput.emit('clean');
            }
        }.bind(this));
    }

    StateManager.prototype.addState = function addState(key, state){
        if (state instanceof Object){
            this._eventInput.subscribe(state);
        }
        else{
            Object.defineProperty(this, key, {
                get : function(){
                    return state;
                },
                set : function(val){
                    if (!this._dirty){
                        this._dirty = true;
                        this._eventOutput.emit('dirty');
                    }
                    state = val;
                }
            });
        }
    };

    StateManager.prototype.cleanStatic = function(){
        if (this._dirty && this._dirtyLock === 0) {
            this._dirty = false;
            this._eventOutput.emit('clean');
        }
    };

    module.exports = StateManager;
});
