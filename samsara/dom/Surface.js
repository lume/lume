/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var DOMOutput = require('./_DOMOutput');
    var EventHandler = require('../events/EventHandler');
    var Stream = require('../streams/Stream');
    var SizeNode = require('../core/nodes/SizeNode');
    var LayoutNode = require('../core/nodes/LayoutNode');
    var sizeAlgebra = require('../core/algebras/size');
    var layoutAlgebra = require('../core/algebras/layout');
    var dirtyQueue = require('../core/queues/dirtyQueue');

    var isTouchEnabled = "ontouchstart" in window;
    var isIOS = /iPad|iPhone|iPod/.test(navigator.platform);

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
     *          tagName : 'img',
     *          attributes : {
     *              src : 'cat.jpg'
     *          },
     *          size : [100,100]
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
     * @param [options.roundToPixel] {Boolean}  Prevents text-blurring if set to true, at the cost to jittery animation
     */
    function Surface(options) {
        this.properties = {};
        this.attributes = {};
        this.classList = [];
        this.content = '';
        this._cachedSize = null;
        this._allocator = null;
        this._currentTarget = null;
        this._elementOutput = new DOMOutput();

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventForwarder = function _eventForwarder(event) {
            this._eventOutput.emit(event.type, event);
        }.bind(this);

        this._sizeNode = new SizeNode();
        this._layoutNode = new LayoutNode();

        this._size = new EventHandler();
        this._layout = new EventHandler();

        this.size = Stream.lift(function elementSizeLift(sizeSpec, parentSize) {
            if (!parentSize) return false; // occurs when surface is never added
            return sizeAlgebra(sizeSpec, parentSize);
        }, [this._sizeNode, this._size]);

        this.layout = Stream.lift(function(parentSpec, objectSpec, size) {
            if (!parentSpec || !size) return false;
            return (objectSpec)
                ? layoutAlgebra(objectSpec, parentSpec, size)
                : parentSpec;
        }, [this._layout, this._layoutNode, this.size]);

        this.layout.on('start', function(){
            if (!this._currentTarget) return;
            this._elementOutput.promoteLayer(this._currentTarget);
        }.bind(this));

        this.layout.on('update', function(layout){
            if (!this._currentTarget) return;
            this._elementOutput.commitLayout(this._currentTarget, layout);
        }.bind(this));

        this.layout.on('end', function(layout){
            if (!this._currentTarget) return;
            this._elementOutput.commitLayout(this._currentTarget, layout);
            this._elementOutput.demoteLayer(this._currentTarget);
        }.bind(this));

        this.size.on('start', commitSize.bind(this));
        this.size.on('update', commitSize.bind(this));
        this.size.on('end', commitSize.bind(this));

        if (options) this.setOptions(options);
    }

    Surface.prototype = Object.create(DOMOutput.prototype);
    Surface.prototype.constructor = Surface;
    Surface.prototype.elementType = 'div'; // Default tagName. Can be overridden in options.
    Surface.prototype.elementClass = 'samsara-surface';

    function commitSize(size){
        if (!this._currentTarget) return;
        var shouldResize = this._elementOutput.commitSize(this._currentTarget, size);
        this._cachedSize = size;
        if (shouldResize) this.emit('resize', size);
    }

    function enableScroll(){
        this.addClass('samsara-scrollable');

        if (!isTouchEnabled) return;

        this.on('deploy', function(target){
            // Hack to prevent page scrolling for iOS when scroll starts at extremes
            if (isIOS) {
                target.addEventListener('touchstart', function () {
                    var top = target.scrollTop;
                    var height = target.offsetHeight;
                    var scrollHeight = target.scrollHeight;

                    if (top == 0)
                        target.scrollTop = 1;
                    else if (top + height == scrollHeight)
                        target.scrollTop = scrollHeight - height - 1;

                }, false);
            }

            // Prevent bubbling to capture phase of window's touchmove event which prevents default.
            target.addEventListener('touchmove', function(event){
                event.stopPropagation();
            }, false);
        });
    }

    /**
     * Set or overwrite innerHTML content of this Surface.
     *
     * @method setContent
     * @param content {String|DocumentFragment} HTML content
     */
    Surface.prototype.setContent = function setContent(content){
        if (this.content !== content){
            this.content = content;

            if (this._currentTarget){
                dirtyQueue.push(function(){
                    this._elementOutput.applyContent(this._currentTarget, content);
                }.bind(this));
            }
        }
    };

    /**
     * Return innerHTML content of this Surface.
     *
     * @method getContent
     * @return {String}
     */
    Surface.prototype.getContent = function getContent(){
        return this.content;
    };
    
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

        if (this._currentTarget){
            dirtyQueue.push(function(){
                this._elementOutput.applyAttributes(this._currentTarget, attributes);
            }.bind(this));
        }
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
     * @param properties {Object}   CSS properties
     */
    Surface.prototype.setProperties = function setProperties(properties) {
        for (var key in properties)
            this.properties[key] = properties[key];

        if (this._currentTarget){
            dirtyQueue.push(function(){
                this._elementOutput.applyProperties(this._currentTarget, properties);
            }.bind(this));
        }
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
     * @param className {String}    Class name
     */
    Surface.prototype.addClass = function addClass(className) {
        if (this.classList.indexOf(className) < 0) {
            this.classList.push(className);

            if (this._currentTarget){
                dirtyQueue.push(function(){
                    this._elementOutput.applyClasses(this._currentTarget, this.classList);
                }.bind(this));
            }
        }
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
            this.classList.splice(i, 1);
            if (this._currentTarget){
                dirtyQueue.push(function(){
                    this._elementOutput.removeClasses(this._currentTarget, this.classList);
                }.bind(this));
            }
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
     * @param classlist {String[]}  ClassList
     */
    Surface.prototype.setClasses = function setClasses(classList) {
        for (var i = 0; i < classList.length; i++) {
            this.addClass(classList[i]);
        }
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
     * Apply the DOM's Element.querySelector to the Surface's current DOM target.
     *  Returns the first node matching the selector within the Surface's content.
     *
     * @method querySelector
     * @return {Element}
     */
    Surface.prototype.querySelector = function querySelector(selector){
        if (this._currentTarget)
            return this._elementOutput.querySelector(this._currentTarget, selector);
    };

    /**
     * Apply the DOM's Element.querySelectorAll to the Surface's current DOM target.
     *  Returns a list of nodes matching the selector within the Surface's content.
     *
     * @method querySelector
     * @return {NodeList}
     */
    Surface.prototype.querySelectorAll = function querySelectorAll(selector){
        if (this._currentTarget)
            return this._elementOutput.querySelectorAll(this._currentTarget, selector);
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
        if (options.roundToPixel) this.roundToPixel = options.roundToPixel;
    };

    /**
     * Adds a handler to the `type` channel which will be executed on `emit`.
     *
     * @method on
     *
     * @param type {String}         DOM event channel name, e.g., "click", "touchmove"
     * @param handler {Function}    Handler. It's only argument will be an emitted data payload.
     */
    Surface.prototype.on = function on(type, handler) {
        if (this._currentTarget)
            this._elementOutput.on(this._currentTarget, type, this._eventForwarder);
        EventHandler.prototype.on.apply(this._eventOutput, arguments);
    };

    /**
     * Adds a handler to the `type` channel which will be executed on `emit` once and then removed.
     *
     * @method once
     *
     * @param type {String}         DOM event channel name, e.g., "click", "touchmove"
     * @param handler {Function}    Handler. It's only argument will be an emitted data payload.
     */
    Surface.prototype.once = function on(type, handler){
        if (this._currentTarget)
            this._elementOutput.once(this._currentTarget, type, this._eventForwarder);
        EventHandler.prototype.once.apply(this._eventOutput, arguments);
    };

    /**
     * Removes a previously added handler to the `type` channel.
     *  Undoes the work of `on`.
     *
     * @method off
     * @param type {String}         DOM event channel name e.g., "click", "touchmove"
     * @param handler {Function}    Handler
     */
    Surface.prototype.off = function off(type, handler) {
        if (this._currentTarget)
            this._elementOutput.off(this._currentTarget, type, this._eventForwarder);
        EventHandler.prototype.off.apply(this._eventOutput, arguments);
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
     * @param allocator {DOMAllocator} Allocator
     */
    Surface.prototype.setup = function setup(allocator) {
        if (this._currentTarget) return;

        this._allocator = allocator;

        // create element of specific type
        var target = allocator.allocate(this.elementType);
        this._currentTarget = target;

        // add any element classes
        if (this.elementClass) {
            if (this.elementClass instanceof Array)
                for (var i = 0; i < this.elementClass.length; i++)
                    this.addClass(this.elementClass[i]);
            else this.addClass(this.elementClass);
        }

        for (var type in this._eventOutput.listeners)
            this._elementOutput.on(target, type, this._eventForwarder);

        this.deploy(this._currentTarget);
    };

    /**
     * Clear the HTML contents of the Surface and remove it from the Render Tree.
     *  The DOM node the Surface occupied will be freed to a pool and can be used by another Surface.
     *  The Surface can be added to the render tree again and all its data (properties, event listeners, etc)
     *  will be restored.
     *
     * @method remove
     */
    Surface.prototype.remove = function remove() {
        var target = this._currentTarget;
        if (!target) return;

        for (var type in this._eventOutput.listeners)
            this._elementOutput.off(target, type, this._eventForwarder);

        // cache the target's contents for later deployment
        this.recall(target);

        this._allocator.deallocate(target);
        this._allocator = null;

        this._currentTarget = null;
    };

    /**
     * Insert the Surface's content into the currentTarget.
     *
     * @private
     * @method deploy
     * @param target {Node} DOM element to set content into
     */
    Surface.prototype.deploy = function deploy(target) {
        this._elementOutput.makeVisible(target);
        this._elementOutput.applyClasses(target, this.classList);
        this._elementOutput.applyProperties(target, this.properties);
        this._elementOutput.applyAttributes(target, this.attributes);
        this._elementOutput.applyContent(target, this.content);

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

        this._elementOutput.removeClasses(target, this.classList);
        this._elementOutput.removeProperties(target, this.properties);
        this._elementOutput.removeAttributes(target, this.attributes);
        this.content = this._elementOutput.recallContent(target);
        this._elementOutput.makeInvisible(target);
    };

    /**
     * Getter for size.
     *
     * @method getSize
     * @return {Number[]}
     */
    Surface.prototype.getSize = function getSize() {
        // TODO: remove cachedSize
        return this._cachedSize;
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
    };

    /**
     * Setter for proportions.
     *
     * @method setProportions
     * @param proportions {Number[]|Stream} Proportions as [x,y], or a stream.
     */
    Surface.prototype.setProportions = function setProportions(proportions) {
        this._sizeNode.set({proportions : proportions});
    };

    /**
     * Setter for margins.
     *
     * @method setMargins
     * @param margins {Number[]|Stream} Margins as [width, height] in pixels, or a stream.
     */
    Surface.prototype.setMargins = function setMargins(margins) {
        this._sizeNode.set({margins : margins});
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
    };

    /**
     * Setter for origin.
     *
     * @method setOrigin
     * @param origin {Number[]|Stream} Origin as [x,y], or a stream.
     */
    Surface.prototype.setOrigin = function setOrigin(origin){
        this._layoutNode.set({origin : origin});
        this._elementOutput._originDirty = true;
    };

    /**
     * Setter for opacity.
     *
     * @method setOpacity
     * @param opacity {Number} Opacity
     */
    Surface.prototype.setOpacity = function setOpacity(opacity){
        this._layoutNode.set({opacity : opacity});
        this._elementOutput._opacityDirty = true;
    };

    module.exports = Surface;
});
