/* Modified work copyright © 2015 David Valdman */
// TODO: Enable CSS properties on Context
define(function(require, exports, module) {
    var Engine = require('../core/Engine');
    var RootNode = require('../core/nodes/RootNode');
    var Transform = require('../core/Transform');
    var ElementAllocator = require('../core/ElementAllocator');
    var Transitionable = require('../core/Transitionable');
    var SimpleStream = require('../streams/SimpleStream');
    var EventHandler = require('../events/EventHandler');
    var preTickQueue = require('../core/queues/preTickQueue');
    var dirtyQueue = require('../core/queues/dirtyQueue');

    var elementType = 'div';
    var elementClass = 'samsara-context';
    var rafStarted = false;

    var layoutSpec = {
        transform : Transform.identity,
        opacity : 1,
        origin : null,
        align : null,
        nextSizeTransform : Transform.identity
    };

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
     * @param [options] {Object}                Options
     * @param [options.perspective] {Number}    Perspective in pixels
     */
    function Context(options) {
        options = options || {};
        this._node = new RootNode();

        this._size = new SimpleStream();
        this._layout = new SimpleStream();

        this.size = this._size.map(function(){
            var size = [this.container.clientWidth, this.container.clientHeight];
            this.emit('resize', size);
            return size;
        }.bind(this));

        this._node._size.subscribe(this.size);
        this._node._layout.subscribe(this._layout);

        this._perspective = new Transitionable(options.perspective || 0);

        this._perspective.on('update', function(perspective){
            setPerspective(this.container, perspective);
        }.bind(this));

        this._perspective.on('end', function(perspective){
            setPerspective(this.container, perspective);
        }.bind(this));

        this._eventOutput = new EventHandler();
        this._eventForwarder = function _eventForwarder(event) {
            this._eventOutput.emit(event.type, event);
        }.bind(this);
    }

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
        this._perspective.set(perspective, transition, callback);
    };

    /**
     * Allocate contents of the `context` to a DOM node.
     *
     * @method mount
     * @param node {Node}  DOM element
     */
    Context.prototype.mount = function mount(node, resizeListenFlag){
        this.container = node || document.createElement(elementType);
        this.container.classList.add(elementClass);

        var allocator = new ElementAllocator(this.container);
        this._node.setAllocator(allocator);

        this.emit('deploy', this.container);

        if (!node)
            document.body.appendChild(this.container);

        if (!resizeListenFlag)
            window.addEventListener('resize', handleResize.bind(this), false);

        preTickQueue.push(function (){
            handleResize.call(this);
            this._layout.trigger('start', layoutSpec);
            dirtyQueue.push(function(){
                this._layout.trigger('end', layoutSpec);
            }.bind(this));
        }.bind(this));

        if (!rafStarted) {
            rafStarted = true;
            Engine.start();
        }
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
     * @method on
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

    var usePrefix = !('perspective' in document.documentElement.style);

    var setPerspective = usePrefix
        ? function setPerspective(element, perspective) {
            element.style.webkitPerspective = perspective ? (perspective | 0) + 'px' : '0px';
        }
        : function setPerspective(element, perspective) {
            element.style.perspective = perspective ? (perspective | 0) + 'px' : '0px';
        };

    function handleResize() {
        this._size.emit('resize');
        dirtyQueue.push(function(){
            this._size.emit('resize');
        }.bind(this));
    }

    module.exports = Context;
});
