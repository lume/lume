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
    var Utility = require('./../core/Utility');

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
        this.options = Utility.clone(this.constructor.DEFAULT_OPTIONS || Controller.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
        EventHandler.setInputEvents(this, this.constructor.EVENTS || Controller.EVENTS, this._eventInput);

        this._eventInput.bindThis(this);
        this._eventInput.subscribe(this._optionsManager);
    }

    Controller.DEFAULT_OPTIONS = {};
    Controller.EVENTS = {};

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
        EVENTS   : 'events',
        NAME     : 'name'
    };

    function extend(obj, constants){
        var constructor = (function(){
            return function (options){
                Controller.call(this, options);
                if (this.initialize) this.initialize(this.options);
            }
        })();

        constructor.extend = extend;
        constructor.prototype = Object.create(Controller.prototype);
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

    Controller.extend = extend;

    module.exports = Controller;
});
