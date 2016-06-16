/* Copyright © 2015-2016 David Valdman */

define(function (require, exports, module) {
    var dirtyQueue = require('./queues/dirtyQueue');
    var preTickQueue = require('./queues/preTickQueue');
    var tickQueue = require('./queues/tickQueue');
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');
    var Stream = require('../streams/Stream');

    var Tween = require('../transitions/Tween');
    var Spring = require('../transitions/Spring');
    var Inertia = require('../transitions/Inertia');

    var transitionMethods = {
        tween: Tween,
        spring: Spring,
        inertia: Inertia
    };

    /**
     * A way to transition numeric values and arrays of numbers between start and end states.
     *  Transitions are given an easing curve and a duration.
     *  Non-numeric values are ignored.
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
        this.value = value || 0;
        this.velocity = 0;
        this._callback = undefined;
        this._method = null;
        this._active = false;
        this._currentActive = false;

        var hasUpdated = false;
        this.updateMethod = undefined;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('start', function (value) {
            this._currentActive = true;
            if (!this._active) {
                this.emit('start', value);
                this._active = true;
            }
        }.bind(this));

        this._eventInput.on('update', function (value) {
            hasUpdated = true;
            this.value = value;
            this.velocity = this._engineInstance.getVelocity();
            this.emit('update', value);
        }.bind(this));

        this._eventInput.on('end', function (value) {
            this.value = value;
            this._currentActive = false;

            if (this._callback) {
                var callback = this._callback;
                this._callback = undefined;
                callback();
            }

            if (!this._currentActive){
                this._active = false;
                hasUpdated = false;

                if (this._engineInstance)
                    this.velocity = this._engineInstance.getVelocity();

                this._active = false;
                this.emit('end', value);
            }
        }.bind(this));

        if (value !== undefined) {
            this.value = value;
            preTickQueue.push(function () {
                this.trigger('start', value);

                dirtyQueue.push(function () {
                    if (hasUpdated) return;
                    this.trigger('end', value);
                }.bind(this));
            }.bind(this));
        }
    }

    Transitionable.prototype = Object.create(SimpleStream.prototype);
    Transitionable.prototype.constructor = Transitionable;

    /**
     * Constructor method. A way of registering other engines that can interpolate
     *  between start and end values. For instance, a physics engine.
     *
     *  @method register
     *  @param name {string}    Identifier for the engine
     *  @param constructor      Constructor for the engine
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
     *  @param name {string}    Identifier for the engine
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
     * @param [transition.curve] {string}       Easing curve name, e.g., "easeIn"
     * @param [transition.duration] {string}    Duration of transition
     * @param [callback] {Function}             Callback
     */
    Transitionable.prototype.set = function set(value, transition, callback) {
        if (!transition || transition.duration === 0) {
            this.value = value;
            if (callback) dirtyQueue.push(callback);
            if (!this.isActive()){
                this.trigger('start', value);

                dirtyQueue.push(function () {
                    this.trigger('end', value);
                }.bind(this));
            }
            return;
        }

        if (callback) this._callback = callback;

        var curve = transition.curve;

        var method = (curve && transitionMethods[curve])
            ? transitionMethods[curve]
            : Tween;

        if (this._method !== method) {
            if (this._engineInstance){
                if (this.updateMethod){
                    var index = tickQueue.indexOf(this.updateMethod);
                    if (index >= 0) tickQueue.splice(index, 1);
                }
                this.unsubscribe(this._engineInstance);
            }

            if (this.value instanceof Array) {
                var dimensions = this.value.length;
                this._engineInstance = (dimensions < method.DIMENSIONS)
                    ? new method(this.value)
                    : new NDTransitionable(this.value, method);
            }
            else this._engineInstance = new method(this.value);

            this.subscribe(this._engineInstance);
            this.updateMethod = this._engineInstance.update.bind(this._engineInstance);
            tickQueue.push(this.updateMethod);

            this._method = method;
        }

        if (!transition.velocity) transition.velocity = this.velocity;

        this._engineInstance.set(value, transition);
    };

    /**
     * Return the current state of the transition.
     *
     * @method get
     * @return {Number|Number[]}    Current state
     */
    Transitionable.prototype.get = function get() {
        return this.value;
    };

    /**
     * Return the current velocity of the transition.
     *
     * @method getVelocity
     * @return {Number|Number[]}    Current state
     */
    Transitionable.prototype.getVelocity = function getVelocity(){
        return this.velocity;
    };

    /**
     * Sets the value and velocity of the transition without firing any events.
     *
     * @method reset
     * @param value {Number|Number[]}       New value
     * @param [velocity] {Number|Number[]}  New velocity
     */
    Transitionable.prototype.reset = function reset(value, velocity){
        this.value = value;
        this.velocity = velocity || 0;
        this._callback = null;
        this._method = null;
        if (this._engineInstance) this._engineInstance.reset(value, velocity);
    };

    /**
     * Ends the transition in place.
     *
     * @method halt
     */
    Transitionable.prototype.halt = function () {
        if (!this._active) return;
        this.reset(this.get());
        this.trigger('end', this.value);

        //TODO: refactor this
        if (this._engineInstance) {
            if (this.updateMethod) {
                var index = tickQueue.indexOf(this.updateMethod);
                if (index >= 0) tickQueue.splice(index, 1);
            }
            this.unsubscribe(this._engineInstance);
        }
    };

    /**
     * Determine is the transition is ongoing, or has completed.
     *
     * @method isActive
     * @return {Boolean}
     */
    Transitionable.prototype.isActive = function isActive() {
        return this._active;
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
            },
            callback
        );
    };

    function NDTransitionable(value, method) {
        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.sources = [];
        for (var i = 0; i < value.length; i++) {
            var source = new method(value[i]);
            this.sources.push(source);
        }

        this.stream = Stream.merge(this.sources);
        this._eventOutput.subscribe(this.stream);
    }

    NDTransitionable.prototype.set = function (value, transition) {
        var velocity = transition.velocity ? transition.velocity.slice() : undefined;
        for (var i = 0; i < value.length; i++){
            if (velocity) transition.velocity = velocity[i];
            this.sources[i].set(value[i], transition);
        }
    };

    NDTransitionable.prototype.getVelocity = function () {
        var velocity = [];
        for (var i = 0; i < this.sources.length; i++)
            velocity[i] = this.sources[i].getVelocity();
        return velocity;
    };

    NDTransitionable.prototype.update = function () {
        for (var i = 0; i < this.sources.length; i++)
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
