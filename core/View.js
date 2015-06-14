/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var RenderNode = require('famous/core/RenderNode');
    var SpecManager = require('famous/core/SpecManager');
    var Controller = require('famous/core/Controller');
    var ModifierStream = require('famous/core/ModifierStream');
    var EventHandler = require('famous/core/EventHandler');
    var Timer = require('famous/utilities/Timer');

    /**
     * @class View
     * @constructor
     */

    var View = module.exports = Controller.extend({
        defaults : {
            size : null,
            origin : null
        },
        events : null,
        constructor : function View(){
            this._modifier = null;
            this._node = new RenderNode();

            this._isView = true;
            this.size = new EventHandler();

            Controller.apply(this, arguments);

            this._eventInput.subscribe(this._optionsManager);

            this._eventInput.on('resize start', function(size){
                this.size.emit('start', size);
                this._eventOutput.emit('resize start');
            }.bind(this));

            this._eventInput.on('resize update', function(size){
                this.size.emit('update', size);
                this._eventOutput.emit('resize update');
            }.bind(this));

            this._eventInput.on('resize end', function(size){
                this.size.emit('end', size);
                this._eventOutput.emit('resize end');
            }.bind(this));

            this._eventInput.on('start', function(parentSpec){
                this._eventOutput.emit('start', parentSpec)
            }.bind(this));

            this._eventInput.on('end', function(parentSpec){
                this._eventOutput.emit('end', parentSpec)
            }.bind(this));

            this._node.subscribe(this._eventOutput);
        },
        set : function set(){
            return RenderNode.prototype.set.apply(this._node, arguments);
        },
        add : function add(){
            return RenderNode.prototype.add.apply(this._node, arguments);
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
                this._modifier = new ModifierStream({size : size});
                this.set(this._modifier);
            }
            else this._modifier.addStream({size : size});
            return this;
        },
        setOrigin : function setOrigin(origin){
            if (this.options.origin === origin) return;
            this.options.origin = origin;
            if (!this._modifier){
                this._modifier = new ModifierStream({origin : origin});
                this.set(this._modifier);
            }
            else this._modifier.addStream({origin : origin});
            return this;
        },
        commit : function(allocator){
            RenderNode.prototype.commit.apply(this._node, arguments);
        }
    });
});
