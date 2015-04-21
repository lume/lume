/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var SpecManager = require('./SpecManager');
    var Transform = require('famous/core/Transform');
    var Entity = require('famous/core/Entity');
    var Modifier = require('famous/core/Modifier');

    function Spec(){
        this.state = null;
        this.target = null;

        this._entityIds = {};
    }

    Spec.prototype.set = function(options){
        if (!this.state) this.state = new Modifier();
        Modifier.prototype.set.apply(this.state, arguments);
        return this;
    };

    Spec.prototype.getChild = function(index){
        if (!this.target) this.target = [];
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

    Spec.prototype.setTransform = function(transform){
        if (!this.state) this.state = new Modifier();
        this.state.transformFrom(transform);
    };

    Spec.prototype.setTarget = function(target){
        this.target = target;
        return this;
    };

    //TODO: fix dirty checking
    Spec.prototype.render = function(parentSpec){
        var result;

        var mergedSize = (this.state && parentSpec && parentSpec.size)
            ? SpecManager.getSize(this.state, parentSpec.size)
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
            else result = this.target.render({size : mergedSize});
        }

        return result;

    };

    module.exports = Spec;
});

//        if (this.state && this.state.origin && parentSpec.transform){
//            var size = this.state.size || parentSpec.size;
//            var origin = this.state.origin;
//            parentSpec.transform = Transform.moveThen([-size[0]*origin[0], -size[1]*origin[1], 0], parentSpec.transform);
//        }