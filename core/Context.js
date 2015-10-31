/* Modified work copyright © 2015 David Valdman */
// TODO: Enable CSS properties on Context
define(function(require, exports, module) {
    var Engine = require('./Engine');
    var RootNode = require('./nodes/RootNode');
    var Transform = require('./Transform');
    var ElementAllocator = require('./ElementAllocator');
    var Transitionable = require('./Transitionable');
    var SimpleStream = require('../streams/SimpleStream');
    var EventHandler = require('../events/EventHandler');
    var preTickQueue = require('./queues/preTickQueue');
    var dirtyQueue = require('./queues/dirtyQueue');

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

    var windowSizeStream = new SimpleStream();
    var layoutStream = new EventHandler();

    /**
     * A Context defines a top-level DOM element inside which other nodes (like Surfaces) are rendered.
     *  This DOM element can be provided as an argument if it exists in the document,
     *  otherwise it is created for you and appended to the document's `<body>`.
     *
     *  The CSS class `samsara-context` is applied, which provides the minimal CSS necessary
     *  to create a performant 3D context (specifically `preserve-3d`).
     *
     *  As of now, `Context` is not typically instantiated on its own, but rather is
     *  created by calling `Engine.createContext()`. This may change in the near future.
     *
     *  @example
     *
     * @class Context
     * @constructor
     * @namespace Core
     * @uses Core.RootNode
     * @param [options] {Object}    Options
     * @param [options.el] {Node}   DOM element which will serve as a container for added nodes
     */
    function Context(options) {
        this._node = new RootNode();

        this.size = windowSizeStream.map(function(){
            return [this.container.clientWidth, this.container.clientHeight];
        }.bind(this));

        this._node._size.subscribe(this.size);
        this._node._layout.subscribe(layoutStream);

        this._perspective = new Transitionable(0);

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
     * Set current perspective of this context in pixels.
     *
     * @method setPerspective
     * @param perspective {Number}  Perspective in pixels
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback executed on completion of transition
     */
    Context.prototype.setPerspective = function setPerspective(perspective, transition, callback) {
        this._perspective.set(perspective, transition, callback);
    };

    Context.prototype.mount = function mount(node){
        this.container = node || document.createElement(elementType);
        this.container.classList.add(elementClass);

        var allocator = new ElementAllocator(this.container);
        this._node.setAllocator(allocator);

        if (!node) document.body.appendChild(this.container);

        preTickQueue.push(function (){
            handleResize();
            layoutStream.emit('start', layoutSpec);
            dirtyQueue.push(function(){
                layoutStream.emit('end', layoutSpec);
            });
        });

        if (!rafStarted) Engine.start();
        rafStarted = true;
    };

    Context.prototype.on = function on(type, handler){
        this.container.addEventListener(type, this._eventForwarder);
        EventHandler.prototype.on.apply(this._eventOutput, arguments);
    };

    Context.prototype.off = function off(type, handler) {
        EventHandler.prototype.off.apply(this._eventOutput, arguments);
    };

    Context.prototype.emit = function emit(type, payload) {
        EventHandler.prototype.emit.apply(this._eventOutput, arguments);
    };

    var usePrefix = !('perspective' in document.documentElement.style);

    var setPerspective = usePrefix
        ? function setPerspective(element, perspective) {
            element.style.webkitPerspective = perspective ? perspective.toFixed() + 'px' : '';
        }
        : function setPerspective(element, perspective) {
            element.style.perspective = perspective ? perspective.toFixed() + 'px' : '';
        };

    function handleResize() {
        windowSizeStream.emit('resize');
        dirtyQueue.push(function(){
            windowSizeStream.emit('resize');
        });
    }

    window.addEventListener('resize', handleResize, false);

    module.exports = Context;
});
