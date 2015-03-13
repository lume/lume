define(function(require, exports, module) {

    function Spec(state){
        this.state = state || null;
        this._cache = null;
        this._dirty = false;
    }

    Spec.prototype.getTarget = function(){
        if (this.state && this.state.target) return this.state.target;
        else {
            var spec = new Spec();
            if (!this.state) this.state = {};
            this.state.target = spec;
            return spec;
        }
    };

    Spec.prototype.getChild = function(index){
        if (!this.state) this.state = [];
        if (index >= this.state.length){
            var spec = new Spec();
            this.state[index] = spec;
            this._dirty = true;
            return spec;
        }
        else return this.state[index];
    };

    Spec.prototype.removeChild = function(index){
        this.state.splice(index, 1);
    };

    Spec.prototype.set = function(spec){
        this.state  = spec.state  || null;
        this._cache = spec._cache || null;
        this._dirty = spec._dirty || false;
    };

    Spec.prototype.setTransform = function(transform){
        if (!this.state) this.state = {};
        if (!this.state.transform) this.state.transform = [];
        for (var i = 0; i < transform.length; i++){
            if (this.state.transform[i] === transform[i]) continue;
            this._dirty = true;
            this.state.transform[i] = transform[i];
        }
        return this;
    };

    Spec.prototype.setOpacity = function(opacity){
        if (!this.state) this.state = {};
        if (this.state.opacity === opacity) return this;
        this.state.opacity = opacity;
        this._dirty = true;
        return this;
    };

    Spec.prototype.setSize = function(size){
        if (!this.state) this.state = {};
        if (!this.state.size) this.state.size = [];
        if (this.state.size[0] === size[0] && this.state.size[1] === size[1]) return this;
        this.state.size[0] = size[0];
        this.state.size[1] = size[1];
        this._dirty = true;
        return this;
    };

    Spec.prototype.setOrigin = function(origin){
        if (!this.state) this.state = {};
        if (!this.state.origin) this.state.origin = [];
        if (this.state.origin[0] === origin[0] && this.state.origin[1] === origin[1]) return this;
        this.state.origin[0] = origin[0];
        this.state.origin[1] = origin[1];
        this._dirty = true;
        return this;
    };

    Spec.prototype.setAlign = function(align){
        if (!this.state) this.state = {};
        if (!this.state.align) this.state.align = [];
        if (this.state.align[0] === align[0] && this.state.origin[1] === align[1]) return this;
        this.state.align[0] = align[0];
        this.state.align[1] = align[1];
        this._dirty = true;
        return this;
    };

    Spec.prototype.setTarget = function(target){
        if (!this.state) this.state = {};
        this.state.target = target;
        return this;
    };

    Spec.prototype.isDirty = function(){
        return this._dirty;
    };

    Spec.prototype.render = function(parentSpec){
        var result;
        if (this.state instanceof Array){
            result = [];
            for (var i = 0; i < this.state.length; i++){
                result[i] = this.state[i].render(parentSpec);
            }
        }
        else if (this.state instanceof Object){
            if (!this._dirty)
                result = this._cache;
            else {
                result = Object.create(this.state);
                if (this.state.target && this.state.target.render)
                    result.target = this.state.target.render(parentSpec);
                this._cache = result;
            }
        }
        return result;
    };

    module.exports = Spec;
});
