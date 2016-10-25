/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');

    // Global registry of input constructors. Append only.
    var registry = {};

    /**
     * Combines multiple inputs (e.g., mouse, touch, scroll) into one unified input.
     *  Inputs must first be registered on the constructor by a unique identifier,
     *  then they can be accessed on instantiation.
     *
     *      @example
     *
     *      // In main.js
     *      GenericInput.register({
     *          "mouse" : MouseInput,
     *          "touch" : TouchInput
     *      });
     *
     *      // in myFile.js
     *      var input = new GenericInput(['mouse', 'touch'], options);
     *
     * @class GenericInput
     * @constructor
     * @namespace Inputs
     * @extends Streams.SimpleStream
     * @param inputs {Object|String[]}  Dictionary with {identifier : option} pairs
     *                                  or an array of identifier strings
     * @param [options] {Object} Options for all inputs
     */
    function GenericInput(inputs, options) {
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._inputs = {};
        if (inputs) this.addInput(inputs, options);
    }

    GenericInput.prototype = Object.create(SimpleStream.prototype);
    GenericInput.prototype.constructor = GenericInput;

    /**
     * Constrain the input along a specific axis.
     *
     * @property DIRECTION {Object}
     * @property DIRECTION.X {Number}   x-axis
     * @property DIRECTION.Y {Number}   y-axis
     * @static
     */
    GenericInput.DIRECTION = {
        X : 0,
        Y : 1
    };

    /**
     * Register a global input class with an identifying key
     *
     * @method register
     * @static
     * @param inputObject {Object} an object of {input key : input options} fields
     */
    GenericInput.register = function register(inputObject) {
        for (var key in inputObject){
            if (registry[key]){
                if (registry[key] === inputObject[key]) continue; // redundant registration
                else throw new Error('this key is registered to a different input class');
            }
            else registry[key] = inputObject[key];
        }
    };

    /**
     * Helper to set options on all input instances
     *
     * @method setOptions
     * @param options {Object} options object
     */
    GenericInput.prototype.setOptions = function(options) {
        for (var key in this._inputs)
            this._inputs[key].setOptions(options);
    };

    /**
     * Subscribe events from an input class
     *
     * @method subscribeInput
     * @param key {String} identifier for input class
     */
    GenericInput.prototype.subscribeInput = function subscribeInput(key) {
        var input = this._inputs[key];
        input.subscribe(this._eventInput);
        this._eventOutput.subscribe(input);
    };

    /**
     * Unsubscribe events from an input class
     *
     * @method unsubscribeInput
     * @param key {String} identifier for input class
     */
    GenericInput.prototype.unsubscribeInput = function unsubscribeInput(key) {
        var input = this._inputs[key];
        input.unsubscribe(this._eventInput);
        this._eventOutput.unsubscribe(input);
    };

    /**
     * Get a registered input by key
     *
     * @method getInput
     * @param key {String} Identifier for input class
     * @return {Input}
     */
    GenericInput.prototype.getInput = function getInput(key){
        return this._inputs[key];
    };

    function _addSingleInput(key, options) {
        if (!registry[key]) return;
        this._inputs[key] = new (registry[key])(options);
        this.subscribeInput(key);
    }

    /**
     * Add an input class to from the registered classes
     *
     * @method addInput
     * @param inputs {Object|Array.String} an array of registered input keys
     *    or an object with fields {input key : input options}
     */
    GenericInput.prototype.addInput = function addInput(inputs, options) {
        if (inputs instanceof Array)
            for (var i = 0; i < inputs.length; i++)
                _addSingleInput.call(this, inputs[i], options);
        else if (inputs instanceof Object)
            for (var key in inputs)
                _addSingleInput.call(this, key, inputs[key]);
    };

    module.exports = GenericInput;
});
