/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

/* Documentation in progress. May be outdated. */

define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');
    var SimpleStream = require('samsara/streams/SimpleStream');

    /**
     * Combines multiple types of input classes (e.g. mouse, touch,
     *  scrolling) into one standardized interface for inclusion in widgets.
     *
     *  Sync classes are first registered with a key, and then can be accessed
     *  globally by key.
     *
     *  Emits 'start', 'update' and 'end' events as a union of the input class
     *  providers.
     *
     * @class GenericInput
     * @constructor
     * @namespace Inputs
     * @param inputs {Object|Array} object with fields {input key : input options}
     *    or an array of registered input keys
     * @param [options] {Object|Array} options object to set on all inputs
     */
    function GenericInput(inputs, options) {
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._inputs = {};
        if (inputs) this.addInput(inputs);
        if (options) this.setOptions(options);
    }

    GenericInput.prototype = Object.create(SimpleStream.prototype);
    GenericInput.prototype.constructor = GenericInput;

    GenericInput.DIRECTION = {
        X : 0,
        Y : 1,
        Z : 2
    };

    // Global registry of input constructors. Append only.
    var registry = {};

    /**
     * Register a global input class with an identifying key
     *
     * @static
     * @method register
     *
     * @param inputObject {Object} an object of {input key : input options} fields
     */
    GenericInput.register = function register(inputObject) {
        for (var key in inputObject){
            if (registry[key]){
                if (registry[key] === inputObject[key]) return; // redundant registration
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
        for (var key in this._inputs){
            this._inputs[key].setOptions(options);
        }
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
     * Unsunscribe events from an input class
     *
     * @method unsubscribeInput
     * @param key {String} identifier for input class
     */
    GenericInput.prototype.unsubscribeInput = function unsubscribeInput(key) {
        var input = this._inputs[key];
        input.unsubscribe(this._eventInput);
        this._eventOutput.unsubscribe(input);
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
    GenericInput.prototype.addInput = function addInput(inputs) {
        if (inputs instanceof Array)
            for (var i = 0; i < inputs.length; i++)
                _addSingleInput.call(this, inputs[i]);
        else if (inputs instanceof Object)
            for (var key in inputs)
                _addSingleInput.call(this, key, inputs[key]);
    };

    module.exports = GenericInput;
});
