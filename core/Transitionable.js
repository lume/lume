/* Copyright © 2015 David Valdman */

define(function (require, exports, module) {
    var dirtyQueue = require('./queues/dirtyQueue');
    var preTickQueue = require('./queues/preTickQueue');
    var tickQueue = require('./queues/tickQueue');
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');
    var Stream = require('../streams/Stream');

    var Tween = require('../transitions/TweenTransition');
    var Spring = require('../physics/Spring');
    var Inertia = require('../physics/Inertia');

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

                if (this._engineInstance) {
                    this.velocity = this._engineInstance.getVelocity();
                }

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
        if (!transition) {
            this.value = value;
            this.trigger('start', value);

            dirtyQueue.push(function () {
                this.trigger('end', value);
            }.bind(this));
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

    Transitionable.prototype.halt = function () {
        this.value = this.get();
        this._callback = undefined;
        this._method = null;
        this.emit('end', this.value);
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
     * Iterate through the provided values with the provided transitions. Firing an
     *  optional callback when the series of transitions completes.
     *  One transition may be provided as opposed to an array when you want all the
     *  transitions to behave the same way.
     *
     * @method iterate
     * @param values {Array}                    Array of values
     * @param transitions {Object|Object[]}     Array of transitions
     * @param [callback] {Function}             Callback
     */
    Transitionable.prototype.iterate = function iterate(values, transitions, callback) {
        if (values.length === 0) {
            if (callback) callback();
            return;
        }

        // sugar for same transition across value changes
        var transition = (transitions instanceof Array)
            ? transitions.shift()
            : transitions;

        this.set(values.shift(), transition, function () {
            this.iterate(values, transitions, callback);
        }.bind(this));
    };

    Transitionable.prototype.setMany = function (array, callback) {
        var first = array.shift();
        if (array.length === 0) {
            this.set(first.value, first.transition, callback)
        }
        else {
            this.set(first.value, first.transition, function () {
                this.setMany(array, callback);
            }.bind(this));
        }
    };

    /**
     * Loop indefinitely between values with provided transitions. Fire a callback
     *  after each new value is reached.
     *
     * @method loop
     * @param values {Array}                    Array of values
     * @param transitions {Object|Object[]}     Array of transitions
     * @param [callback] {Function}             Callback
     */
    Transitionable.prototype.loop = function (array) {
        var arrayClone = array.slice(0);
        this.setMany(array, function () {
            this.loop(arrayClone);
        }.bind(this));
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
                curve: function () {
                    return 0;
                }
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
        for (var i = 0; i < value.length; i++)
            this.sources[i].set(value[i], transition);
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

    module.exports = Transitionable;
});
