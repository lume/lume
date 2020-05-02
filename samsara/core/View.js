/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var Controller = require('./Controller');
    var EmptyNode = require('./EmptyNode');

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
     * @extends Core.EmptyNode
     */
    var View = Controller.extend({
        constructor : function View(options){
            this._node = new EmptyNode(options);

            this._node.size.on('resize', function(size){
                this.emit('resize', size);
            }.bind(this));

            this.size = this._node.size;
            this.layout = this._node.layout;

            Controller.call(this, options);
        },
        _onAdd : function(parent){
            return EmptyNode.prototype._onAdd.apply(this._node, arguments);
        },
        /**
         * Extends the render tree subtree with a new node.
         *
         * @method add
         * @param object {SizeNode|LayoutNode|Surface} Node
         * @return {RenderTreeNode}
         */
        add : function add(){
            return EmptyNode.prototype.add.apply(this._node, arguments);
        },
        /**
         * Remove the View from the RenderTree. All Surfaces added to the View
         *  will also be removed. The View can be added back at a later time and
         *  all of its data and Surfaces will be restored.
         *
         * @method remove
         */
        remove : function remove(){
            EmptyNode.prototype.remove.apply(this._node, arguments);
        },
        /**
         * Getter for size.
         *
         * @method getSize
         * @return size {Number[]}
         */
        getSize : function(){
            return EmptyNode.prototype.getSize.apply(this._node);
        },
        /**
         * Setter for size.
         *
         * @method setSize
         * @param size {Number[]|Stream} Size as [width, height] in pixels, or a stream.
         */
        setSize : function setSize(size){
            EmptyNode.prototype.setSize.apply(this._node, arguments);
        },
        /**
         * Setter for proportions.
         *
         * @method setProportions
         * @param proportions {Number[]|Stream} Proportions as [x,y], or a stream.
         */
        setProportions : function setProportions(proportions){
            EmptyNode.prototype.setProportions.apply(this._node, arguments);
        },
        /**
         * Setter for margins.
         *
         * @method setMargins
         * @param margins {Number[]|Stream} Margins as [x,y], or a stream.
         */
        setMargins : function setMargins(margins){
            EmptyNode.prototype.setMargins.apply(this._node, arguments);
        },
        /**
         * Setter for origin.
         *
         * @method setOrigin
         * @param origin {Number[]|Stream} Origin as [x,y], or a stream.
         */
        setOrigin : function setOrigin(origin){
            EmptyNode.prototype.setOrigin.apply(this._node, arguments);
        },
        /**
         * Setter for opacity.
         *
         * @method setOpacity
         * @param opacity {Number|Stream} Opacity
         */
        setOpacity : function setOpacity(opacity){
            EmptyNode.prototype.setOpacity.apply(this._node, arguments);
        }
    });

    module.exports = View;
});
