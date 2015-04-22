/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var EventHandler = require('./../core/EventHandler');
    var OptionsManager = require('./../core/OptionsManager');
    var RenderNode = require('./../core/RenderNode');
    var Utility = require('./../core/Utility');
    var Transform = require('./../core/Transform');
    var Spec = require('./../core/Spec');
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

        this.spec  = new Spec();
        this.state = new StateManager();

        this._sizeDirty = true;
        this._isView = true;

        this.options = Utility.clone(this.constructor.DEFAULT_OPTIONS || View.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
        EventHandler.setInputEvents(this, this.constructor.EVENTS || View.EVENTS, this._eventInput);

        this._eventInput.bindThis(this);
        this._eventInput.subscribe(this._optionsManager);
    }

    View.prototype = Object.create(RenderNode.prototype);
    View.prototype.constructor = View;

    View.DEFAULT_OPTIONS = {
        size : null,
        origin : null
    };

    View.EVENTS = {};

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

    View.prototype.isStateDirty = function(){
        return this.state.isDirty();
    };

    View.prototype.setSizeDirty = function(){
        return this._sizeDirty = true;
    };

    View.prototype.setSizeClean = function(){
        return this._sizeDirty = false;
    };

    View.prototype.isSizeDirty = function(){
        return this._sizeDirty;
    };

    var RESERVED_KEYS = {
        DEFAULTS : 'defaults',
        EVENTS   : 'events',
        NAME     : 'name'
    };

    function extend(obj, constants){
        var constructor = (function(){
            return function (options){
                View.call(this, options);
                if (this.initialize) this.initialize(this.options);
            }
        })();

        constructor.extend = extend;
        constructor.prototype = Object.create(View.prototype);
        constructor.prototype.constructor = constructor;

        for (var key in obj){
            var value = obj[key];
            switch (key) {
                case RESERVED_KEYS.DEFAULTS:
                    constructor.DEFAULT_OPTIONS = value;
                    break;
                case RESERVED_KEYS.EVENTS:
                    constructor.EVENTS = value;
                    break;
                case RESERVED_KEYS.NAME:
                    break;
                default:
                    constructor.prototype[key] = value;
            }
        }

        for (var key in constants)
            constructor[key] = constants[key];

        return constructor;
    }

    View.extend = extend;

    module.exports = View;
});