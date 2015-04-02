define(function(require, exports, module) {
    var SpecParser = require('famous/core/SpecParser');

    function Spec(state){
        this.state = state || null;
        this.target = null;

        this._cache = null;
        this._dirty = true;
    }

    Spec.prototype.getTarget = function(){
        if (this.target) return this.target;
        else {
            var spec = new Spec();
            this.target = spec;
            return spec;
        }
    };

    Spec.prototype.getChild = function(index){
        if (!this.target) this.target = [];
        var children = this.target;

        if (index >= children.length){
            var child = new Spec();
            children[index] = child;
            this._dirty = true;
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

    Spec.prototype.set = function(spec){
        this.state  = spec.state  || null;
        this._cache = spec._cache || null;
        this._dirty = spec._dirty || false;
    };

    Spec.prototype.setTransform = function(transform){
        _firstSet.call(this);
        if (!this.state.transform) this.state.transform = [];
        for (var i = 0; i < transform.length; i++){
            if (this.state.transform[i] === transform[i]) continue;
            this._dirty = true;
            this.state.transform[i] = transform[i];
        }
        return this;
    };

    Spec.prototype.setOpacity = function(opacity){
        _firstSet.call(this);
        if (this.state.opacity === opacity) return this;
        this.state.opacity = opacity;
        this._dirty = true;
        return this;
    };

    Spec.prototype.setSize = function(size){
        _firstSet.call(this);
        if (!this.state.size) this.state.size = [];
        if (this.state.size[0] === size[0] && this.state.size[1] === size[1]) return this;
        this.state.size[0] = size[0];
        this.state.size[1] = size[1];
        this._dirty = true;
        return this;
    };

    Spec.prototype.setOrigin = function(origin){
        _firstSet.call(this);
        if (!this.state.origin) this.state.origin = [];
        if (this.state.origin[0] === origin[0] && this.state.origin[1] === origin[1]) return this;
        this.state.origin[0] = origin[0];
        this.state.origin[1] = origin[1];
        this._dirty = true;
        return this;
    };

    Spec.prototype.setAlign = function(align){
        _firstSet.call(this);
        if (!this.state.align) this.state.align = [];
        if (this.state.align[0] === align[0] && this.state.align[1] === align[1]) return this;
        this.state.align[0] = align[0];
        this.state.align[1] = align[1];
        this._dirty = true;
        return this;
    };

    Spec.prototype.setTarget = function(target){
        this.target = target;
        return this;
    };

    Spec.prototype.isDirty = function(){
        var isDirty = this._dirty;
        if (!isDirty){
            if (this.target instanceof Array){
                for (var i = 0; i < this.target.length; i++){
                    isDirty &= this.target[0].isDirty();
                    if (isDirty) break;
                }
            }
            else if (this.target instanceof Spec){
                isDirty &= this.target.isDirty();
            }
        }

        return isDirty;
    };

    //TODO: fix dirty checking
    Spec.prototype.render = function(parentSpec){
//        if (!this.isDirty()) return this._cache;

        var result;
        if (this.target instanceof Array){
            var flattenedSpec = (this.state && parentSpec)
                ? SpecParser.flatten(this.state, parentSpec)
                : parentSpec;
            result = [];
            for (var i = 0; i < this.target.length; i++){
                result[i] = this.target[i].render(flattenedSpec);
                if (this.target[i] instanceof Spec) this.target[i]._dirty = false;
            }

        }
        else if (this.target instanceof Object){
            result = Object.create(this.state);
            var flattenedSpec = (this.state && parentSpec)
                ? SpecParser.flatten(this.state, parentSpec)
                : parentSpec;
            if (this.target && this.target.render){
                result.target = this.target.render(flattenedSpec);
                if (this.target instanceof Spec) this.target._dirty = false;
            }
        }

        this._cache = result;
        this._dirty = false;

        return result;
    };

    module.exports = Spec;
});
