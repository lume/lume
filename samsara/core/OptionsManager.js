/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');

    /**
     *  A utility for setting options in a class that enables patching options
     *   with prescribed defaults and emitting `change` events when options are changed.
     *   Recursively defined for nested options objects.
     *
     *   Note: only JSONable objects are allowed, so no functions.
     *
     * @class OptionsManager
     * @namespace Core
     * @constructor
     * @private
     * @uses Core.EventHandler
     * @param value {Object} Options object literal
     */
    function OptionsManager(value) {
        this._value = value;
        this._eventHandler = null;
    }

    /**
     * Constructor method. Create OptionsManager from source dictionary with arguments overridden by patch dictionary.
     *
     * @method OptionsManager.patch
     * @param options {Object}          Options to be patched
     * @param patch {...Object}         Options to override
     * @return source {Object}
     */
    OptionsManager.patch = function patch(options, patch) {
        var manager = new OptionsManager(options);
        for (var i = 1; i < arguments.length; i++) manager.patch(arguments[i]);
        return options;
    };

    /**
     * Constructor method. Convenience method to set options with defaults on an object instance.
     *
     * @method OptionsManager.setOptions
     * @param instance {Function}    Constructor
     * @param options {Object}       Overriding options
     * @param defaults {Object}      Default options
     * @return {Object}              Patched options
     */
    OptionsManager.setOptions = function(instance, options, defaults){
        defaults = defaults || _clone(instance.constructor.DEFAULT_OPTIONS) || {};
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
     * Patch options with provided patches. Triggers `change` event on the object.
     *
     * @method patch
     * @param options {Object}          Patch options
     * @return this {OptionsManager}
     */
    OptionsManager.prototype.patch = function patch(options) {
        var myState = this._value;
        for (var key in options) {
            if ((key in myState) && (options[key] && options[key].constructor === Object) && (myState[key] && myState[key].constructor === Object)) {
                if (!myState.hasOwnProperty(key)) myState[key] = Object.create(myState[key]);
                this.key(key).patch(options[key]);
                if (this._eventHandler) this._eventHandler.emit('change', {key: key, value: this.key(key).value()});
            }
            else this.set(key, options[key]);
        }
        return this;
    };

    /**
     * Alias for patch
     *
     * @method setOptions
     */
    OptionsManager.prototype.setOptions = OptionsManager.prototype.patch;

    /**
     * Return OptionsManager based on sub-object retrieved by `key`.
     *
     * @method key
     * @param key {string}      Key
     * @return {OptionsManager} Value
     */
    OptionsManager.prototype.key = function key(key) {
        var result = new OptionsManager(this._value[key]);
        if (!(result._value instanceof Object) || result._value instanceof Array) result._value = {};
        return result;
    };

    /**
     * Look up options value by key or get the full options hash.
     *
     * @method get
     * @param key {string}  Key
     * @return {Object}     Associated object or full options hash
     */
    OptionsManager.prototype.get = function get(key) {
        return key ? this._value[key] : this._value;
    };

    /**
     * Alias for get
     *
     * @method getOptions
     */
    OptionsManager.prototype.getOptions = OptionsManager.prototype.get;

    /**
     * Set key to value. Outputs `change` event if a value is overwritten.
     *
     * @method set
     * @param key {string}          Key
     * @param value {Object}        Value
     * @return {OptionsManager}     Updated OptionsManager
     */
    OptionsManager.prototype.set = function set(key, value) {
        var originalValue = this.get(key);
        this._value[key] = value;
        if (this._eventHandler && value !== originalValue) this._eventHandler.emit('change', {key: key, value: value});
        return this;
    };

    /**
     * Adds a handler to the `type` channel which will be executed on `emit`.
     *
     * @method "on"
     * @param type {String}         Channel name
     * @param handler {Function}    Callback
     */
    OptionsManager.prototype.on = function on(type, handler) {
        _createEventHandler.call(this);
        EventHandler.prototype.on.apply(this._eventHandler, arguments);
    };

    /**
     * Removes the `handler` from the `type` channel.
     *   This undoes the work of `on`.
     *
     * @method off
     * @param type {String}         Channel name
     * @param handler {Function}    Callback
     */
    OptionsManager.prototype.off = function off(type, handler) {
        _createEventHandler.call(this);
        EventHandler.prototype.off.apply(this._eventHandler, arguments);
    };

    function _clone(obj) {
        var copy;
        if (typeof obj === 'object') {
            copy = (obj instanceof Array) ? [] : {};
            for (var key in obj) {
                var value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    if (value instanceof Array) {
                        copy[key] = [];
                        for (var i = 0; i < value.length; i++)
                            copy[key][i] = _clone(value[i]);
                    }
                    else copy[key] = _clone(value);
                }
                else copy[key] = value;
            }
        }
        else copy = obj;

        return copy;
    }

    module.exports = OptionsManager;
});
