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
    var StateManager = require('famous/core/StateManager');
    var Entity = require('famous/core/Entity');
    var SpecManager = require('famous/core/SpecManager');
    var Controller = require('famous/core/Controller');
    var dirtyQueue = require('famous/core/dirtyQueue');

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
            this._entityId = Entity.register(this);
            this._node = new RenderNode();
            this.state = new StateManager(this.constructor.STATE_TYPES || View.STATE_TYPES);

            this._dirty = true;
            this._dirtyLock = 0;

            this._cachedSpec = null;
            this._cachedSize = null;

            this._setup = false;
            this._isView = true;

            Controller.apply(this, arguments);

            this._eventInput.subscribe(this._optionsManager);
            this._eventInput.subscribe(this.state);
            this._eventInput.subscribe(this._node);

            this._eventInput.on('dirty', function(){
                if (!this._dirty){
                    this._dirty = true;
                    this._eventOutput.emit('dirty');
                }
                this._dirtyLock++;
            }.bind(this));

            this._eventInput.on('clean', function(){
                if (this._dirtyLock > 0) this._dirtyLock--;
                if (this._dirty && this._dirtyLock == 0) {
                    this._dirty = false;
                    this._eventOutput.emit('clean');
                }
            }.bind(this));

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
                : this._cachedSize;
        },
        setSize : function setSize(size){
            if (this.options.size === size) return;
            this.options.size = size;
            this._dirty = true;
            dirtyQueue.push(this);
            return this;
        },
        setOrigin : function setOrigin(origin){
            if (this.options.origin === origin) return;
            this.options.origin = origin;
            this._dirty = true;
            dirtyQueue.push(this);
            return this;
        },
        clean : function(){
            if (this._dirty && this._dirtyLock == 0){
                this._dirty = false;
            }
        },
        render : function render(spec){
            if (!this._cachedSpec || this._cachedSpec !== spec){
                this._cachedSpec = spec;
                this._dirty = true;
                dirtyQueue.push(this);

                spec = SpecManager.merge({
                    origin : this.options.origin,
                    size : this.getSize() || spec.size
                }, spec);
            }

            var parentSize = spec.size;
            if (!this._cachedSize || (this._cachedSize[0] !== parentSize[0] || this._cachedSize[1] !== parentSize[1])){
                if (!this._cachedSize) this._cachedSize = [parentSize[0], parentSize[1]];
                else {
                    this._cachedSize[0] = parentSize[0];
                    this._cachedSize[1] = parentSize[1];
                }
                this._dirty = true;
                dirtyQueue.push(this);
                this.trigger('resize', parentSize);
            }

            if (!this._setup) {
                this.setup();
                this._setup = true;
            }

            RenderNode.prototype.render.call(this._node, spec);
        },
        commit : function commit(allocator){
            if (!this._dirty) return;
            RenderNode.prototype.commit.call(this._node, allocator);
        }
    });
});
