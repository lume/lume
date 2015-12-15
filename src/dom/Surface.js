/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Samsara Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var ElementOutput = require('../core/ElementOutput');
    var dirtyQueue = require('../core/queues/dirtyQueue');

    var isTouchEnabled = "ontouchstart" in window;

    /**
     * Surface is a wrapper for a DOM element animated by Samsara.
     *  Samsara will commit opacity, size and CSS3 `transform` properties into the Surface.
     *  CSS classes, properties and DOM attributes can also be added and dynamically changed.
     *  Surfaces also act as sources for DOM events such as `click`.
     *
     * @example
     *
     *      var context = new Context()
     *
     *      var surface = new Surface({
     *          content : 'Hello world!',
     *          size : [true,100],
     *          opacity : .5,
     *          classes : ['myClass1', 'myClass2'],
     *          properties : {background : 'red'}
     *      });
     *
     *      context.add(surface);
     *
     *      context.mount(document.body);
     *
     *  @example
     *
     *      // same as above but create an image instead
     *      var surface = new Surface({
     *          attributes : {
     *              src : 'cat.jpg'
     *          },
     *          size : [100,100],
     *          tagName : 'img'
     *      });
     *
     * @class Surface
     * @namespace DOM
     * @constructor
     * @extends Core.ElementOutput
     * @param [options] {Object}                Options
     * @param [options.size] {Number[]}         Size (width, height) in pixels. These can also be `true` or `undefined`.
     * @param [options.classes] {String[]}      CSS classes
     * @param [options.properties] {Object}     Dictionary of CSS properties
     * @param [options.attributes] {Object}     Dictionary of HTML attributes
     * @param [options.content] Sstring}        InnerHTML content
     * @param [options.origin] {Number[]}       Origin (x,y), with values between 0 and 1
     * @param [options.margins] {Number[]}      Margins (x,y) in pixels
     * @param [options.proportions] {Number[]}  Proportions (x,y) with values between 0 and 1
     * @param [options.aspectRatio] {Number}    Aspect ratio
     * @param [options.opacity=1] {Number}      Opacity
     * @param [options.tagName="div"] {String}  HTML tagName
     * @param [options.enableScroll] {Boolean}  Allows a Surface to support native scroll behavior
     */
    function Surface(options) {
        this.properties = {};
        this.attributes = {};
        this.content = '';
        this.classList = [];

        this._contentDirty = true;
        this._dirtyClasses = [];
        this._classesDirty = true;
        this._stylesDirty = true;
        this._attributesDirty = true;
        this._dirty = false;
        this._cachedSize = null;

        if (options) {
            // default to DOM size for provided elements
            if (options.el && !options.size){
                this._contentDirty = false;
                options.size = [true, true];
            }

            ElementOutput.call(this, options.el);
            this.setOptions(options);
        }
        else ElementOutput.call(this);
    }

    Surface.prototype = Object.create(ElementOutput.prototype);
    Surface.prototype.constructor = Surface;
    Surface.prototype.elementType = 'div'; // Default tagName. Can be overridden in options.
    Surface.prototype.elementClass = 'samsara-surface';

    function _setDirty(){
        if (this._dirty || !this._currentTarget) return;

        dirtyQueue.push(function(){
            var target = this._currentTarget;

            if (this._classesDirty) {
                _removeClasses.call(this, target);
                _applyClasses.call(this, target);
            }

            if (this._stylesDirty) _applyProperties.call(this, target);

            if (this._attributesDirty) _applyAttributes.call(this, target);

            if (this._contentDirty) this.deploy(target);

            this._dirty = false;
        }.bind(this))
    }

    function _applyClasses(target) {
        for (var i = 0; i < this.classList.length; i++)
            target.classList.add(this.classList[i]);
        this._classesDirty = false;
    }

    function _applyProperties(target) {
        for (var key in this.properties)
            target.style[key] = this.properties[key];
        this._stylesDirty = false;
    }

    function _applyAttributes(target) {
        for (var key in this.attributes)
            target.setAttribute(key, this.attributes[key]);
        this._attributesDirty = false;
    }

    function _removeClasses(target) {
        for (var i = 0; i < this._dirtyClasses.length; i++) target.classList.remove(this._dirtyClasses[i]);
        this._dirtyClasses = [];
    }

    function _removeProperties(target) {
        for (var key in this.properties)
            target.style[key] = '';
    }

    function _removeAttributes(target) {
        for (var key in this.attributes)
            target.removeAttribute(key);
    }

    function preventDrag(){
        if (this._currentTarget){
            this._currentTarget.addEventListener('touchmove', function (event) {
                event.preventDefault();
            }, false);
        }
        else {
            this.on('deploy', function (target) {
                target.addEventListener('touchmove', function (event) {
                    event.preventDefault();
                }, false);
            }.bind(this));
        }
    }

    function enableScroll(){
        this.addClass('samsara-scrollable');
    }
    
    /**
     * Setter for HTML attributes.
     *
     * @method setAttributes
     * @chainable
     * @param attributes {Object}   HTML Attributes
     */
    Surface.prototype.setAttributes = function setAttributes(attributes) {
        for (var key in attributes) {
            var value = attributes[key];
            if (value != undefined) this.attributes[key] = attributes[key];
        }
        this._attributesDirty = true;
        _setDirty.call(this);
        return this;
    };

    /**
     * Getter for HTML attributes.
     *
     * @method getAttributes
     * @return {Object}
     */
    Surface.prototype.getAttributes = function getAttributes() {
        return this.attributes;
    };

    /**
     * Setter for CSS properties.
     *  Note: properties are camelCased, not hyphenated.
     *
     * @method setProperties
     * @chainable
     * @param properties {Object}   CSS properties
     */
    Surface.prototype.setProperties = function setProperties(properties) {
        for (var key in properties)
            this.properties[key] = properties[key];
        this._stylesDirty = true;
        _setDirty.call(this);
        return this;
    };

    /**
     * Getter for CSS properties.
     *
     * @method getProperties
     * @return {Object}             Dictionary of this Surface's properties.
     */
    Surface.prototype.getProperties = function getProperties() {
        return this.properties;
    };

    /**
     * Add CSS class to the list of classes on this Surface.
     *
     * @method addClass
     * @chainable
     * @param className {String}    Class name
     */
    Surface.prototype.addClass = function addClass(className) {
        if (this.classList.indexOf(className) < 0) {
            this.classList.push(className);
            this._classesDirty = true;
            _setDirty.call(this);
        }
        return this;
    };

    /**
     * Remove CSS class from the list of classes on this Surface.
     *
     * @method removeClass
     * @param className {string}    Class name
     */
    Surface.prototype.removeClass = function removeClass(className) {
        var i = this.classList.indexOf(className);
        if (i >= 0) {
            this._dirtyClasses.push(this.classList.splice(i, 1)[0]);
            this._classesDirty = true;
            _setDirty.call(this);
        }
    };

    /**
     * Toggle CSS class for this Surface.
     *
     * @method toggleClass
     * @param  className {String}   Class name
     */
    Surface.prototype.toggleClass = function toggleClass(className) {
        var i = this.classList.indexOf(className);
        (i == -1)
            ? this.addClass(className)
            : this.removeClass(className);
    };

    /**
     * Reset classlist.
     *
     * @method setClasses
     * @chainable
     * @param classlist {String[]}  ClassList
     */
    Surface.prototype.setClasses = function setClasses(classList) {
        var removal = [];
        for (var i = 0; i < this.classList.length; i++) {
            if (classList.indexOf(this.classList[i]) < 0) removal.push(this.classList[i]);
        }
        for (i = 0; i < removal.length; i++) this.removeClass(removal[i]);
        // duplicates are already checked by addClass()
        for (i = 0; i < classList.length; i++) this.addClass(classList[i]);
        _setDirty.call(this);
        return this;
    };

    /**
     * Get array of CSS classes attached to this Surface.
     *
     * @method getClasslist
     * @return {String[]}
     */
    Surface.prototype.getClassList = function getClassList() {
        return this.classList;
    };

    /**
     * Set or overwrite innerHTML content of this Surface.
     *
     * @method setContent
     * @chainable
     * @param content {String|DocumentFragment} HTML content
     */
    Surface.prototype.setContent = function setContent(content) {
        if (this.content !== content) {
            this.content = content;
            this._contentDirty = true;
            _setDirty.call(this);
        }
        return this;
    };

    /**
     * Return innerHTML content of this Surface.
     *
     * @method getContent
     * @return {String}
     */
    Surface.prototype.getContent = function getContent() {
        return this.content;
    };

    /**
     * Set options for this surface
     *
     * @method setOptions
     * @param options {Object} Overrides for default options. See constructor.
     */
    Surface.prototype.setOptions = function setOptions(options) {
        if (options.tagName !== undefined) this.elementType = options.tagName;
        if (options.opacity !== undefined) this.setOpacity(options.opacity);
        if (options.size !== undefined) this.setSize(options.size);
        if (options.origin !== undefined) this.setOrigin(options.origin);
        if (options.proportions !== undefined) this.setProportions(options.proportions);
        if (options.margins !== undefined) this.setMargins(options.margins);
        if (options.classes !== undefined) this.setClasses(options.classes);
        if (options.properties !== undefined) this.setProperties(options.properties);
        if (options.attributes !== undefined) this.setAttributes(options.attributes);
        if (options.content !== undefined) this.setContent(options.content);
        if (options.aspectRatio !== undefined) this.setAspectRatio(options.aspectRatio);
        if (options.enableScroll) enableScroll.call(this);
        else if (isTouchEnabled) preventDrag.call(this);
    };

    /**
     * Allocates the element-type associated with the Surface, adds its given
     *  element classes, and prepares it for future committing.
     *
     *  This method is called upon the first `start` or `resize`
     *  event the Surface gets.
     *
     * @private
     * @method setup
     * @param allocator {ElementAllocator} Allocator
     */
    Surface.prototype.setup = function setup(allocator) {
        // create element of specific type
        var target = allocator.allocate(this.elementType);

        // add any element classes
        if (this.elementClass) {
            if (this.elementClass instanceof Array)
                for (var i = 0; i < this.elementClass.length; i++)
                    this.addClass(this.elementClass[i]);
            else this.addClass(this.elementClass);
        }

        // set the currentTarget and any bound listeners
        this.attach(target);

        _applyClasses.call(this, target);
        _applyProperties.call(this, target);
        _applyAttributes.call(this, target);
        this.deploy(target);
    };

    /**
     * Remove all Samsara-relevant data from the Surface.
     *
     * @private
     * @method remove
     * @param allocator {ElementAllocator} Allocator
     */
    Surface.prototype.remove = function remove(allocator) {
        var target = this._currentTarget;

        // cache the target's contents for later deployment
        this.recall(target);

        // hide the element
        target.style.display = 'none';
        target.style.opacity = '';
        target.style.width = '';
        target.style.height = '';

        // clear all styles, classes and attributes
        _removeProperties.call(this, target);
        _removeAttributes.call(this, target);
        _removeClasses.call(this, target);

        // garbage collect current target and remove bound event listeners
        this.detach();

        // store allocated node in cache for recycling
        allocator.deallocate(target);
    };

    /**
     * Insert the Surface's content into the currentTarget.
     *
     * @private
     * @method deploy
     * @param target {Node} DOM element to set content into
     */
    Surface.prototype.deploy = function deploy(target) {
        //TODO: make sure target.tagName is of correct type! Tag pools must be implemented.
        if (!target) return;
        var content = this.getContent();
        if (content instanceof Node) {
            while (target.hasChildNodes()) target.removeChild(target.firstChild);
            target.appendChild(content);
        }
        else target.innerHTML = content;

        this._contentDirty = false;
        this._eventOutput.emit('deploy', target);
    };

    /**
     * Cache the content of the Surface in a document fragment for future deployment.
     *
     * @private
     * @method recall
     * @param target {Node}
     */
    Surface.prototype.recall = function recall(target) {
        this._eventOutput.emit('recall');
        var df = document.createDocumentFragment();
        while (target.hasChildNodes()) df.appendChild(target.firstChild);
        this.setContent(df);
    };

    /**
     * Getter for size.
     *
     * @method getSize
     * @return {Number[]}
     */
    Surface.prototype.getSize = function getSize() {
        // TODO: remove cachedSize
        return this._cachedSpec.size || this._cachedSize;
    };

    /**
     * Setter for size.
     *
     * @method setSize
     * @param size {Number[]|Stream} Size as [width, height] in pixels, or a stream.
     */
    Surface.prototype.setSize = function setSize(size) {
        this._cachedSize = size;
        this._sizeNode.set({size : size});
        _setDirty.call(this);
    };

    /**
     * Setter for proportions.
     *
     * @method setProportions
     * @param proportions {Number[]|Stream} Proportions as [x,y], or a stream.
     */
    Surface.prototype.setProportions = function setProportions(proportions) {
        this._sizeNode.set({proportions : proportions});
        _setDirty.call(this);
    };

    /**
     * Setter for margins.
     *
     * @method setMargins
     * @param margins {Number[]|Stream} Margins as [width, height] in pixels, or a stream.
     */
    Surface.prototype.setMargins = function setMargins(margins) {
        this._sizeNode.set({margins : margins});
        _setDirty.call(this);
    };

    /**
     * Setter for aspect ratio. If only one of width or height is specified,
     *  the aspect ratio will replace the unspecified dimension by scaling
     *  the specified dimension by the value provided.
     *
     * @method setAspectRatio
     * @param aspectRatio {Number|Stream} Aspect ratio.
     */
    Surface.prototype.setAspectRatio = function setAspectRatio(aspectRatio) {
        this._sizeNode.set({aspectRatio : aspectRatio});
        _setDirty.call(this);
    };

    /**
     * Setter for origin.
     *
     * @method setOrigin
     * @param origin {Number[]|Stream} Origin as [x,y], or a stream.
     */
    Surface.prototype.setOrigin = function setOrigin(origin){
        this._layoutNode.set({origin : origin});
        this._originDirty = true;
        _setDirty.call(this);
    };

    /**
     * Setter for opacity.
     *
     * @method setOpacity
     * @param opacity {Number} Opacity
     */
    Surface.prototype.setOpacity = function setOpacity(opacity){
        this._layoutNode.set({opacity : opacity});
        this._opacityDirty = true;
        _setDirty.call(this);
    };

    module.exports = Surface;
});
