/*
 * copyright © 2015 David Valdman
 */

define(function(require, exports, module) {
    var EventHandler = require('./../core/EventHandler');
    var OptionsManager = require('./../core/OptionsManager');
    var extend = require('famous/utilities/extend');

    /**
     * Useful for quickly creating elements within applications
     *   with large event systems.  Consists of a RenderNode paired with
     *   an input EventHandler and an output EventHandler.
     *   Meant to be extended by the developer.
     *
     * @class Controller
     * @uses EventHandler
     * @uses OptionsManager
     * @constructor
     */
    function Controller(options) {
        this.options = _clone(this.constructor.DEFAULT_OPTIONS || Controller.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
        EventHandler.setInputEvents(this, this.constructor.EVENTS || Controller.EVENTS, this._eventInput);

        this._eventInput.bindThis(this);
        this._eventInput.subscribe(this._optionsManager);

        if (this.initialize) this.initialize(this.options);
    }

    Controller.DEFAULT_OPTIONS = {};
    Controller.EVENTS = {};

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

    /**
     * Look up options value by key
     * @method getOptions
     *
     * @param {string} key key
     * @return {Object} associated object
     */
    Controller.prototype.getOptions = function getOptions(key) {
        return OptionsManager.prototype.getOptions.apply(this._optionsManager, arguments);
    };

    /*
     *  Set internal options.
     *  No defaults options are set in View.
     *
     *  @method setOptions
     *  @param {Object} options
     */
    Controller.prototype.setOptions = function setOptions() {
        OptionsManager.prototype.setOptions.apply(this._optionsManager, arguments);
    };

    Controller.prototype.getEventInput = function getEventInput(){
        return this._eventInput;
    };

    Controller.prototype.getEventOutput = function getEventInput(){
        return this._eventOutput;
    };

    var RESERVED_KEYS = {
        DEFAULTS : 'defaults',
        EVENTS   : 'events'
    };

    function extend(protoObj, constants){
        var parent = this;

        var child = (protoObj.hasOwnProperty('constructor'))
            ? function(){ protoObj.constructor.apply(this, arguments); }
            : function(){ parent.apply(this, arguments); };

        child.extend = extend;
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;

        for (var key in protoObj){
            var value = protoObj[key];
            switch (key) {
                case RESERVED_KEYS.DEFAULTS:
                    child.DEFAULT_OPTIONS = value;
                    break;
                case RESERVED_KEYS.EVENTS:
                    child.EVENTS = value;
                    break;
                default:
                    child.prototype[key] = value;
            }
        }

        for (var key in constants)
            child[key] = constants[key];

        return child;
    }

    Controller.extend = extend;

    module.exports = Controller;
});
