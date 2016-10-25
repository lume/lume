/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Quaternion = require('./_Quaternion');
    var Transitionable = require('../core/Transitionable');
    var SimpleStream = require('../streams/SimpleStream');
    var EventHandler = require('../events/EventHandler');

    /**
     * An extension of Transitionable to transition Quaternions via spherical linear interpolation (slerp).
     *
     * @class QuatTransitionable
     * @private
     * @constructor
     * @extends Streams.SimpleStream
     * @param value {Quaternion}   Starting quaternion
     */
    function QuatTransitionable(quaternion){
        this.start = Quaternion.create();
        this.end = Quaternion.create();
        this.value = Quaternion.create();

        this.t = new Transitionable(0);

        this._eventOutput = this.t.map(function(t){
            Quaternion.slerp(this.start, this.end, t, this.value);
            return this.value;
        }.bind(this));

        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    QuatTransitionable.prototype = Object.create(SimpleStream.prototype);
    QuatTransitionable.prototype.constructor = QuatTransitionable;

    /**
     * Define a new end value that will be transitioned towards with the prescribed
     *  transition. An optional callback can fire when the transition completes.
     *
     * @method set
     * @param quaternion {Quaternion}           Quaternion end value
     * @param [transition] {Object}             Transition definition
     * @param [callback] {Function}             Callback
     */
    QuatTransitionable.prototype.set = function(quaternion, transition, callback){
        Quaternion.set(this.get(), this.start);

        // go shorter way around
        if (Quaternion.dot(this.start, quaternion) < 0)
            Quaternion.negate(this.start, this.start);

        Quaternion.set(quaternion, this.end);

        this.t.reset(0);
        this.t.set(1, transition, callback);
    }

    /**
     * Sets the value and velocity of the transition without firing any events.
     *
     * @method reset
     * @param quaternion {Quaternion}       New quaternion
     * @param [velocity] {Number|Number[]}  New velocity
     */
    QuatTransitionable.prototype.reset = function(quaternion, velocity){
        Quaternion.set(quaternion, this.start);
        Transitionable.prototype.getVelocity.call(this.t, 0);
    }

    /**
     * Determine is the transition is ongoing, or has completed.
     *
     * @method isActive
     * @return {Boolean}
     */
    QuatTransitionable.prototype.isActive = function(){
        return Transitionable.prototype.isActive.apply(this.t, arguments);
    }

    /**
     * Ends the transition in place.
     *
     * @method halt
     */
    QuatTransitionable.prototype.halt = function(){
        Quaternion.set(this.get(), this.value);
        Transitionable.prototype.halt.apply(this.t, arguments);
    }

    /**
     * Return the current value of the transition.
     *
     * @method get
     * @return {Quaternion}    Current quaternion
     */
    QuatTransitionable.prototype.get = function(){
        return this.value;
    }

    /**
     * Return the current velocity of the transition.
     *
     * @method getVelocity
     * @return {Number|Number[]}    Current velocity
     */
    QuatTransitionable.prototype.getVelocity = function(){
        return Transitionable.prototype.getVelocity.apply(this.t, arguments);
    }

    module.exports = QuatTransitionable;
});
