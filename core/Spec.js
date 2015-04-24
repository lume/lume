/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var SpecManager = require('./SpecManager');
    var Transform = require('famous/core/Transform');
    var Entity = require('famous/core/Entity');
    var Modifier = require('famous/core/Modifier');
    var EventHandler = require('famous/core/EventHandler');

    function Spec(){
        this.state = null;
        this.target = null;

        this._dirty = true;
        this._dirtyLock = 0;

        this._cachedSpec = null;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('dirty', function(){
            this._dirty = true;
            this._dirtyLock++;
            this._eventOutput.emit('dirty');
        }.bind(this));

        this._eventInput.on('clean', function(){
            this._dirtyLock--;
            this._eventOutput.emit('clean');
        }.bind(this));
    }

    function _firstSet(){
        if (!this.state) {
            this.state = new Modifier();
            this._eventInput.subscribe(this.state);
        }
    }

    Spec.prototype.from = function(options){
        _firstSet.call(this);
        Modifier.prototype.from.apply(this.state, arguments);
        return this;
    };

    Spec.prototype.getChild = function(index){
        if (index == undefined) return this.getTarget();

        if (!this.target) {
            this.target = [];
        }
        var children = this.target;

        if (index >= children.length){
            var child = new Spec();
            children[index] = child;
            return child;
        }
        else return children[index];
    };

    Spec.prototype.removeChild = function(index){
        this.target.splice(index, 1);
    };

    Spec.prototype.getTarget = function(){
        if (this.target) return this.target;
        else {
            var spec = new Spec();
            this.setTarget(spec);
            return spec;
        }
    };

    Spec.prototype.transformFrom = function(transform){
        _firstSet.call(this);
        Modifier.prototype.transformFrom.apply(this.state, arguments);
        return this;
    };

    Spec.prototype.opacityFrom = function(opacity){
        _firstSet.call(this);
        Modifier.prototype.opacityFrom.apply(this.state, arguments);
        return this;
    };

    Spec.prototype.sizeFrom = function(size){
        _firstSet.call(this);
        Modifier.prototype.sizeFrom.apply(this.state, arguments);
        return this;
    };

    Spec.prototype.originFrom = function(origin){
        _firstSet.call(this);
        Modifier.prototype.originFrom.apply(this.state, arguments);
        return this;
    };

    Spec.prototype.alignFrom = function(align){
        _firstSet.call(this);
        Modifier.prototype.alignFrom.apply(this.state, arguments);
        return this;
    };

    Spec.prototype.marginsFrom = function(margins){
        _firstSet.call(this);
        Modifier.prototype.marginsFrom.apply(this.state, arguments);
        return this;
    };

    Spec.prototype.proportionsFrom = function(proportions){
        _firstSet.call(this);
        Modifier.prototype.proportionsFrom.apply(this.state, arguments);
        return this;
    };

    Spec.prototype.setTarget = function(target){
        this.target = target;
        if (target instanceof Spec)
            this._eventInput.subscribe(target);
        return this;
    };

    Spec.prototype.render = function(parentSpec){
        if (!this._dirty) return this._cachedSpec;

        var result;
        var mergedSize = (this.state && parentSpec && parentSpec.size)
            ? SpecManager.getSize(this.state.render(), parentSpec.size)
            : parentSpec.size;

        if (this.target instanceof Array){
            result = [];
            for (var i = 0; i < this.target.length; i++)
                result[i] = this.target[i].render({size : mergedSize});
        }
        else {
            if (this.state) {
                result = this.state.render();
                if (this.target)
                    result.target = this.target.render({size : mergedSize});
            }
            else result = this.target.render({size: mergedSize});
        }

        this._cachedSpec = result;

        if (this._dirtyLock == 0)
            this._dirty = false;

        return result;
    };

    module.exports = Spec;
});