/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var Transform = require('../core/Transform');

    var usePrefix = !('transform' in window.document.documentElement.style);
    var devicePixelRatio = 2 * (window.devicePixelRatio || 1);
    var MIN_OPACITY = 0.0001;
    var MAX_OPACITY = 0.9999;
    var EPSILON = 1e-5;
    var _zeroZero = [0, 0];

    /**
     * Responsible for committing CSS3 properties to the DOM and providing DOM event hooks
     *  from a provided DOM element. Where Surface's API handles inputs from the developer
     *  from within Samsara, ElementOutput handles the DOM interaction layer.
     *
     *
     * @class DOMOutput
     * @constructor
     * @namespace Core
     * @uses Core.LayoutNode
     * @uses Core.SizeNode
     * @private
     * @param {Node} element document parent of this container
     */
    function DOMOutput() {
        this._cachedSpec = {};
        this._opacityDirty = true;
        this._originDirty = true;
        this._transformDirty = true;
        this._isVisible = true;
        this._roundToPixel = false;
    }

    function _round(value, unit){
        return (unit === 1)
            ? Math.round(value)
            : Math.round(value * unit) / unit
    }

    function _formatCSSTransform(transform, unit) {
        var result = 'matrix3d(';
        for (var i = 0; i < 15; i++) {
            if (Math.abs(transform[i]) < EPSILON) transform[i] = 0;
            result += (i === 12 || i === 13)
                ? _round(transform[i], unit) + ','
                : transform[i] + ',';
        }
        return result + transform[15] + ')';
    }

    function _formatCSSOrigin(origin) {
        return (100 * origin[0]) + '% ' + (100 * origin[1]) + '%';
    }

    function _xyNotEquals(a, b) {
        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
    }

    var _setOrigin = usePrefix
        ? function _setOrigin(element, origin) {
            element.style.webkitTransformOrigin = _formatCSSOrigin(origin);
        }
        : function _setOrigin(element, origin) {
            element.style.transformOrigin = _formatCSSOrigin(origin);
        };

    var _setTransform = (usePrefix)
        ? function _setTransform(element, transform, unit) {
            element.style.webkitTransform = _formatCSSTransform(transform, unit);
        }
        : function _setTransform(element, transform, unit) {
            element.style.transform = _formatCSSTransform(transform, unit);
        };

    function _setSize(target, size){
        if (size[0] === true) size[0] = target.offsetWidth;
        else if (size[0] >= 0) target.style.width = size[0] + 'px';

        if (size[1] === true) size[1] = target.offsetHeight;
        else if (size[1] >= 0) target.style.height = size[1] + 'px';
    }

    // pointerEvents logic allows for DOM events to pass through the element when invisible
    function _setOpacity(element, opacity) {
        if (!this._isVisible && opacity > MIN_OPACITY) {
            element.style.pointerEvents = 'auto';
            this._isVisible = true;
        }

        if (opacity > MAX_OPACITY) opacity = MAX_OPACITY;
        else if (opacity < MIN_OPACITY) {
            opacity = MIN_OPACITY;
            if (this._isVisible) {
                element.style.pointerEvents = 'none';
                this._isVisible = false;
            }
        }

        element.style.opacity = opacity;
    }

    DOMOutput.prototype.querySelector = function querySelector(target, selector){
        return target.querySelector(selector);
    };

    DOMOutput.prototype.querySelectorAll = function querySelectorAll(target, selector){
        return target.querySelectorAll(selector);
    };

    DOMOutput.prototype.applyClasses = function applyClasses(target, classList) {
        for (var i = 0; i < classList.length; i++)
            target.classList.add(classList[i]);
    };

    DOMOutput.prototype.applyProperties = function applyProperties(target, properties) {
        for (var key in properties)
            target.style[key] = properties[key];
    };

    DOMOutput.prototype.applyAttributes = function applyAttributes(target, attributes) {
        for (var key in attributes)
            target.setAttribute(key, attributes[key]);
    };

    DOMOutput.prototype.removeClasses = function removeClasses(target, classList) {
        for (var i = 0; i < classList.length; i++)
            target.classList.remove(classList[i]);
    };

    DOMOutput.prototype.removeProperties = function removeProperties(target, properties) {
        for (var key in properties)
            target.style[key] = '';
    };

    DOMOutput.prototype.removeAttributes = function removeAttributes(target, attributes) {
        for (var key in attributes)
            target.removeAttribute(key);
    };

    DOMOutput.prototype.on = function on(target, type, handler) {
        target.addEventListener(type, handler);
    };

    DOMOutput.prototype.off = function off(target, type, handler) {
        target.removeEventListener(type, handler);
    };

    DOMOutput.prototype.applyContent = function applyContent(target, content) {
        if (content instanceof Node) {
            while (target.hasChildNodes()) target.removeChild(target.firstChild);
            target.appendChild(content);
        }
        else target.innerHTML = content;
    };

    DOMOutput.prototype.recallContent = function recallContent(target) {
        var df = document.createDocumentFragment();
        while (target.hasChildNodes()) df.appendChild(target.firstChild);
        return df;
    };

    DOMOutput.prototype.makeVisible = function makeVisible(target){
        target.style.display = '';

        // for true-sized elements, reset height and width
        if (this._cachedSize) {
            if (this._cachedSize[0] === true) target.style.width = 'auto';
            if (this._cachedSize[1] === true) target.style.height = 'auto';
        }
    };

    DOMOutput.prototype.makeInvisible = function makeInvisible(target){
        target.style.display = 'none';
        target.style.opacity = '';
        target.style.width = '';
        target.style.height = '';

        if (usePrefix) {
            target.style.webkitTransform = '';
            target.style.webkitTransformOrigin = '';
        }
        else {
            target.style.transform = '';
            target.style.transformOrigin = '';
        }

        this._cachedSpec = {};
    };

    DOMOutput.prototype.commitLayout = function commitLayout(target, layout) {
        var cache = this._cachedSpec;

        var transform = layout.transform || Transform.identity;
        var opacity = (layout.opacity === undefined) ? 1 : layout.opacity;
        var origin = layout.origin || _zeroZero;

        this._transformDirty = Transform.notEquals(cache.transform, transform);
        this._opacityDirty = this._opacityDirty || (cache.opacity !== opacity);
        this._originDirty = this._originDirty || (origin && _xyNotEquals(cache.origin, origin));

        if (this._opacityDirty) {
            cache.opacity = opacity;
            _setOpacity.call(this, target, opacity);
        }

        if (this._originDirty){
            cache.origin = origin;
            _setOrigin(target, origin);
        }

        if (this._transformDirty) {
            cache.transform = transform;
            _setTransform(target, transform, this._roundToPixel ? 1 : devicePixelRatio);
        }

        this._originDirty = false;
        this._transformDirty = false;
        this._opacityDirty = false;
    };

    DOMOutput.prototype.commitSize = function commitSize(target, size){
        if (size[0] !== true) size[0] = _round(size[0], devicePixelRatio);
        if (size[1] !== true) size[1] = _round(size[1], devicePixelRatio);

        if (_xyNotEquals(this._cachedSpec.size, size)){
            this._cachedSpec.size = size;
            _setSize(target, size);
            return true;
        }
        else return false;
    };

    DOMOutput.prototype.promoteLayer = function (target){
        target.style.willChange = 'transform, opacity';
    };

    DOMOutput.prototype.demoteLayer = function(target) {
        target.style.willChange = 'auto';
    };

    module.exports = DOMOutput;
});
