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
            origin : null
        },
        events : null,
        constructor : function View(options){
            this.size = new EventHandler();
            this.layout = new EventHandler();

            this.sizeObserver = new SizeObservable(options.size);

            this._node = new SceneGraphNode();
            this._node.tempRoot = this._node;

            Controller.apply(this, arguments);

            var sizeMapper = ResizeStream.lift(
                function SGSizeAlgebra (size, parentSize){
                    return (size)
                        ? sizeAlgebra({size : size}, parentSize)
                        : parentSize;
                },
                [this.sizeObserver, this.size]
            );

            this._node.size.subscribe(sizeMapper).subscribe(this.size);

            if (options.origin){
                var layoutMapper = Stream.lift(
                    function ViewLayoutAlgebra (parentSpec, size){
                        if (!parentSpec || !size) return;
                        return (this.options.origin)
                            ? layoutAlgebra({origin : this.options.origin}, parentSpec, size)
                            : parentSpec;
                    }.bind(this),
                    [this.layout, sizeMapper || this.size]
                );

                this._node.layout.subscribe(layoutMapper).subscribe(this.layout);
            }
            else this._node.layout.subscribe(this.layout);

            this._eventInput.subscribe(this._optionsManager);
        },
        set : function set(){
            return SceneGraphNode.prototype.set.apply(this._node, arguments);
        },
        add : function add(){
            return SceneGraphNode.prototype.add.apply(this._node, arguments);
        },
        setSize : function setSize(size){
            //TODO: make this dynamic
            this.sizeObserver.set(size);
        },
        setOrigin : function setOrigin(origin){
            //TODO: make this dynamic
            this.options.origin = origin;
        }
    });

    module.exports = View;
});
