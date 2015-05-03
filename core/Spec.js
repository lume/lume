/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var SpecManager = require('famous/core/SpecManager');
    var Transform = require('famous/core/Transform');
    var EventHandler = require('famous/core/EventHandler');

    function Spec(state){
        this.state = state || null;
        this.target = null;
        this.result = null;

        this._cache = null;
        this._dirty = true;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('dirty', function(){
            if (!this._dirty){
                this._dirty = true;
                this._eventOutput.emit('dirty');
            }
        }.bind(this));

        this._eventInput.on('clean', function(){
            if (this._dirty){
                this._dirty = false;
                this._eventOutput.emit('clean');
            }
        }.bind(this));
    }

    Spec.prototype.getTarget = function(){
        if (this.target) return this.target;
        else {
            var target = new Spec();
            this.target = target;
            this._eventInput.subscribe(target);
            return target;
        }
    };

    Spec.prototype.getChild = function(index){
        if (!this.target) this.target = [];
        var children = this.target;

        if (index >= children.length){
            var child = new Spec();
            this._eventInput.subscribe(child);
            children[index] = child;
            this.trigger('dirty');
            return child;
        }
        else return children[index];
    };

    Spec.prototype.removeChild = function(index){
        this.target.splice(index, 1);
    };

    function _firstSet(){
        if (!this.state) this.state = {};
    }

    Spec.prototype.setTransform = function(transform){
        _firstSet.call(this);
        if (!this.state.transform) this.state.transform = [];
        for (var i = 0; i < transform.length; i++){
            if (this.state.transform[i] === transform[i]) continue;
            if (!this._dirty) this.trigger('dirty');
            this.state.transform[i] = transform[i];
        }
        return this;
    };

    Spec.prototype.setOpacity = function(opacity){
        _firstSet.call(this);
        if (this.state.opacity === opacity) return this;
        this.state.opacity = opacity;
        if (!this._dirty) this.trigger('dirty');
        return this;
    };

    Spec.prototype.setSize = function(size){
        _firstSet.call(this);
        if (!this.state.size) this.state.size = [];
        if (this.state.size[0] === size[0] && this.state.size[1] === size[1]) return this;
        this.state.size[0] = size[0];
        this.state.size[1] = size[1];
        if (!this._dirty) this.trigger('dirty');
        return this;
    };

    Spec.prototype.setOrigin = function(origin){
        _firstSet.call(this);
        if (!this.state.origin) this.state.origin = [];
        if (this.state.origin[0] === origin[0] && this.state.origin[1] === origin[1]) return this;
        this.state.origin[0] = origin[0];
        this.state.origin[1] = origin[1];
        if (!this._dirty) this.trigger('dirty');
        return this;
    };

    Spec.prototype.setAlign = function(align){
        _firstSet.call(this);
        if (!this.state.align) this.state.align = [];
        if (this.state.align[0] === align[0] && this.state.align[1] === align[1]) return this;
        this.state.align[0] = align[0];
        this.state.align[1] = align[1];
        if (!this._dirty) this.trigger('dirty');
        return this;
    };

    Spec.prototype.setMargins = function(margins){
        _firstSet.call(this);
        if (!this.state.margins) this.state.margins = [];

        if (this.state.margins[0] === margins[0] &&
            this.state.margins[1] === margins[1] &&
            this.state.margins[2] === margins[2] &&
            this.state.margins[3] === margins[3])
            return this;

        this.state.align[0] = margins[0];
        this.state.align[1] = margins[1];
        this.state.margins[2] = margins[2];
        this.state.margins[3] = margins[3];

        if (!this._dirty) this.trigger('dirty');

        return this;
    };

    Spec.prototype.setProportions = function(proportions){
        _firstSet.call(this);
        if (!this.state.proportions) this.state.proportions = [];
        if (this.state.proportions[0] === proportions[0] && this.state.proportions[1] === proportions[1]) return this;
        this.state.proportions[0] = proportions[0];
        this.state.proportions[1] = proportions[1];
        if (!this._dirty) this.trigger('dirty');
        return this;
    };

    Spec.prototype.setTarget = function(target){
        if (target === this.target) return;
        this.trigger('dirty');
        this._eventInput.subscribe(target);
        this.target = target;
        return this;
    };

    Spec.prototype.render = function(parentSize){

        //TODO: Fix hack for origin checking
//        if (this.state && this.state.origin && parentSpec.transform){
//            var size = this.state.size || parentSpec.size;
//            var origin = this.state.origin;
//            parentSpec.transform = Transform.moveThen([-size[0]*origin[0], -size[1]*origin[1], 0], parentSpec.transform);
//        }

        if (!this._dirty) return this._cache;

        var size = (this.state && parentSize)
            ? SpecManager.getSize(this.state, parentSize)
            : parentSize;

        if (this.target instanceof Array){
            this.result = [];
            for (var i = 0; i < this.target.length; i++)
                this.result[i] = this.target[i].render(size);
        }
        else if (this.target instanceof Object){
            if (!this.state) this.result = this.target.render();
            else {
                this.result = Object.create(this.state);
                this.result.target = this.target.render(size);
            }
        }
        else this.result = this.state;

        this._cache = this.result;
        this._dirty = false;

        return this.result;
    };

    module.exports = Spec;
});
