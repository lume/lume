/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var OptionsManager = require('famous/core/OptionsManager');
    var RenderNode = require('famous/core/RenderNode');
    var StateManager = require('famous/core/StateManager');

    /**
     * Useful for quickly creating elements within applications
     *   with large event systems.  Consists of a RenderNode paired with
     *   an input EventHandler and an output EventHandler.
     *   Meant to be extended by the developer.
     *
     * @class View
     * @uses EventHandler
     * @uses OptionsManager
     * @uses RenderNode
     * @constructor
     */
    function View(options) {
        RenderNode.apply(this);

        // setup options
        this.options = _clone(this.constructor.DEFAULT_OPTIONS || View.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        // setup state
        this.state = new StateManager(this.constructor.STATE_TYPES || View.STATE_TYPES);
        this._dirty = true;

        // setup events
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
        EventHandler.setInputEvents(this, this.constructor.EVENTS || View.EVENTS, this._eventInput);
        this._eventInput.bindThis(this);

        this._eventInput.subscribe(this._optionsManager);
        this._eventInput.subscribe(this.state);

        // initialize view
        if (this.initialize) this.initialize(this.options);
    }

    View.prototype = Object.create(RenderNode.prototype);
    View.prototype.constructor = View;

    View.DEFAULT_OPTIONS = {
        size : null,
        origin : null
    };

    View.EVENTS = {
        dirty : function(){this._dirty = true;},
        clean : function(){this._dirty = false;}
    };

    View.STATE_TYPES = {};

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
    View.prototype.getOptions = function getOptions(key) {
        return OptionsManager.prototype.getOptions.apply(this._optionsManager, arguments);
    };

    /*
     *  Set internal options.
     *  No defaults options are set in View.
     *
     *  @method setOptions
     *  @param {Object} options
     */
    View.prototype.setOptions = function setOptions() {
        OptionsManager.prototype.setOptions.apply(this._optionsManager, arguments);
    };

    View.prototype.getEventInput = function getEventInput(){
        return this._eventInput;
    };

    View.prototype.getEventOutput = function getEventInput(){
        return this._eventOutput;
    };

    View.prototype.cleanState = function(){
        this.state.clean();
    };

    var RESERVED_KEYS = {
        DEFAULTS : 'defaults',
        EVENTS   : 'events',
        STATE_TYPES : 'state'
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
                    for (var key in View.EVENTS)
                        child.EVENTS[key] = View.EVENTS[key];
                    break;
                case RESERVED_KEYS.STATE_TYPES:
                    child.STATE_TYPES = value;
                    break;
                default:
                    child.prototype[key] = value;
            }
        }

        for (var key in constants)
            child[key] = constants[key];

        return child;
    }

    View.extend = extend;

    module.exports = View;
});