/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Samsara Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var ElementOutput = require('samsara/core/ElementOutput');

    /**
     * Surface is a wrapper for DOM element controlled by Samsara.
     *  Samsara will commit opacity, size and CSS3 `transform` properties into the Surface.
     *  CSS classes, properties and DOM attributes can also be added and dynamically changed.
     *  Surfaces also act as sources for DOM events such as `click`.
     *
     * @class Surface
     * @constructor
     * @extends ElementOutput
     *
     * @param [options] {Object}                Options
     * @param [options.size] {Number[]}         Size [width, height] in pixels. These can also be `true` or `undefined`.
     * @param [options.classes] {string[]}      CSS classes
     * @param [options.properties] {Object}     Dictionary of CSS properties
     * @param [options.attributes] {Object}     Dictionary of HTML attributes
     * @param [options.content] {string}        InnerHTML content
     * @param [options.origin] {Number[]}       Origin [x,y], with values between 0 and 1
     * @param [options.margins] {Number[]}      Margins [x,y] in pixels
     * @param [options.proportions] {Number[]}  Proportions [x,y] with values between 0 and 1
     * @param [options.opacity] {Number}        Opacity
     * @param [options.tagName] {string}        HTML tagName (default is "div")
     */
    function Surface(options) {
        this.properties = {};
        this.attributes = {};
        this.content = '';
        this.classList = [];

        this._dirtyClasses = [];
        this._classesDirty = true;
        this._stylesDirty = true;
        this._attributesDirty = true;
        this._sizeDirty = true;
        this._dirty = false;
        this._cachedSize = null;

        if (options) {
            this._contentDirty = false;

            // default to DOM size for provided elements
            if (options.el && !options.size)
                options.size = [true, true];

            ElementOutput.call(this, options.el);
            this.setOptions(options);
        }
        else {
            this._contentDirty = true;
            ElementOutput.call(this);
        }
    }

    Surface.prototype = Object.create(ElementOutput.prototype);
    Surface.prototype.constructor = Surface;
    Surface.prototype.elementType = 'div'; // default tagName, but can be overriden in options
    Surface.prototype.elementClass = 'samsara-surface';

    function _setDirty(){
        if (this._dirty) return;
        this._dirty = true;
        this.emit('dirty');
    }

    function _applyClasses(target) {
        for (var i = 0; i < this.classList.length; i++)
            target.classList.add(this.classList[i]);
    }

    function _applyStyles(target) {
        for (var key in this.properties)
            target.style[key] = this.properties[key];
    }

    function _applyAttributes(target) {
        for (var key in this.attributes)
            target.setAttribute(key, this.attributes[key]);
    }

    function _removeClasses(target) {
        for (var i = 0; i < this._dirtyClasses.length; i++) target.classList.remove(this._dirtyClasses[i]);
        this._dirtyClasses = [];
    }

    function _removeStyles(target) {
        for (var key in this.properties)
            target.style[key] = '';
    }

    function _removeAttributes(target) {
        for (var key in this.attributes)
            target.removeAttribute(key);
    }
    
    /**
     * Setter for HTML attributes.
     *
     * @method setAttributes
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
     * @return {Object} Dictionary of this Surface's properties.
     */
    Surface.prototype.getProperties = function getProperties() {
        return this.properties;
    };

    /**
     * Add CSS class to the list of classes on this Surface.
     *
     * @method addClass
     * @chainable
     * @param className {string}    Class name
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
     * @chainable
     * @param className {string}    Class name
     */
    Surface.prototype.removeClass = function removeClass(className) {
        var i = this.classList.indexOf(className);
        if (i >= 0) {
            this._dirtyClasses.push(this.classList.splice(i, 1)[0]);
            this._classesDirty = true;
            _setDirty.call(this);
        }
        return this;
    };

    /**
     * Toggle CSS class for this Surface.
     *
     * @method toggleClass
     * @chainable
     * @param  className {string}   Class name
     */
    Surface.prototype.toggleClass = function toggleClass(className) {
        var i = this.classList.indexOf(className);
        (i == -1)
            ? this.addClass(className)
            : this.removeClass(className);
        return this;
    };

    /**
     * Reset classlist.
     *
     * @method setClasses
     * @chainable
     * @param classlist {Array.string}  ClassList
     */
    Surface.prototype.setClasses = function setClasses(classList) {
        var i = 0;
        var removal = [];
        for (i = 0; i < this.classList.length; i++) {
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
     * @return {Array.string}
     */
    Surface.prototype.getClassList = function getClassList() {
        return this.classList;
    };

    /**
     * Set or overwrite innerHTML content of this Surface.
     *
     * @method setContent
     * @chainable
     * @param content {string|DocumentFragment} HTML content
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
     * @return {string}
     */
    Surface.prototype.getContent = function getContent() {
        return this.content;
    };

    /**
     * Set options for this surface
     *
     * @method setOptions
     * @param [options] {Object} Overrides for default options. See constructor.
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
    };

    /**
     * Allocates the element-type associated with the Surface, adds its given
     *  element classes, and prepares it for future committing.
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
            if (this.elementClass instanceof Array) {
                for (var i = 0; i < this.elementClass.length; i++)
                    this.addClass(this.elementClass[i]);
            }
            else this.addClass(this.elementClass);
        }

        // set the currentTarget and any bound listeners
        this.attach(target);

        // set all dirty flags to true
        this._opacityDirty = true;
        this._stylesDirty = true;
        this._classesDirty = true;
        this._attributesDirty = true;
        this._sizeDirty = true;
        this._contentDirty = true;
        this._originDirty = true;
        this._transformDirty = true;
    };

    /**
     * Remove all Samsara-relevant data from the Surface.
     *
     * @private
     * @method remove
     * @param {ElementAllocator} allocator
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
        _removeStyles.call(this, target);
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
     * @param target {Node} Container DOM element
     */
    Surface.prototype.deploy = function deploy(target) {
        //TODO: make sure target.tagName is of correct type! Tag pools must be implemented.
        this._eventOutput.emit('deploy');
        var content = this.getContent();
        if (content instanceof Node) {
            while (target.hasChildNodes()) target.removeChild(target.firstChild);
            target.appendChild(content);
        }
        else target.innerHTML = content;
    };

    /**
     * Cache the content of the Surface in a document fragment for future deployment.
     *
     * @private
     * @method recall
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
     * @param size {Number[], Stream} Size as [width, height] in pixels, or a stream.
     */
    Surface.prototype.setSize = function setSize(size) {
        this._cachedSize = size;
        this._sizeNode.set({size : size});
        this._sizeDirty = true;
        _setDirty.call(this);
    };

    /**
     * Setter for proportions.
     *
     * @method setProportions
     * @param proportions {Number[], Stream} Proportions as [x,y], or a stream.
     */
    Surface.prototype.setProportions = function setProportions(proportions) {
        this._sizeNode.set({proportions : proportions});
        this._sizeDirty = true;
        _setDirty.call(this);
    };

    /**
     * Setter for margins.
     *
     * @method setMargins
     * @param margins {Number[], Stream} Margins as [width, height] in pixels, or a stream.
     */
    Surface.prototype.setMargins = function setMargins(margins) {
        this._sizeNode.set({margins : margins});
        this._sizeDirty = true;
        _setDirty.call(this);
    };

    /**
     * Setter for origin.
     *
     * @method setOrigin
     * @param origin {Number[], Stream} Origin as [x,y], or a stream.
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

    /**
     * Apply changes from this component to the corresponding document element.
     *  This includes changes to classes, styles, size, content, opacity, origin,
     *  and CSS3 transforms.
     *
     * @private
     * @method commit
     * @param layout {Object}               Layout data
     * @param allocator {ElementAllocator}  Allocator
     */
    Surface.prototype.commit = function commit(layout, allocator) {
        if (!this._currentTarget) this.setup(allocator);

        var target = this._currentTarget;

        if (this._contentDirty) {
            this.deploy(target);
            this._contentDirty = false;
            this._sizeDirty = true;
        }

        if (this._classesDirty) {
            _removeClasses.call(this, target);
            _applyClasses.call(this, target);
            this._classesDirty = false;
            this._sizeDirty = true;
        }

        if (this._stylesDirty) {
            _applyStyles.call(this, target);
            this._stylesDirty = false;
            this._sizeDirty = true;
        }

        if (this._attributesDirty) {
            _applyAttributes.call(this, target);
            this._attributesDirty = false;
        }

        ElementOutput.prototype.commit.call(this, layout);
        this._dirty = false;
    };

    module.exports = Surface;
});
