/*
 * copyright © 2015 David Valdman
 */

define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');
    var SimpleStream = require('samsara/streams/SimpleStream');
    var OptionsManager = require('samsara/core/OptionsManager');

    /**
     * A utility class which can be extended by custom classes. These classes will then
     *  include event input and output streams, a optionsManager for handling optional
     *  parameters with defaults, and take an event dictionary.
     *
     *  Specifically, instantiations will have an `options` dictionary property,
     *  `_eventInput`, `_eventOutput` stream properties, and
     *  `on`, `off`, `emit`, `trigger`, `subscribe`, `unsubscribe` methods.
     *
     *  @example
     *      var MyClass = Controller.extend({
     *          defaults : {
     *              defaultOption1 : value1,
     *              defaultOption2 : value2
     *          },
     *          events : {
     *              'change' : myUpdateFunction
     *          },
     *          initialize : function(options){
     *              // this method called on instantiation
     *              // options are passed in after being patched by the specified defaults
     *
     *              this._eventInput.on('test', function(){
     *                  console.log('test fired');
     *              });
     *          }
     *      });
     *
     *      var myInstance = new MyClass({
     *          defaultOption1 : value3
     *      });
     *
     *      // myInstance.options = {
     *      //     defaultOption1 : value3,
     *      //     defaultOption2 : value2
     *      // }
     *
     *      myInstance.subscribe(anotherStream);
     *
     *      anotherStream.emit('test'); // "test fired" in console
     *
     * @class Controller
     * @constructor
     * @uses OptionsManager
     * @uses SimpleStream
     * @param options {Object} Instance options
     */
    function Controller(options) {
        this.options = _clone(this.constructor.DEFAULT_OPTIONS || Controller.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._eventInput = new SimpleStream();
        this._eventOutput = new SimpleStream();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
        EventHandler.setInputEvents(this, this.constructor.EVENTS || Controller.EVENTS, this._eventInput);

        this._eventInput.bindThis(this);
        this._eventInput.subscribe(this._optionsManager);

        if (this.initialize) this.initialize(this.options);
    }

    /**
     * Overwrite the DEFAULT_OPTIONS dictionary on the constructor of the class you wish to extend
     *  with the Controller to patch any options that are not prescribed on instantiation.
     *
     * @attribute DEFAULT_OPTIONS
     * @readOnly
     */
    Controller.DEFAULT_OPTIONS = {};

    /**
     * Overwrite the EVENTS dictionary on the constructor of the class you wish to extend
     *  with the Controller to include events in {key : value} pairs where the keys are
     *  event channel names and the values are functions to be executed.
     *
     * @attribute DEFAULT_OPTIONS
     * @readOnly
     */
    Controller.EVENTS = {};

    /**
     * Options getter.
     *
     * @method getOptions
     * @param key {string}      Key
     * @return object {Object}  Options value for the key
     */
    Controller.prototype.getOptions = function getOptions(key) {
        return OptionsManager.prototype.getOptions.apply(this._optionsManager, arguments);
    };

    /**
     *  Options setter.
     *
     *  @method setOptions
     *  @param options {Object} Options
     */
    Controller.prototype.setOptions = function setOptions() {
        OptionsManager.prototype.setOptions.apply(this._optionsManager, arguments);
    };

    var RESERVED_KEYS = {
        DEFAULTS : 'defaults',
        EVENTS : 'events'
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
                    if (!child.EVENTS) child.EVENTS = value;
                    else
                        for (var key in value)
                            child.EVENTS[key] = value[key];
                    break;
                default:
                    child.prototype[key] = value;
            }
        }


        for (var key in constants)
            child[key] = constants[key];

        return child;
    }

    /**
     * Allows a class to extend Controller.
     *  Note: this is a method defined on the Controller constructor
     *
     * @method extend
     * @param protoObj {Object}     Prototype properties of the extended class
     * @param constants {Object}    Constants to be added to the extended class's constructor
     */
    Controller.extend = extend;

    module.exports = Controller;
});
