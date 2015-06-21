/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var ElementOutput = require('famous/core/ElementOutput');
    var dirtyObjects = require('famous/core/dirtyObjects');
    var dirtyQueue = require('famous/core/queues/dirtyQueue');
    var postTickQueue = require('famous/core/queues/postTickQueue');
    var nextTickQueue = require('famous/core/queues/nextTickQueue');

    /**
     * A base class for viewable content and event
     *   targets inside a Famo.us application, containing a renderable document
     *   fragmen`t. Like an HTML div, it can accept internal markup,
     *   properties, classes, and handle events.
     *
     * @class Surface
     * @constructor
     *
     * @param {Object} [options] default option overrides
     * @param {Array.Number} [options.size] [width, height] in pixels
     * @param {Array.string} [options.classes] CSS classes to set on target div
     * @param {Array} [options.properties] string dictionary of CSS properties to set on target div
     * @param {Array} [options.attributes] string dictionary of HTML attributes to set on target div
     * @param {string} [options.content] inner (HTML) content of surface
     */
    function Surface(options) {
        ElementOutput.call(this);

        this.properties = {};
        this.attributes = {};
        this.template = null;
        this.content = '';

        this.size = null;   // can take numeric, undefined or true values
        this.proportions = null;

        this._classesDirty = true;
        this._stylesDirty = true;
        this._attributesDirty = true;
        this._sizeDirty = true;
        this._contentDirty = true;
        this._trueSizeCheck = false;
        this._dirty = false;

        this.classList = [];
        this._dirtyClasses = [];

        if (options) this.setOptions(options);
    }

    Surface.prototype = Object.create(ElementOutput.prototype);
    Surface.prototype.constructor = Surface;
    Surface.prototype.elementType = 'div';
    Surface.prototype.elementClass = 'famous-surface';

    function _setDirty(){
        if (this._dirty) return;

        this._dirty = true;

        this.emit('dirty');
        dirtyObjects.trigger('dirty');

        dirtyQueue.push(function(){
            this.emit('clean');
            dirtyObjects.trigger('clean');
            this._dirty = false;
        }.bind(this));
    }
    /**
     * Set HTML attributes on this Surface. Note that this will cause
     *    dirtying and thus re-rendering, even if values do not change.
     *
     * @method setAttributes
    * @param {Object} attributes property dictionary of "key" => "value"
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
     * Get HTML attributes on this Surface.
     *
     * @method getAttributes
     *
     * @return {Object} Dictionary of this Surface's attributes.
     */
    Surface.prototype.getAttributes = function getAttributes() {
        return this.attributes;
    };

    /**
     * Set CSS-style properties on this Surface. Note that this will cause
     *    dirtying and thus re-rendering, even if values do not change.
     *
     * @method setProperties
     * @chainable
     * @param {Object} properties property dictionary of "key" => "value"
     */
    Surface.prototype.setProperties = function setProperties(properties) {
        for (var n in properties) {
            this.properties[n] = properties[n];
        }
        this._stylesDirty = true;
        _setDirty.call(this);
        return this;
    };

    /**
     * Get CSS-style properties on this Surface.
     *
     * @method getProperties
     *
     * @return {Object} Dictionary of this Surface's properties.
     */
    Surface.prototype.getProperties = function getProperties() {
        return this.properties;
    };

    /**
     * Add CSS-style class to the list of classes on this Surface. Note
     *   this will map directly to the HTML property of the actual
     *   corresponding rendered <div>.
     *
     * @method addClass
     * @chainable
     * @param {string} className name of class to add
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
     * Remove CSS-style class from the list of classes on this Surface.
     *   Note this will map directly to the HTML property of the actual
     *   corresponding rendered <div>.
     *
     * @method removeClass
     * @chainable
     * @param {string} className name of class to remove
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
     * Toggle CSS-style class from the list of classes on this Surface.
     *   Note this will map directly to the HTML property of the actual
     *   corresponding rendered <div>.
     *
     * @method toggleClass
     * @param {string} className name of class to toggle
     */
    Surface.prototype.toggleClass = function toggleClass(className) {
        var i = this.classList.indexOf(className);
        (i == -1)
            ? this.addClass(className)
            : this.removeClass(className);
        return this;
    };

    /**
     * Reset class list to provided dictionary.
     * @method setClasses
     * @chainable
     * @param {Array.string} classList
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
     * Get array of CSS-style classes attached to this div.
     *
     * @method getClasslist
     * @return {Array.string} array of class names
     */
    Surface.prototype.getClassList = function getClassList() {
        return this.classList;
    };

    Surface.prototype.setTemplate = function setTemplate(template){
        this.template = template;
    };

    Surface.prototype.getTemplate = function getTemplate(){
        return this.template;
    };

    Surface.prototype.compile = function compile(data){
        if (!this.template) return;
        this.setContent(this.template(data));
    };

    /**
     * Set or overwrite inner (HTML) content of this surface. Note that this
     *    causes a re-rendering if the content has changed.
     *
     * @method setContent
     * @chainable
     * @param {string|DocumentFragment} content HTML content
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
     * Return inner (HTML) content of this surface.
     *
     * @method getContent
     *
     * @return {string} inner (HTML) content
     */
    Surface.prototype.getContent = function getContent() {
        return this.content;
    };

    /**
     * Set options for this surface
     *
     * @method setOptions
     * @chainable
     * @param {Object} [options] overrides for default options.  See constructor.
     */
    Surface.prototype.setOptions = function setOptions(options) {
        if (options.size !== undefined) this.setSize(options.size);
        if (options.origin !== undefined) this.setOrigin(options.origin);
        if (options.classes !== undefined) this.setClasses(options.classes);
        if (options.properties !== undefined) this.setProperties(options.properties);
        if (options.attributes !== undefined) this.setAttributes(options.attributes);
        if (options.content !== undefined) this.setContent(options.content);
        if (options.template !== undefined) this.setTemplate(options.template);
        if (options.proportions !== undefined) this.setProportions(options.proportions);
        return this;
    };

    //  Apply to document all changes from removeClass() since last setup().
    function _cleanupClasses(target) {
        for (var i = 0; i < this._dirtyClasses.length; i++) target.classList.remove(this._dirtyClasses[i]);
        this._dirtyClasses = [];
    }

    // Apply values of all Famous-managed styles to the document element.
    //  These will be deployed to the document on call to #setup().
    function _applyClasses(target) {
        for (var i = 0; i < this.classList.length; i++)
            target.classList.add(this.classList[i]);
    }

    // Apply values of all Famous-managed styles to the document element.
    //  These will be deployed to the document on call to #setup().
    function _applyStyles(target) {
        for (var key in this.properties)
            target.style[key] = this.properties[key];
    }

    // Clear all Famous-managed styles from the document element.
    // These will be deployed to the document on call to #setup().
    function _cleanupStyles(target) {
        for (var key in this.properties)
            target.style[key] = '';
    }

    // Apply values of all Famous-managed attributes to the document element.
    //  These will be deployed to the document on call to #setup().
    function _applyAttributes(target) {
        for (var key in this.attributes)
            target.setAttribute(key, this.attributes[key]);
    }

    // Clear all Famous-managed attributes from the document element.
    // These will be deployed to the document on call to #setup().
    function _cleanupAttributes(target) {
        for (var key in this.attributes)
            target.removeAttribute(key);
    }

    /**
     * Allocates the element-type associated with the Surface, adds its given
     * element classes, and prepares it for future committing.
     *
     * @private
     * @method setup
     *
     * @param {ElementAllocator} allocator document element pool for this context
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
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Spec} spec commit context
     */
    Surface.prototype.commit = function commit(spec, allocator) {
        if (!this._currentTarget) this.setup(allocator);

        var target = this._currentTarget;

        if (this._contentDirty) {
            this.deploy(target);
            this._contentDirty = false;
            this._trueSizeCheck = true;
        }

        if (this._classesDirty) {
            _cleanupClasses.call(this, target);
            _applyClasses.call(this, target);
            this._classesDirty = false;
            this._trueSizeCheck = true;
        }

        if (this._stylesDirty) {
            _applyStyles.call(this, target);
            this._stylesDirty = false;
            this._trueSizeCheck = true;
        }

        if (this._attributesDirty) {
            _applyAttributes.call(this, target);
            this._attributesDirty = false;
        }

        if (spec) ElementOutput.prototype.commit.call(this, spec);
    };

    /**
     *  Remove all Famous-relevant attributes from a document element.
     *    This is called by the Context if the Surface is no longer rendered.
     *
     * @private
     * @method cleanup
     * @param {ElementAllocator} allocator
     */
    Surface.prototype.cleanup = function cleanup(allocator) {
        var target = this._currentTarget;

        // cache the target's contents for later deployment
        this.recall(target);

        // hide the element
        target.style.display = 'none';
        target.style.opacity = '';
        target.style.width = '';
        target.style.height = '';

        // clear all styles, classes and attributes
        _cleanupStyles.call(this, target);
        _cleanupAttributes.call(this, target);
        _cleanupClasses.call(this, target);

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
     * @param {Node} target document parent of this container
     */
    Surface.prototype.deploy = function deploy(target) {
        this._eventOutput.emit('deploy');
        var content = this.getContent();
        if (content instanceof Node) {
            while (target.hasChildNodes()) target.removeChild(target.firstChild);
            target.appendChild(content);
        }
        else target.innerHTML = content;
    };

    /**
     * Cache the content of the surface in a document fragment for future deployment.
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
     *  Get the x and y dimensions of the surface.
     *
     * @method getSize
     * @return {Array.Number} [x,y] size of surface
     */
    Surface.prototype.getSize = function getSize() {
        return this._size || this.size;
    };

    /**
     * Set x and y dimensions of the surface.
     *
     * @method setSize
     * @chainable
     * @param {Array.Number} size as [width, height]
     */
    Surface.prototype.setSize = function setSize(size) {
        //TODO: consider refactor - size as getter with resize event
        if (size === this.size) return;
        this.size = [size[0], size[1]];
        this._sizeDirty = true;
        _setDirty.bind(this);
    };

    Surface.prototype.setProportions = function setProportions(proportions) {
        this.proportions = [proportions[0], proportions[1]];
        this._sizeDirty = true;
        _setDirty.call(this);
    };

    Surface.prototype.getOrigin = function getOrigin(){
        return this._origin;
    };

    Surface.prototype.setOrigin = function setOrigin(origin){
        this._origin = origin;
        this._originDirty = true;
        _setDirty.call(this);
    };

    module.exports = Surface;
});
