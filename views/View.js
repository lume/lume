/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var RenderNode = require('./../core/RenderNode');
    var Transform = require('./../core/Transform');
    var Spec = require('./../core/Spec');
    var Controller = require('./../controllers/Controller');
    var Entity = require('./../core/Entity');
    var StateManager = require('famous/core/StateManager');

    /**
     * Useful for quickly creating elements within applications
     *   with large event systems.  Consists of a RenderNode paired with
     *   an input EventHandler and an output EventHandler.
     *   Meant to be extended by the developer.
     *
     * @class View
     * @constructor
     */

    var View = module.exports = Controller.extend({
        defaults : {
            size : null,
            origin : null
        },
        constructor : function View(){
            Controller.apply(this, arguments);
            this.spec = new Spec();
            this._node = new RenderNode();
            this.state = new StateManager();
            this._sizeDirty = true;
            this._isView = true;

            Entity.register(this);

            if (this.initialize)
                this.initialize.call(this, this.options);
        },
        set : function set(){
            return RenderNode.prototype.set.apply(this._node, arguments);
        },
        add : function add(){
            return RenderNode.prototype.add.apply(this._node, arguments);
        },
        getSize : function getSize(){
            return (this.options.size)
                ? this.options.size
                : (this._node.getSize) ? this._node.getSize() : null;
        },
        setSize : function setSize(size){
            this.options.size = size;
            //TODO: Fix hack for origin checking
            this.spec.setSize(size);
        },
        getOrigin : function getOrigin(){
            return (this.options.origin)
                ? this.options.origin
                : (this._node.getOrigin) ? this._node.getOrigin() : null;
        },
        setOrigin : function setOrigin(origin){
            this.options.origin = origin;
            //TODO: Fix hack for origin checking
            this.spec.setOrigin(origin);
        },
        isStateDirty : function isDirty(){
            return this.state.isDirty();
        },
        setSizeDirty : function setDirty(){
            this._sizeDirty = true;
        },
        setSizeClean : function setDirty(){
            this._sizeDirty = false;
        },
        isSizeDirty : function isSizeDirty(){
            return this._sizeDirty;
        },
        render : function render(parentSpec){
            var size = this.options.size || (parentSpec && parentSpec.size ? parentSpec.size : null);
            var origin = this.options.origin || (parentSpec && parentSpec.origin ? parentSpec.origin : null);
            var transform;

            //TODO: Fix origin hack
            if (this.options.origin){
                var innerSize = this.getSize() || size;
                var innerOrigin = this.getOrigin() || origin;
                if (innerOrigin && (innerOrigin[0] || innerOrigin[1]))
                    transform = Transform.translate(-innerOrigin[0] * innerSize[0], -innerOrigin[1] * innerSize[1], 0);
            }

            return {
                size : size,
                origin : origin,
                transform : transform,
                target : this._entityId
            };
        },
        commit : function commit(spec, allocator){
            RenderNode.prototype.render.call(this._node, spec);
            RenderNode.prototype.commit.call(this._node, allocator);
        }
    });
});
