/* Copyright © 2015-2016 David Valdman */

define(function (require, exports, module) {
    var preTickQueue = require('./queues/preTickQueue');
    var nextTick = require('./queues/nextTick');
    var tickQueue = require('./queues/tickQueue');
    var EventHandler = require('../events/EventHandler');
    var StreamContract = require('../streams/_StreamContract');
    var Stream = require('../streams/Stream');
    var MergedStream = require('../streams/_MergedStream');

    var Tween = require('../transitions/_Tween');
    var Spring = require('../transitions/_Spring');
    var Inertia = require('../transitions/_Inertia');
    var Damp = require('../transitions/_Damp');
    var Immediate = require('../transitions/_Immediate');

    var transitionMethods = {
        tween: Tween,
        spring: Spring,
        inertia: Inertia,
        damp: Damp
    };

    /**
     * A way to transition numeric values and arrays of numbers between start and end states.
     *  Transitioning happens through one of many possible interpolations, such as easing
     *  curves like 'easeIn', or physics curves like 'spring' and 'inertia'. The choice
     *  of interpolation is specified when `.set` is called. If no interpolation is specified
     *  then the value changes immediately. Non-numeric values in arrays, such as `undefined`
     *  or `true`, are safely ignored.
     *
     *  Transitionables are streams, so they emit `start`, `update` and `end` events, with a payload
     *  that is their current value. As streams, they can also be mapped, filtered, composed, etc.
     *
     *  @example
     *
     *      var transitionable = new Transitionable(0);
     *
     *      transitionable.set(100, {duration : 1000, curve : 'easeIn'});
     *
     *      transitionable.on('start', function(value){
     *          console.log(value); // 0
     *      });
     *
     *      transitionable.on('update', function(value){
     *          console.log(value); // numbers between 0 and 100
     *      });
     *
     *      transitionable.on('end', function(value){
     *          console.log(value); // 100
     *      });
     *
     * @class Transitionable
     * @constructor
     * @extends Streams.SimpleStream
     * @param value {Number|Number[]}   Starting value
     */
    function Transitionable(value) {
        StreamContract.call(this);

        this._eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);

        this._callback = undefined;
        this._method = null;
        this._currentActive = false;
        this.updateMethod = undefined;

        var hasUpdated = false;

        this._eventInput.on('set', function (value) {
            if (hasUpdated) this.trigger('end', value);
            else this.emit('set', value);
        }.bind(this));

        this._eventInput.on('start', function (value) {
            hasUpdated = false;
            this._currentActive = true;
            if (!this.isActive()) {
                this.emit('start', value);
            }
        }.bind(this));

        this._eventInput.on('update', function (value) {
            hasUpdated = true;
            this.emit('update', value);
        }.bind(this));

        this._eventInput.on('end', function (value) {
            this._currentActive = false;

            // remove previous
            if (this.updateMethod){
                var index = tickQueue.indexOf(this.updateMethod);
                if (index >= 0) tickQueue.splice(index, 1);
            }
            this.unsubscribe(this._interpolant);

            // fire callback before `end` event to ensure overriding of `end` event if new `set` is called
            if (this._callback) {
                var callback = this._callback;
                this._callback = undefined;
                callback();
            }

            if (!this._currentActive){
                nextTick.push(function(){
                    hasUpdated = false;
                    this.emit('end', value);
                }.bind(this));
            }
        }.bind(this));

        if (value !== undefined) {
            this.value = value;
            preTickQueue.push(function () {
                if (this._method) return;
                this.emit('set', value);
            }.bind(this));
        }
    }

    Transitionable.prototype = Object.create(StreamContract.prototype);
    Transitionable.prototype.constructor = Transitionable;

    /**
     * Constructor method. A way of registering other engines that can interpolate
     *  between start and end values. For instance, a physics engine.
     *
     *  @method register
     *  @param name {string}    Identifier for the transition
     *  @param constructor      Constructor for the transition
     */
    Transitionable.register = function register(name, constructor) {
        if (!(name in transitionMethods))
            transitionMethods[name] = constructor;
    };

    /**
     * Constructor method. Unregister an interpolating engine.
     *  Undoes work of `register`.
     *
     *  @method unregister
     *  @param name {string}    Identifier for the transition
     */
    Transitionable.unregister = function unregister(name) {
        if (name in transitionMethods) {
            delete transitionMethods[name];
            return true;
        }
        else return false;
    };

    /**
     * Define a new end value that will be transitioned towards with the prescribed
     *  transition. An optional callback can fire when the transition completes.
     *
     * @method set
     * @param value {Number|Number[]}           End value
     * @param [transition] {Object}             Transition definition
     * @param [callback] {Function}             Callback
     */
    Transitionable.prototype.set = function set(value, transition, callback) {
        var Interpolant;
        if (!transition || transition.duration === 0) {
            this._callback = undefined;
            this.value = value;
            Interpolant = Immediate;
        }
        else {
            if (callback) this._callback = callback;
            var curve = transition.curve;

            Interpolant = (curve && transitionMethods[curve])
                ? transitionMethods[curve]
                : Tween;
        }

        // remove previous
        if (this.updateMethod){
            var index = tickQueue.indexOf(this.updateMethod);
            if (index >= 0) tickQueue.splice(index, 1);
        }
        this.unsubscribe(this._interpolant);

        if (this._method !== Interpolant) {
            // create new
            if (value instanceof Array) {
                this._interpolant = (value.length < Interpolant.DIMENSIONS)
                    ? new Interpolant(this.get())
                    : new NDTransitionable(this.get(), Interpolant);
            }
            else this._interpolant = new Interpolant(this.get());

            this._method = Interpolant;
        }

        // add new
        this.subscribe(this._interpolant);

        if (this._interpolant.update){
            this.updateMethod = this._interpolant.update.bind(this._interpolant);
            nextTick.push(function(){
                tickQueue.push(this.updateMethod);
            }.bind(this));
        }

        this._interpolant.set(value, transition);
    };

    /**
     * Return the current state of the transition.
     *
     * @method get
     * @return {Number|Number[]}    Current state
     */
    Transitionable.prototype.get = function get() {
        return (this._interpolant) ? this._interpolant.get() : this.value;
    };

    /**
     * Return the current velocity of the transition.
     *
     * @method getVelocity
     * @return {Number|Number[]}    Current velocity
     */
    Transitionable.prototype.getVelocity = function getVelocity(){
        if (this._interpolant && this._interpolant.getVelocity)
            return this._interpolant.getVelocity();
    };

    /**
     * Sets the value and velocity of the transition without firing any events.
     *
     * @method reset
     * @param value {Number|Number[]}       New value
     * @param [velocity] {Number|Number[]}  New velocity
     */
    Transitionable.prototype.reset = function reset(value, velocity){
        this._callback = undefined;
        this._method = null;
        this.value = value;
        if (this._interpolant) this._interpolant.reset(value, velocity);
    };

    /**
     * Ends the transition in place.
     *
     * @method halt
     */
    Transitionable.prototype.halt = function () {
        if (!this.isActive()) return;
        var value = this.get();
        this.reset(value);
        this.trigger('end', value);

        //TODO: refactor this
        if (this._interpolant) {
            if (this.updateMethod) {
                var index = tickQueue.indexOf(this.updateMethod);
                if (index >= 0) tickQueue.splice(index, 1);
            }
            this.unsubscribe(this._interpolant);
        }
    };

    /**
     * Combine multiple transitions to be executed sequentially. Pass an optional
     *  callback to fire on completion. Provide the transitions as an array of
     *  transition definition pairs: [value, method]
     *
     *  @example
     *
     *  transitionable.setMany([
     *      [0, {curve : 'easeOut', duration : 500}],
     *      [1, {curve : 'spring', period : 100, damping : 0.5}]
     *  ]);
     *
     * @method setMany
     * @param transitions {Array}   Array of transitions
     * @param [callback] {Function} Callback
     */
    Transitionable.prototype.setMany = function (transitions, callback) {
        var transition = transitions.shift();
        if (transitions.length === 0) {
            this.set(transition[0], transition[1], callback);
        }
        else this.set(transition[0], transition[1], this.setMany.bind(this, transitions, callback));
    };

    /**
     * Loop indefinitely between values with provided transitions array.
     *
     *  @example
     *
     *  transitionable.loop([
     *      [0, {curve : 'easeOut', duration : 500}],
     *      [1, {curve : 'spring', period : 100, damping : 0.5}]
     *  ]);
     *
     * @method loop
     * @param transitions {Array}   Array of transitions
     */
    Transitionable.prototype.loop = function (transitions) {
        var arrayClone = transitions.slice(0);
        this.setMany(transitions, this.loop.bind(this, arrayClone));
    };

    /**
     * Postpone a transition, and fire it by providing it in the callback parameter.
     *
     * @method delay
     * @param callback {Function}   Callback
     * @param duration {Number}     Duration of delay (in millisecons)
     */
    Transitionable.prototype.delay = function delay(callback, duration) {
        this.set(this.get(), {
            duration: duration,
            curve: function () { return 0; }
        }, callback);
    };

    function NDTransitionable(value, Method) {
        EventHandler.call(this);

        this.sources = [];
        for (var i = 0; i < value.length; i++) {
            var source = new Method(value[i]);
            this.sources.push(source);
        }

        this.stream = Stream.merge(this.sources);
        this.subscribe(this.stream);
    }

    NDTransitionable.prototype = Object.create(EventHandler.prototype);
    NDTransitionable.prototype.constructor = NDTransitionable;

    // N-dimensional extension for arrays when interpolants can't natively support multi-dimensional arrays
    NDTransitionable.prototype.set = function (value, transition) {
        var velocity = (transition && transition.velocity) ? transition.velocity.slice() : undefined;
        for (var i = 0; i < value.length; i++){
            if (velocity) transition.velocity = velocity[i];
            this.sources[i].set(value[i], transition);
        }
    };

    NDTransitionable.prototype.get = function () {
        return this.sources.map(function(source){
            return source.get();
        });
    };

    NDTransitionable.prototype.getVelocity = function () {
        return this.sources.map(function(source){
            return source.getVelocity();
        });
    };

    NDTransitionable.prototype.update = function () {
        for (var i = 0; i < this.sources.length; i++)
            if (this.sources[i].update)
                this.sources[i].update();
    };

    NDTransitionable.prototype.reset = function (value) {
        for (var i = 0; i < this.sources.length; i++) {
            var source = this.sources[i];
            source.reset(value[i]);
        }
    };

    module.exports = Transitionable;
});
