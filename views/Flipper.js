/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    var RenderNode = require('../core/RenderNode');
    var Transform = require('../core/Transform');
    var Modifier = require('../core/Modifier');
    var View = require('./View');

    /**
     * Allows you to link two renderables as front and back sides that can be
     *  'flipped' back and forth along a chosen axis. Rendering optimizations are
     *  automatically handled.
     *
     * @class Flipper
     * @constructor
     * @param {Options} [options] An object of options.
     * @param {Transition} [options.transition=true] The transition executed when flipping your Flipper instance.
     * @param {Direction} [options.direction=Flipper.DIRECTION_X] Direction specifies the axis of rotation.
     */

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        }
    };

    module.exports = View.extend({
        defaults : {
            transition : true,
            direction : CONSTANTS.DIRECTION.X
        },
        initialize : function(){
            this.angle = new Transitionable(0);

            var frontModifier = new Modifier({
                transform : function() {
                    var angle = this.angle.get();
                    return (this.options.direction === CONSTANTS.DIRECTION.X)
                        ? Transform.rotateY(angle)
                        : Transform.rotateX(angle)
                }.bind(this),
                origin : [0.5, 0.5]
            });

            var backModifier = new Modifier({
                transform : function() {
                    var angle = this.angle.get() + Math.PI;
                    return (this.options.direction === CONSTANTS.DIRECTION.X)
                        ? Transform.rotateY(angle)
                        : Transform.rotateX(angle)
                }.bind(this),
                origin : [0.5, 0.5]
            });

            this.frontNode = this.add(frontModifier).add(new RenderNode());
            this.backNode = this.add(backModifier).add(new RenderNode());
        },
        setFront : function setFront(front){
            this.frontNode.set(front);
        },
        setBack : function setFront(back){
            this.backNode.set(back);
        },
        setAngle : function setAngle(angle, transition, callback){
            if (transition === undefined) transition = this.options.transition;
            if (this.angle.isActive()) this.angle.halt();
            this.angle.set(angle, transition, callback);
        }
    }, CONSTANTS);
});
