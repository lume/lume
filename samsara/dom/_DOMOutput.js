/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var Transform = require('../core/Transform');

    var usePrefix = !('transform' in window.document.documentElement.style);
    var usePrefixPerspective = !('perspective' in window.document.documentElement.style);

    var devicePixelRatio = 2 * (window.devicePixelRatio || 1);
    var MIN_OPACITY = 0.0001;
    var MAX_OPACITY = 0.9999;
    var EPSILON = 1e-5;
    var zeroArray = [0, 0];

    var stringMatrix3d = 'matrix3d(';
    var stringComma = ',';
    var stringParen = ')';
    var stringPx = 'px';

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
     * @param [options] {Object}                Options
     * @param [options.roundToPixel] {Boolean}  Prevents text-blurring if set to true, at the cost to jittery animation
     */
    function DOMOutput(options) {
        options = options || {};
        this._opacityDirty = true;
        this._originDirty = true;
        this._transformDirty = true;
        this._isVisible = true;
        this._roundToPixel = options.roundToPixel || false;
    }

    function _round(value, unit){
        return (unit === 1)
            ? Math.round(value)
            : Math.round(value * unit) / unit
    }

    function _formatCSSTransform(transform, unit) {
        var result = stringMatrix3d;
        for (var i = 0; i < 15; i++) {
            if (Math.abs(transform[i]) < EPSILON) transform[i] = 0;
            result += (i === 12 || i === 13)
                ? _round(transform[i], unit) + stringComma
                : transform[i] + stringComma;
        }
        return result + transform[15] + stringParen;
    }

    function _formatCSSOrigin(origin) {
        return (100 * origin[0]) + '% ' + (100 * origin[1]) + '%';
    }

    function _xyNotEquals(a, b) {
        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
    }

    var _setOrigin = (usePrefix)
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

    var _setPerspective = (usePrefixPerspective)
        ? function setPerspective(element, perspective) {
            element.style.webkitPerspective = perspective ? (perspective | 0) + 'px' : '0px';
        }
        : function setPerspective(element, perspective) {
            element.style.perspective = perspective ? (perspective | 0) + 'px' : '0px';
        };

    var _setPerspectiveOrigin = (usePrefixPerspective)
        ? function setPerspectiveOrigin(element, origin) {
            element.style.webkitPerspectiveOrigin = origin ? _formatCSSOrigin(origin) : '50% 50%';
        }
        : function setPerspectiveOrigin(element, origin) {
            element.style.perspectiveOrigin = origin ? _formatCSSOrigin(origin) : '50% 50%';
        };

    function _setSize(element, size){
        if (size[0] === true) size[0] = element.offsetWidth;
        else if (size[0] >= 0) element.style.width = size[0] + stringPx;

        if (size[1] === true) size[1] = element.offsetHeight;
        else if (size[1] >= 0) element.style.height = size[1] + stringPx;
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

    DOMOutput.getWidth = function getWidth(element){
        return element.clientWidth;
    };

    DOMOutput.getHeight = function getHeight(element){
        return element.clientHeight;
    };

    DOMOutput.getSize = function getSize(element){
        return [this.getWidth(element), this.getHeight(element)];
    };

    DOMOutput.querySelector = function querySelector(element, selector){
        return element.querySelector(selector);
    };

    DOMOutput.querySelectorAll = function querySelectorAll(element, selector){
        return element.querySelectorAll(selector);
    };

    DOMOutput.applyClasses = function applyClasses(element, classList) {
        for (var i = 0; i < classList.length; i++)
            element.classList.add(classList[i]);
    };

    DOMOutput.applyClass = function applyClass(element, className) {
        element.classList.add(className);
    };

    DOMOutput.applyProperties = function applyProperties(element, properties) {
        for (var key in properties)
            element.style[key] = properties[key];
    };

    DOMOutput.applyAttributes = function applyAttributes(element, attributes) {
        for (var key in attributes)
            element.setAttribute(key, attributes[key]);
    };

    DOMOutput.removeClass = function removeClasses(element, className) {
        element.classList.remove(className);
    };

    DOMOutput.removeClasses = function removeClasses(element, classList) {
        for (var i = 0; i < classList.length; i++)
            element.classList.remove(classList[i]);
    };

    DOMOutput.removeProperties = function removeProperties(element, properties) {
        for (var key in properties)
            element.style[key] = '';
    };

    DOMOutput.removeAttributes = function removeAttributes(element, attributes) {
        for (var key in attributes)
            element.removeAttribute(key);
    };

    DOMOutput.on = function on(element, type, handler, useCapture) {
        element.addEventListener(type, handler, useCapture || false);
    };

    DOMOutput.off = function off(element, type, handler) {
        element.removeEventListener(type, handler);
    };

    DOMOutput.applyContent = function applyContent(element, content) {
        if (content instanceof Node) {
            while (element.hasChildNodes()) element.removeChild(element.firstChild);
            element.appendChild(content);
        }
        else element.innerHTML = content;
    };

    DOMOutput.recallContent = function recallContent(element) {
        var df = document.createDocumentFragment();
        while (element.hasChildNodes()) df.appendChild(element.firstChild);
        return df;
    };

    DOMOutput.promoteLayer = function (element){
        element.style.willChange = 'transform, opacity';
    };

    DOMOutput.demoteLayer = function(element) {
        element.style.willChange = 'auto';
    };

    DOMOutput.makeVisible = function makeVisible(element, size){
        element.style.display = '';

        // for true-sized elements, reset height and width
        if (size){
            if (size[0] === true) element.style.width = 'auto';
            if (size[1] === true) element.style.height = 'auto';
        }
    };

    DOMOutput.makeInvisible = function makeInvisible(element){
        element.style.display = 'none';
        element.style.opacity = '';
        element.style.width = '';
        element.style.height = '';

        if (usePrefix) {
            element.style.webkitTransform = '';
            element.style.webkitTransformOrigin = '';
        }
        else {
            element.style.transform = '';
            element.style.transformOrigin = '';
        }
    };

    DOMOutput.prototype.commitPerspective = _setPerspective;
    DOMOutput.prototype.commitPerspectiveOrigin = _setPerspectiveOrigin;

    DOMOutput.prototype.commitLayout = function commitLayout(element, layout, prevLayout) {
        var transform = layout.transform || Transform.identity;
        var opacity = (layout.opacity === undefined) ? 1 : layout.opacity;
        var origin = layout.origin || zeroArray;

        this._transformDirty = Transform.notEquals(prevLayout.transform, transform);
        this._opacityDirty = this._opacityDirty || (prevLayout.opacity !== opacity);
        this._originDirty = this._originDirty || (prevLayout && _xyNotEquals(prevLayout.origin, origin));

        if (this._opacityDirty) {
            prevLayout.opacity = opacity;
            _setOpacity.call(this, element, opacity);
        }

        if (this._originDirty){
            prevLayout.origin = origin;
            _setOrigin(element, origin);
        }

        if (this._transformDirty) {
            prevLayout.transform = transform;
            _setTransform(element, transform, this._roundToPixel ? 1 : devicePixelRatio);
        }

        this._originDirty = false;
        this._transformDirty = false;
        this._opacityDirty = false;
    };

    DOMOutput.prototype.commitSize = function commitSize(element, size, prevSize){
        if (size[0] !== true) size[0] = _round(size[0], devicePixelRatio);
        if (size[1] !== true) size[1] = _round(size[1], devicePixelRatio);

        if (_xyNotEquals(prevSize, size)){
            _setSize(element, size);
            return true;
        }
        else return false;
    };

    module.exports = DOMOutput;
});
