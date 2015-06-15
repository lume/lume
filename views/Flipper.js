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
    var Modifier = require('famous/core/ModifierStream');
    var View = require('famous/core/View');

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

    var Flipper = View.extend({
        defaults : {
            angle : 0,
            transition : true,
            direction : CONSTANTS.DIRECTION.X
        },
        initialize : function(){
            this.angle = new Transitionable(this.options.angle);
        },
        setFront : function setFront(front){
            var frontNode = front;

            var frontTransform = this.angle.map(function(angle){
                return (this.options.direction === CONSTANTS.DIRECTION.X)
                    ? Transform.rotateY(angle)
                    : Transform.rotateX(angle);
            }.bind(this));

            var frontModifier = new Modifier({
                size : front.getSize(),
                transform : frontTransform,
                origin : [0.5, 0.5]
            });

            this.add(frontModifier).add(frontNode);
        },
        setBack : function setFront(back){
            var backTransform = this.angle.map(function(angle){
                return (this.options.direction === CONSTANTS.DIRECTION.X)
                    ? Transform.rotateY(angle + Math.PI)
                    : Transform.rotateX(angle + Math.PI);
            }.bind(this));

            var backModifier = new Modifier({
                size : back.getSize(),
                transform : backTransform,
                origin : [0.5, 0.5]
            });

            this.add(backModifier).add(back);
        },
        setAngle : function setAngle(angle, transition, callback){
            if (transition === undefined) transition = this.options.transition;
            this.angle.set(angle, transition, callback);
        }
    }, CONSTANTS);

    module.exports = Flipper;
});
