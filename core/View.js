/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var SceneGraphNode = require('famous/core/nodes/SceneGraphNode');
    var Controller = require('famous/core/Controller');
    var LayoutNode = require('famous/core/nodes/LayoutNode');
    var Transitionable = require('famous/core/Transitionable');
    var EventHandler = require('famous/core/EventHandler');

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
        constructor : function View(){
            this._modifier = null;

            this._node = new SceneGraphNode();
            this._node.tempRoot = this._node;

            this.size = new EventHandler();

            Controller.apply(this, arguments);

            this._eventInput.subscribe(this._optionsManager);

            this._node.subscribe(this._eventInput);
            this._node.size.subscribe(this.size);
        },
        set : function set(){
            return SceneGraphNode.prototype.set.apply(this._node, arguments);
        },
        add : function add(){
            return SceneGraphNode.prototype.add.apply(this._node, arguments);
        },
        getSize : function getSize(){
            //TODO: if given true size, then pass down to this._node.getSize
            return (this.options.size)
                ? this.options.size
                : this._node.getSize();
        },
        setSize : function setSize(size){
            if (this.options.size === size) return;
            if (!this._modifier){
                this._modifier = new LayoutNode({size : size});
                this.set(this._modifier);
            }
            else this._modifier.addStream({size : size});
            return this;
        },
        setOrigin : function setOrigin(origin){
            if (this.options.origin === origin) return;
            this.options.origin = origin;
            if (!this._modifier){
                this._modifier = new LayoutNode({origin : origin});
                this.set(this._modifier);
            }
            else this._modifier.addStream({origin : origin});
            return this;
        }
    });

    module.exports = View;
});
