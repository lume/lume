/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var Surface = require('./Surface');
    var Context = require('./Context');

    /**
     * ContainerSurface enables nesting of DOM. A ContainerSurface manages
     *  its own render tree that it inserts inside a DOM node. Typically
     *  this is used for clipping by settings `{overflow : hidden}` as a CSS
     *  property.
     *
     *  @example
     *
     *      var myContainer = new ContainerSurface({
     *          size : [100,100],
     *          properties : {overflow : hidden}
     *      });
     *
     *      var surface = new Surface({
     *          size : [200,200],
     *          properties : {background : 'red'}
     *      });
     *
     *      myContainer.add(surface);
     *
     *      context.add(myContainer);
     *
     * @class ContainerSurface
     * @extends DOM.Surface
     * @namespace DOM
     * @uses DOM.Context
     * @constructor
     *
     * @param [options] {Object}                      Options
     * @param [options.size] {Number[]}               Size (width, height) in pixels. These can also be `true` or `undefined`.
     * @param [options.classes] {String[]}            CSS classes
     * @param [options.properties] {Object}           Dictionary of CSS properties
     * @param [options.attributes] {Object}           Dictionary of HTML attributes
     * @param [options.content] Sstring}              InnerHTML content
     * @param [options.origin] {Number[]}             Origin (x,y), with values between 0 and 1
     * @param [options.margins] {Number[]}            Margins (x,y) in pixels
     * @param [options.proportions] {Number[]}        Proportions (x,y) with values between 0 and 1
     * @param [options.aspectRatio] {Number}          Aspect ratio
     * @param [options.opacity=1] {Number}            Opacity
     * @param [options.tagName="div"] {String}        HTML tagName
     * @param [options.enableScroll=false] {Boolean}  Allows a Surface to support native scroll behavior
     * @param [options.roundToPixel=false] {Boolean}  Prevents text-blurring if set to true, at the cost to jittery animation
     */
    function ContainerSurface(options) {
        Surface.call(this, options);
        this.context = new Context();
        this.context.elementClass = ContainerSurface.prototype.elementClass;
        this.context._size.subscribe(this.size);

        this.on('deploy', function(target){
            this.context.mount(target);
        }.bind(this));

        this.on('recall', function() {
            this.context.remove();
        }.bind(this));
    }

    ContainerSurface.prototype = Object.create(Surface.prototype);
    ContainerSurface.prototype.constructor = ContainerSurface;
    ContainerSurface.prototype.elementType = 'div';
    ContainerSurface.prototype.elementClass = ['samsara-surface', 'samsara-container'];

    /**
     * Get current perspective in pixels.
     *
     * @method getPerspective
     * @return {Number} Perspective in pixels
     */
    ContainerSurface.prototype.getPerspective = function getPerspective() {
        return Context.prototype.getPerspective.apply(this.context, arguments);
    };

    /**
     * Set current perspective in pixels.
     *
     * @method setPerspective
     * @param perspective {Number}  Perspective in pixels
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback executed on completion of transition
     */
    ContainerSurface.prototype.setPerspective = function setPerspective(){
        Context.prototype.setPerspective.apply(this.context, arguments);
    };

    /**
     * Extends the render tree with a provided node.
     *
     * @method add
     * @param node {Object}     Node, Surface, or View
     * @return {RenderTreeNode}
     */
    ContainerSurface.prototype.add = function add() {
        return Context.prototype.add.apply(this.context, arguments);
    };

    ContainerSurface.prototype.remove = function remove() {
        Surface.prototype.remove.apply(this, arguments);
    };

    module.exports = ContainerSurface;
});
