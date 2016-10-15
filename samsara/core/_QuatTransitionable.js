/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Quaternion = require('./_Quaternion');
    var Transitionable = require('./Transitionable');
    var EventHandler = require('../events/EventHandler');
    var Transform = require('./Transform');

    function QuatTransitionable(quaternion){
        this.start = Quaternion.create();
        this.end = Quaternion.create();
        this.value = Quaternion.create();

        this.t = new Transitionable(0);

        this._eventOutput = this.t.map(function(t){
            Quaternion.slerp(this.start, this.end, t, this.value);
            return Quaternion.toTransform(this.value);
        }.bind(this));

        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    QuatTransitionable.prototype.set = function(quat, transition, callback){
        Quaternion.set(this.get(), this.start);
        Quaternion.set(quat, this.end);

        this.t.reset(0);
        this.t.set(1, transition, callback);
    }

    QuatTransitionable.prototype.get = function(){
        return this.value;
    }

    module.exports = QuatTransitionable;
});
