/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('./EventHandler');

    /**
     *  A collection of methods for setting options which can be extended
     *  onto other classes.
     *
     *
     *  **** WARNING ****
     *  You can only pass through objects that will compile into valid JSON.
     *
     *  Valid options:
     *      Strings,
     *      Arrays,
     *      Objects,
     *      Numbers,
     *      Nested Objects,
     *      Nested Arrays.
     *
     *    This excludes:
     *        Document Fragments,
     *        Functions
     * @class OptionsManager
     * @constructor
     * @param {Object} value options dictionary
     */
    function OptionsManager(value) {
        this._value = value;
        this._eventHandler = null;
    }

    /**
     * Create options manager from source dictionary with arguments overriden by patch dictionary.
     *
     * @static
     * @method OptionsManager.patch
     *
     * @param {Object} source source arguments
     * @param {...Object} data argument additions and overwrites
     * @return {Object} source object
     */
    OptionsManager.patch = function patch(source, data) {
        var manager = new OptionsManager(source);
        for (var i = 1; i < arguments.length; i++) manager.patch(arguments[i]);
        return source;
    };

    OptionsManager.setOptions = function(instance, options, defaults){
        defaults = defaults || instance.constructor.DEFAULT_OPTIONS || {};
        var optionsManager = new OptionsManager(defaults);
        instance.setOptions = OptionsManager.prototype.setOptions.bind(optionsManager);
        instance.getOptions = OptionsManager.prototype.getOptions.bind(optionsManager);
        if (options) instance.setOptions(options);
        return optionsManager.get();
    };

    function _createEventHandler() {
        if (!this._eventHandler) this._eventHandler = new EventHandler();
    }

    /**
     * Create OptionsManager from source with arguments overriden by patches.
     *   Triggers 'change' event on this object's event handler if the state of
     *   the OptionsManager changes as a result.
     *
     * @method patch
     *
     * @param {Object} data list of patch objects
     * @return {OptionsManager} this
     */
    OptionsManager.prototype.patch = function patch(data) {
        var myState = this._value;
        for (var k in data) {
            if ((k in myState) && (data[k] && data[k].constructor === Object) && (myState[k] && myState[k].constructor === Object)) {
                if (!myState.hasOwnProperty(k)) myState[k] = Object.create(myState[k]);
                this.key(k).patch(data[k]);
                if (this._eventHandler) this._eventHandler.emit('change', {key: k, value: this.key(k).value()});
            }
            else this.set(k, data[k]);
        }
        return this;
    };

    /**
     * Alias for patch
     *
     * @method setOptions
     *
     */
    OptionsManager.prototype.setOptions = OptionsManager.prototype.patch;

    /**
     * Return OptionsManager based on sub-object retrieved by key
     *
     * @method key
     *
     * @param {string} identifier key
     * @return {OptionsManager} new options manager with the value
     */
    OptionsManager.prototype.key = function key(identifier) {
        var result = new OptionsManager(this._value[identifier]);
        if (!(result._value instanceof Object) || result._value instanceof Array) result._value = {};
        return result;
    };

    /**
     * Look up value by key or get the full options hash
     * @method get
     *
     * @param {string} key key
     * @return {Object} associated object or full options hash
     */
    OptionsManager.prototype.get = function get(key) {
        return key ? this._value[key] : this._value;
    };

    /**
     * Alias for get
     * @method getOptions
     */
    OptionsManager.prototype.getOptions = OptionsManager.prototype.get;

    /**
     * Set key to value.  Outputs 'change' event if a value is overwritten.
     *
     * @method set
     *
     * @param {string} key key string
     * @param {Object} value value object
     * @return {OptionsManager} new options manager based on the value object
     */
    OptionsManager.prototype.set = function set(key, value) {
        var originalValue = this.get(key);
        this._value[key] = value;
        if (this._eventHandler && value !== originalValue) this._eventHandler.emit('change', {key: key, value: value});
        return this;
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'change')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    OptionsManager.prototype.on = function on(type, handler) {
        _createEventHandler.call(this);
        return this._eventHandler.on.apply(this._eventHandler, arguments);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @method off
     *
     * @param {string} type event type key (for example, 'change')
     * @param {function} handler function object to remove
     * @return {EventHandler} internal event handler object (for chaining)
     */
    OptionsManager.prototype.off = function off(type, handler) {
        _createEventHandler.call(this);
        return this._eventHandler.off.apply(this._eventHandler, arguments);
    };

    module.exports = OptionsManager;
});
