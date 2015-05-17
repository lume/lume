/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/core/Transitionable');
    var Modifier = require('famous/core/Modifier');
    var View = require('famous/core/View');
    var Getter = require('famous/core/GetHelper');

    /**
     * Allows you to link two renderables as front and back sides that can be
     *  'flipped' back and forth along a chosen axis. Rendering optimizations are
     *  automatically handled.
     *
     * @class Flipper
     */

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        }
    };

    var Flipper = module.exports = View.extend({
        defaults : {
            transition : true,
            direction : CONSTANTS.DIRECTION.X
        },
        state : {
            angle : Transitionable
        },
        initialize : function(){
            this.state.angle.set(0);

            var angleGetter = new Getter(this.state.angle);

            this.frontTransform = angleGetter.map(function(angle){
                return (this.options.direction === CONSTANTS.DIRECTION.X)
                    ? Transform.rotateY(angle)
                    : Transform.rotateX(angle);
            }.bind(this));

            this.backTransform = angleGetter.map(function(angle){
                return (this.options.direction === CONSTANTS.DIRECTION.X)
                    ? Transform.rotateY(angle + Math.PI)
                    : Transform.rotateX(angle + Math.PI);
            }.bind(this));
        },
        setup : function(){
            this.frontModifier = new Modifier({
                size : this.frontNode.getSize(),
                transform : this.frontTransform,
                origin : [0.5, 0.5]
            });

            this.backModifier = new Modifier({
                size : this.backNode.getSize(),
                transform : this.backTransform,
                origin : [0.5, 0.5]
            });

            this.add(this.frontModifier).add(this.frontNode);
            this.add(this.backModifier).add(this.backNode);
        },
        setFront : function setFront(front){
            this.frontNode = front;
            front.on('resize', function(size){
               this.frontModifier.sizeFrom(size);
            }.bind(this));
        },
        setBack : function setFront(back){
            this.backNode = back;
            back.on('resize', function(size){
                this.backModifier.sizeFrom(size);
            }.bind(this));
        },
        setAngle : function setAngle(angle, transition, callback){
            if (transition === undefined) transition = this.options.transition;
            this.state.angle.set(angle, transition, callback);
        }
    }, CONSTANTS);
});
