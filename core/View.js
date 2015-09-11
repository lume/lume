/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var SceneGraphNode = require('samsara/core/nodes/SceneGraphNode');
    var Controller = require('samsara/core/Controller');
    var SizeNode = require('samsara/core/nodes/SizeNode');
    var LayoutNode = require('samsara/core/nodes/LayoutNode');
    var Transitionable = require('samsara/core/Transitionable');
    var EventHandler = require('samsara/core/EventHandler');
    var EventMapper = require('samsara/events/EventMapper');

    var Stream = require('samsara/streams/Stream');
    var ResizeStream = require('samsara/streams/ResizeStream');
    var SizeObservable = require('samsara/core/SizeObservable');
    var layoutAlgebra = require('samsara/core/algebras/layout');
    var sizeAlgebra = require('samsara/core/algebras/size');

    /**
     * @class View
     * @constructor
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
            this._size = new EventHandler();
            this._layout = new EventHandler();

            this._sizeNode = new SizeNode();
            this._layoutNode = new LayoutNode();

            this._node = new SceneGraphNode();
            this._node.tempRoot = this._node;

            this.size = ResizeStream.lift(
                function ViewSizeAlgebra (sizeSpec, parentSize){
                    return (sizeSpec)
                        ? sizeAlgebra(sizeSpec, parentSize)
                        : parentSize;
                },
                [this._sizeNode, this._size]
            );

            var layout = Stream.lift(
                function ViewLayoutAlgebra (parentSpec, objectSpec, size){
                    if (!parentSpec || !size) return;
                    return (this.options.origin)
                        ? layoutAlgebra(objectSpec, parentSpec, size)
                        : parentSpec;
                }.bind(this),
                [this._layout, this._layoutNode, this.size || this._size]
            );

            this._node._size.subscribe(this.size).subscribe(this._size);
            this._node._layout.subscribe(layout).subscribe(this._layout);

            Controller.apply(this, arguments);
            this._eventInput.subscribe(this._optionsManager);

            if (this.options) setOptions.call(this, this.options);
        },
        add : function add(){
            return SceneGraphNode.prototype.add.apply(this._node, arguments);
        },
        setSize : function setSize(size){
            this._sizeNode.set({size : size});
        },
        setProportions : function setProportions(proportions){
            this._sizeNode.set({proportions : proportions});
        },
        setOrigin : function setOrigin(origin){
            this._layoutNode.set({origin : origin});
        },
        setOpacity : function setOpacity(opacity){
            this._layoutNode.set({opacity : opacity});
        }
    });

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
