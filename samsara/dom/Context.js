/* Copyright © 2015-2016 David Valdman */
// TODO: Enable CSS properties on Context
define(function(require, exports, module) {
    var DOMAllocator = require('./_DOMAllocator');
    var Engine = require('../core/Engine');
    var RootNode = require('../core/nodes/RootNode');
    var Transitionable = require('../core/Transitionable');
    var OptionsManager = require('../core/_OptionsManager');
    var SimpleStream = require('../streams/SimpleStream');
    var EventHandler = require('../events/EventHandler');

    /**
     * A Context defines a top-level DOM element inside which other nodes (like Surfaces) are rendered.
     *
     *  The CSS class `samsara-context` is applied, which provides the minimal CSS necessary
     *  to create a performant 3D context (specifically `preserve-3d`).
     *
     *  The Context must be mounted to a DOM node via the `mount` method. If no node is specified
     *  it is mounted to `document.body`.
     *
     *  @example
     *
     *      var context = Context();
     *
     *      var surface = new Surface({
     *          size : [100,100],
     *          properties : {background : 'red'}
     *      });
     *
     *      context.add(surface);
     *      context.mount(document.body)
     *
     * @class Context
     * @constructor
     * @namespace DOM
     * @uses Core.RootNode
     *
     * @param [options] {Object}                        Options
     * @param [options.enableScroll=false] {Boolean}    Allow scrolling on mobile devices
     */
    function Context(options) {
        this.options = OptionsManager.setOptions(this, options, Context.DEFAULT_OPTIONS);
        this._node = new RootNode();

        this._size = new SimpleStream();
        this._layout = new SimpleStream();

        this._cachedSize = [];
        this.size = this._size.map(function(type){
            // If `end` event, simply return cache. Otherwise cache busting fails
            // as the `end` size is the same as the `start` size for immediate sets
            if (type === 'end'){
                return this._cachedSize;
            }

            var width = this.container.clientWidth;
            var height = this.container.clientHeight;

            if (width !== this._cachedSize[0] || height !== this._cachedSize[1]){
                this._cachedSize[0] = width;
                this._cachedSize[1] = height;
                this.emit('resize', this._cachedSize);
                // TODO: shouldn't need to create new array - DOMOutput bug
                return [width, height];
            }
            else return false;
        }.bind(this));

        this._perspective = new Transitionable();
        this._perspectiveOrigin = new Transitionable();

        this.perspectiveFrom(this._perspective);
        this.perspectiveOriginFrom(this._perspectiveOrigin);

        this._eventOutput = new EventHandler();
        this._eventForwarder = function _eventForwarder(event) {
            event.stopPropagation();
            this._eventOutput.emit(event.type, event);
        }.bind(this);

        // Prevents dragging of entire page
        if (this.options.enableScroll === false){
            this.on('deploy', function(target) {
                target.addEventListener('touchmove', function(event) {
                    event.preventDefault();
                }, false);
            });
        }
    }

    Context.prototype.elementClass = 'samsara-context';

    Context.DEFAULT_OPTIONS = {
        enableScroll : false
    };

    /**
     * Extends the render tree beginning with the Context's RootNode with a new node.
     *  Delegates to RootNode's `add` method.
     *
     * @method add
     *
     * @param {Object}          Renderable
     * @return {RenderTreeNode} Wrapped node
     */
    Context.prototype.add = function add() {
        return RootNode.prototype.add.apply(this._node, arguments);
    };

    Context.prototype.remove = function remove(){
        if (this.elementClass instanceof Array){
            for (var i = 0; i < this.elementClass.length; i++)
                this.container.classList.remove(this.elementClass[i])
        }
        else this.container.classList.remove(this.elementClass);

        this._node.remove();

        while (this.container.hasChildNodes())
            this.container.removeChild(this.container.firstChild);

        Engine.deregisterContext(this);
    };

    /**
     * Pull the perspective value from a transitionable.
     *
     * @method perspectiveFrom
     * @param perspective {Transitionable}    Perspective transitionable
     */
    Context.prototype.perspectiveFrom = function perspectiveFrom(perspective){
        this._perspective = perspective;

        this._perspective.on('update', function(perspective){
            setPerspective(this.container, perspective);
        }.bind(this));

        this._perspective.on('end', function(perspective){
            setPerspective(this.container, perspective);
        }.bind(this));
    };

    /**
     * Pull the perspective-origin value from a transitionable.
     *
     * @method perspectiveOriginFrom
     * @param perspectiveOrigin {Transitionable}    Perspective-origin transitionable
     */
    Context.prototype.perspectiveOriginFrom = function perspectiveOriginFrom(perspectiveOrigin){
        this._perspectiveOrigin = perspectiveOrigin;

        this._perspectiveOrigin.on('update', function(origin){
            setPerspectiveOrigin(this.container, origin);
        }.bind(this));

        this._perspectiveOrigin.on('end', function(origin){
            setPerspectiveOrigin(this.container, origin);
        }.bind(this));
    };

    /**
     * Get current perspective of this Context in pixels.
     *
     * @method getPerspective
     * @return {Number} Perspective in pixels
     */
    Context.prototype.getPerspective = function getPerspective() {
        return this._perspective.get();
    };

    /**
     * Set current perspective of the `context` in pixels.
     *
     * @method setPerspective
     * @param perspective {Number}  Perspective in pixels
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback executed on completion of transition
     */
    Context.prototype.setPerspective = function setPerspective(perspective, transition, callback) {
        if (this.container)
            this._perspective.set(perspective, transition, callback);
        else {
            this.on('deploy', function(){
                this._perspective.set(perspective, transition, callback);
            }.bind(this));
        }
    };

    /**
     * Set current perspective of the `context` in pixels.
     *
     * @method setPerspective
     * @param perspective {Number}  Perspective in pixels
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback executed on completion of transition
     */
    Context.prototype.setPerspectiveOrigin = function setPerspectiveOrigin(origin, transition, callback) {
        if (this.container)
            this._perspectiveOrigin.set(origin, transition, callback);
        else {
            this.on('deploy', function() {
                this._perspectiveOrigin.set(origin, transition, callback);
            }.bind(this));
        }
    };

    /**
     * Allocate contents of the `context` to a DOM node.
     *
     * @method mount
     * @param node {Node}  DOM element
     */
    Context.prototype.mount = function mount(node){
        node = node || window.document.body;

        this.container = node;

        if (this.elementClass instanceof Array) {
            for (var i = 0; i < this.elementClass.length; i++)
                this.container.classList.add(this.elementClass[i])
        }
        else this.container.classList.add(this.elementClass);

        var allocator = new DOMAllocator(this.container);
        this._node.setAllocator(allocator);

        this._node._size.subscribe(this.size);
        this._node._layout.subscribe(this._layout);

        this.emit('deploy', this.container);

        Engine.registerContext(this);
    };

    /**
     * Adds a handler to the `type` channel which will be executed on `emit`.
     *  These events should be DOM events that occur on the DOM node the
     *  context has been mounted to.
     *
     * @method on
     * @param type {String}         Channel name
     * @param handler {Function}    Callback
     */
    Context.prototype.on = function on(type, handler){
        if (this.container)
            this.container.addEventListener(type, this._eventForwarder);
        else {
            this._eventOutput.on('deploy', function(target){
                target.addEventListener(type, this._eventForwarder);
            }.bind(this));
        }
        EventHandler.prototype.on.apply(this._eventOutput, arguments);
    };

    /**
     * Removes the `handler` from the `type`.
     *  Undoes the work of `on`.
     *
     * @method off
     * @param type {String}         Channel name
     * @param handler {Function}    Callback
     */
    Context.prototype.off = function off(type, handler) {
        EventHandler.prototype.off.apply(this._eventOutput, arguments);
    };

    /**
     * Used internally when context is subscribed to.
     *
     * @method emit
     * @private
     * @param type {String}     Channel name
     * @param data {Object}     Payload
     */
    Context.prototype.emit = function emit(type, payload) {
        EventHandler.prototype.emit.apply(this._eventOutput, arguments);
    };

    var usePrefix = !('perspective' in window.document.documentElement.style);

    var setPerspective = usePrefix
        ? function setPerspective(element, perspective) {
            element.style.webkitPerspective = perspective ? (perspective | 0) + 'px' : '0px';
        }
        : function setPerspective(element, perspective) {
            element.style.perspective = perspective ? (perspective | 0) + 'px' : '0px';
        };

    function _formatCSSOrigin(origin) {
        return (100 * origin[0]) + '% ' + (100 * origin[1]) + '%';
    }

    var setPerspectiveOrigin = usePrefix
        ? function setPerspectiveOrigin(element, origin) {
            element.style.webkitPerspectiveOrigin = origin ? _formatCSSOrigin(origin) : '50% 50%';
        }
        : function setPerspectiveOrigin(element, origin) {
            element.style.perspectiveOrigin = origin ? _formatCSSOrigin(origin) : '50% 50%';
        };

    module.exports = Context;
});
