/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var RESERVED_KEYS = {
        DEFAULTS : 'defaults',
        EVENTS   : 'events'
    };

    module.exports = function extend(protoObj, constants){
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
});