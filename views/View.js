/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var EventHandler = require('./../core/EventHandler');
    var OptionsManager = require('./../core/OptionsManager');
    var RenderNode = require('./../core/RenderNode');
    var Utility = require('./../core/Utility');

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
        this._node = new RenderNode();

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

    View.DEFAULT_OPTIONS = {};
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

    View.prototype.set = function set() {
        return RenderNode.prototype.set.apply(this._node, arguments);
    };

    /**
     * Add a child renderable to the view.
     *   Note: This is meant to be used by an inheriting class
     *   rather than from outside the prototype chain.
     *
     * @method add
     * @return {RenderNode}
     * @protected
     */
    View.prototype.add = function add() {
        return RenderNode.prototype.add.apply(this._node, arguments);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    View.prototype.render = function render() {
        return RenderNode.prototype.render.apply(this._node, arguments);
    };

    /**
     * Return size of contained element.
     *
     * @method getSize
     * @return {Array.Number} [width, height]
     */
    View.prototype.getSize = function getSize() {
        return (this._node && this._node.getSize)
            ? RenderNode.prototype.getSize.apply(this._node, arguments)
            : this.options.size;
    };

    View.prototype.getEventInput = function getEventInput(){
        return this._eventInput;
    };

    View.prototype.getEventOutput = function getEventInput(){
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
                View.call(this, options);
                if (this.initialize) this.initialize(options);
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
    };

    View.extend = extend;

    module.exports = View;
});
