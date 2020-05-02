/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');

    /**
     *  A utility for setting options in a class that enables patching options
     *   with prescribed defaults and emitting `change` events when options are changed.
     *   Recursively defined for nested options objects.
     *
     *   Note: only JSON-able objects are allowed, so no functions.
     *
     * @class OptionsManager
     * @namespace Core
     * @constructor
     * @uses Core.EventHandler
     * @param value {Object} Options object literal
     */
    function OptionsManager(value) {
        this._value = value;
        this._eventHandler = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventHandler);
    }

    /**
     * Constructor method. Convenience method to set options with defaults on an object instance.
     *
     * @method OptionsManager.setOptions
     * @static
     * @param instance {Function}    Constructor
     * @param options {Object}       Overriding options
     * @param defaults {Object}      Default options
     * @return {Object}              Patched options
     */
    // TODO: subscribe to change events
    OptionsManager.setOptions = function(instance, options, defaults){
        defaults = defaults || clone(instance.constructor.DEFAULT_OPTIONS) || {};
        var optionsManager = new OptionsManager(defaults);
        instance.setOptions = OptionsManager.prototype.setOptions.bind(optionsManager);
        instance.getOptions = OptionsManager.prototype.getOptions.bind(optionsManager);
        if (options) instance.setOptions(options);
        return optionsManager.getOptions();
    };

    /**
     * Patch options with new values. Emits a `change` event if the values have changed.
     *
     * @method setOptions
     * @param patch {Object}          Patch options
     */
    OptionsManager.prototype.setOptions = function setOptions(patch) {
        var options = this._value;

        for (var key in patch) {
            var patchValue = patch[key];

            if (key in options) {
                if (patchValue !== null && patchValue !== undefined && patchValue.constructor === Object){
                    // patched value is object
                    if (options[key] && options[key].constructor === Object){
                        // options is also an object, so patch it with the patched values
                        var subOptionsManager = new OptionsManager(options[key]);

                        subOptionsManager.on('change', function(key, value){
                            this.emit('change', {key : key, value : value});
                        }.bind(this, key));

                        subOptionsManager.setOptions(Object.create(patchValue));
                        options[key] = subOptionsManager.getOptions();
                    }
                    else {
                        // options is a simple type, so overwrite with the patched value
                        options[key] = patchValue;
                        this.emit('change', {key : key, value : patchValue});
                    }
                }
                else {
                    // patched value is simple type, so overwrite object's value
                    var prevValue = this.getOptions(key);
                    if (patchValue !== prevValue) {
                        options[key] = patchValue;
                        this.emit('change', {key : key, value : patchValue});
                    }
                }
            }
            else {
                options[key] = patchValue;
                this.emit('change', {key : key, value : patchValue});
            }
        }
    };

    /**
     * Look up options value by key or get the full options hash.
     *
     * @method getOptions
     * @param key {String}  Key
     * @return {Object}     Associated object or full options hash
     */
    OptionsManager.prototype.getOptions = function getOptions(key) {
        return key ? this._value[key] : this._value;
    };

    /**
     * Clone a JSON object. Supports null and undefined values.
     *
     * @method _clone
     * @private
     * @param obj {Object}      JSON object
     * @return {Object}         Cloned object
     */
    function clone(obj) {
        var copy;
        if (typeof obj === 'object') {
            copy = (obj instanceof Array) ? [] : {};
            for (var key in obj) {
                var value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    if (value instanceof Array) {
                        copy[key] = [];
                        for (var i = 0; i < value.length; i++)
                            copy[key][i] = clone(value[i]);
                    }
                    else copy[key] = clone(value);
                }
                else copy[key] = value;
            }
        }
        else copy = obj;

        return copy;
    }

    module.exports = OptionsManager;
});
