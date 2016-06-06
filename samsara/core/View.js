/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var Controller = require('./Controller');
    var RenderTreeNode = require('./nodes/RenderTreeNode');
    var SizeNode = require('./nodes/SizeNode');
    var LayoutNode = require('./nodes/LayoutNode');

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
        _isView : true,
        defaults : {
            size : null,
            origin : null,
            opacity : 1
        },
        events : {
            change : setOptions
        },
        constructor : function View(options){
            this._sizeNode = new SizeNode();
            this._layoutNode = new LayoutNode();

            this._node = new RenderTreeNode();

            this._addNode = this._node.add(this._sizeNode).add(this._layoutNode);

            this.size = this._addNode.size; // actual size
            this._size = this._node.size; // incoming parent size

            this._cachedSize = [0,0];
            
            this.size.on('start', updateSize.bind(this));
            this.size.on('update', updateSize.bind(this));
            this.size.on('end', updateSize.bind(this));

            Controller.apply(this, arguments);
            if (this.options) setOptions.call(this, this.options);
        },
        /**
         * Extends the render tree subtree with a new node.
         *
         * @method add
         * @param object {SizeNode|LayoutNode|Surface} Node
         * @return {RenderTreeNode}
         */
        add : function add(){
            return RenderTreeNode.prototype.add.apply(this._addNode, arguments);
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
            this._sizeNode.set({proportions : proportions});
        },
        /**
         * Setter for proportions.
         *
         * @method setProportions
         * @param margins {Number[]|Stream} Proportions as [x,y], or a stream.
         */
        setMargins : function setMargins(margins){
            this._sizeNode.set({margins : margins});
        },
        /**
         * Setter for proportions.
         *
         * @method setProportions
         * @param aspectRatio {Number[]|Stream} Proportions as [x,y], or a stream.
         */
        setAspectRatio: function setProportions(aspectRatio) {
            this._sizeNode.set({aspectRatio: aspectRatio});
        },
        /**
         * Setter for origin.
         *
         * @method setOrigin
         * @param origin {Number[]|Stream} Origin as [x,y], or a stream.
         */
        setOrigin : function setOrigin(origin){
            this._layoutNode.set({origin : origin});
        },
        /**
         * Setter for opacity.
         *
         * @method setOpacity
         * @param opacity {Number|Stream} Opacity
         */
        setOpacity : function setOpacity(opacity){
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
                case 'aspectRatio':
                    this.setAspectRatio(value);
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

    module.exports = View;
});
