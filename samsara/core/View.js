/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var Controller = require('./Controller');
    var RenderTreeNode = require('./nodes/RenderTreeNode');
    var SizeNode = require('./nodes/SizeNode');
    var LayoutNode = require('./nodes/LayoutNode');
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');
    var Stream = require('../streams/Stream');
    var sizeAlgebra = require('./algebras/size');
    var layoutAlgebra = require('./algebras/layout');

    /**
     * A View provides encapsulation for a subtree of the render tree. You can build
     *  complicated visual components and add them to a render tree as you would a `Surface`.
     *
     *  Custom `Views` are created by calling `extend` on the `View` constructor.
     *
     *  In addition to what a `Controller` provides, a View provides:
     *
     *      Render Tree method: `.add`
     *      Size methods: `setSize`, `setProportions`
     *      Layout methods: `setOpacity`, `setOrigin`
     *
     *  @example
     *
     *      var MyView = View.extend({
     *          defaults : {
     *              defaultOption1 : '',
     *              defaultOption2 : 42
     *          },
     *          initialize : function(options){
     *              // this method called on instantiation
     *              // options are passed in after being patched by the specified defaults
     *
     *              var surface = new Surface({
     *                  content : options.defaultOption1,
     *                  size : [options.defaultOption2,100],
     *                  properties : {background : 'red'}
     *              });
     *
     *              this.add(surface);
     *          }
     *      });
     *
     *      var myView = new myView({defaultOption1 : 'hello'});
     *
     *      var context = Context();
     *      context.add(myView);
     *
     *      context.mount(document.body);
     *
     * @class View
     * @constructor
     * @extends Core.Controller
     * @uses Core.SizeNode
     * @uses Core.LayoutNode
     * @uses Core.SimpleStream
     */
    var View = Controller.extend({
        defaults : {
            size : null,
            origin : null,
            opacity : 1
        },
        events : {
            change : setOptions
        },
        constructor : function View(options){
            this._sizeNode = null;
            this._layoutNode = null;

            this._size = new EventHandler();
            this._layout = new EventHandler();
            this._logic = new EventHandler();

            this.size = new SimpleStream();
            this.layout = new SimpleStream();

            this.size.subscribe(this._size);
            this.layout.subscribe(this._layout);

            this._node = new RenderTreeNode();

            this._node._size.subscribe(this.size);
            this._node._layout.subscribe(this.layout);
            this._node._logic.subscribe(this._logic);

            this._cachedSize = [0, 0];
            this.size.on(['set', 'start', 'update', 'end'], updateSize.bind(this));

            Controller.call(this, options);
            if (this.options) setOptions.call(this, this.options);
        },
        _onAdd : function(parent){
            this._logic.unsubscribe();
            this._logic.subscribe(parent._logic);
            return this;
        },
        /**
         * Extends the render tree subtree with a new node.
         *
         * @method add
         * @param object {SizeNode|LayoutNode|Surface} Node
         * @return {RenderTreeNode}
         */
        add : function add(){
            return RenderTreeNode.prototype.add.apply(this._node, arguments);
        },
        /**
         * Remove the View from the RenderTree. All Surfaces added to the View
         *  will also be removed. The View can be added back at a later time and
         *  all of its data and Surfaces will be restored.
         *
         * @method remove
         */
        remove : function remove(){
            RenderTreeNode.prototype.remove.apply(this._node, arguments);
        },
        /**
         * Getter for size.
         *
         * @method getSize
         * @return size {Number[]}
         */
        getSize : function(){
            return this._cachedSize;
        },
        /**
         * Setter for size.
         *
         * @method setSize
         * @param size {Number[]|Stream} Size as [width, height] in pixels, or a stream.
         */
        setSize : function setSize(size){
            if (!this._sizeNode) createSizeNode.call(this);
            this._cachedSize = size;
            this._sizeNode.set({size : size});
        },
        /**
         * Setter for proportions.
         *
         * @method setProportions
         * @param proportions {Number[]|Stream} Proportions as [x,y], or a stream.
         */
        setProportions : function setProportions(proportions){
            if (!this._sizeNode) createSizeNode.call(this);
            this._sizeNode.set({proportions : proportions});
        },
        /**
         * Setter for margins.
         *
         * @method setMargins
         * @param margins {Number[]|Stream} Margins as [x,y], or a stream.
         */
        setMargins : function setMargins(margins){
            if (!this._sizeNode) createSizeNode.call(this);
            this._sizeNode.set({margins : margins});
        },
        /**
         * Setter for origin.
         *
         * @method setOrigin
         * @param origin {Number[]|Stream} Origin as [x,y], or a stream.
         */
        setOrigin : function setOrigin(origin){
            if (!this._layoutNode) createLayoutNode.call(this);
            this._layoutNode.set({origin : origin});
        },
        /**
         * Setter for opacity.
         *
         * @method setOpacity
         * @param opacity {Number|Stream} Opacity
         */
        setOpacity : function setOpacity(opacity){
            if (!this._layoutNode) createLayoutNode.call(this);
            this._layoutNode.set({opacity : opacity});
        }
    });

    function updateSize(size){
        if (this._cachedSize[0] === size[0] && this._cachedSize[1] === size[1]) return;
        this._cachedSize = size;
        this.emit('resize', size);
    }

    function setOptions(options){
        for (var key in options){
            var value = options[key];
            switch (key){
                case 'size':
                    this.setSize(value);
                    break;
                case 'proportions':
                    this.setProportions(value);
                    break;
                case 'margins':
                    this.setMargins(value);
                    break;
                case 'origin':
                    this.setOrigin(value);
                    break;
                case 'opacity':
                    this.setOpacity(value);
                    break;
            }
        }
    }

    function createSizeNode(){
        this.size.unsubscribe();
        this._sizeNode = new SizeNode();

        var size = Stream.lift(function surfaceSizeLift(sizeSpec, parentSize) {
            if (!parentSize) return false;
            return sizeAlgebra(sizeSpec, parentSize);
        }, [this._sizeNode, this._size]);

        this.size.subscribe(size);
    }

    function createLayoutNode(){
        this.layout.unsubscribe();
        this._layoutNode = new LayoutNode();

        var layout = Stream.lift(function surfaceLayoutLift(parentSpec, objectSpec, size) {
            if (!size || !parentSpec) return false;
            return (objectSpec)
                ? layoutAlgebra(objectSpec, parentSpec, size)
                : parentSpec;
        }, [this._layout, this._layoutNode, this.size]);

        this.layout.subscribe(layout);
    }

    module.exports = View;
});
