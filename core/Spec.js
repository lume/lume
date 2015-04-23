/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var SpecManager = require('./SpecManager');
    var Transform = require('famous/core/Transform');
    var Entity = require('famous/core/Entity');
    var Modifier = require('famous/core/Modifier');

    function Spec(){
        this.state = null;
        this.target = null;

        this._cachedTarget = null;
        this._targetDirty = true;
    }

    function _firstSet(){
        if (!this.state) this.state = new Modifier();
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
            this._cachedTarget = [];
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
        if (target !== this._cachedTarget)
            this._targetDirty = true;
        this.target = target;
        return this;
    };

    Spec.prototype.isDirty = function(){
        return this.isStateDirty() || this._targetDirty;
    };

    Spec.prototype.isStateDirty = function(){
        return this.state && this.state.isDirty();
    };

    Spec.prototype.setTargetClean = function(){
        this._targetDirty = false;
    };

    Spec.prototype.render = function(parentSpec){
        var result;

        var mergedSize = (this.state && parentSpec && parentSpec.size)
            ? SpecManager.getSize(this.state.render(), parentSpec.size)
            : parentSpec.size;

        if (this.target instanceof Array){
            result = [];
            for (var i = 0; i < this.target.length; i++){
                var target = this.target[i];
                if (target.isStateDirty()){
                    result[i] = this.target[i].render({size : mergedSize});
                    this._cachedTarget[i] = result[i];
                }
                else result[i] = this._cachedTarget[i];
            }
        }
        else {
            if (this.state) {
                result = this.state.render();
                if (this.target){
                    if (this.target.isStateDirty()){
                        result.target = this.target.render({size : mergedSize});
                        this._cachedTarget = result.target;
                    }
                    else result.target = this._cachedTarget;
                }
            }
            else {
                if (this.target.isStateDirty()) {
                    result = this.target.render({size: mergedSize});
                    this._cachedTarget = result;
                }
                else result = this._cachedTarget;
            }
        }

        this.setTargetClean();

        return result;
    };

    module.exports = Spec;
});