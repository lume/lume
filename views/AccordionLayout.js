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
    var View = require('famous/core/view');
    var LayoutNode = require('famous/core/nodes/LayoutNode');
    var Stream = require('famous/streams/Stream');

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        }
    };

    var AccordionLayout = View.extend({
        defaults : {
            direction : CONSTANTS.DIRECTION.Y,
            initialAngles : []
        },
        initialize : function(options){
            this.angles = new Transitionable(options.initialAngles);
            this.input = new Stream();
            this.maxLength = 0;

            var displacement = 0;
            this.currentAngles = Stream.lift(function(input, angles){
                if (input === undefined) return angles;

                displacement += input.delta;

                var ratio = ((this.maxLength - displacement) / this.maxLength);

                var currentAngles = [];
                for (var i = 0; i < angles.length; i++){
                    var angle = angles[i];
                    var currentAngle = (ratio * angle) % (2*Math.PI);
                    currentAngles.push(currentAngle);
                }

                return currentAngles;
            }.bind(this), [this.input, this.angles]);
        },
        setNodes : function(nodes){
            var transforms = this.currentAngles.map(function(angles){
                var transforms = [];
                var y = 0;
                var z = 0;
                for (var i = 0; i < nodes.length; i++){
                    var angle = angles[i];
                    var l = nodes[i].getSize()[1];

                    var transform = (this.options.direction === CONSTANTS.DIRECTION.Y)
                        ? Transform.thenMove(
                            Transform.rotateX(angle),
                            [300, y+200, z]
                        )
                        : Transform.thenMove(
                            Transform.rotateY(angle),
                            [y, 0, z]
                        );

                    z += l * Math.sin(angle);
                    y += l * Math.cos(angle);
                    transforms.push(transform);
                }

                return {
                    transforms : transforms,
                    length : y
                };
            }.bind(this));

            for (var i = 0; i < nodes.length; i++)
                this.maxLength += nodes[i].getSize()[this.options.direction];

            this._eventOutput.subscribe(transforms
                .pluck('length')
                .map(function(length){
                    return {
                        value : length,
                        progress : length / this.maxLength
                    };
                }.bind(this))
            );

            for (var i = 0; i < nodes.length; i++){
                var layout = new LayoutNode({
                    transform : transforms.pluck('transforms').pluck(i)
                });
                this.add(layout).add(nodes[i])
            }
        },
        setAngles : function(angles, transition, callback){
            this.angles.set(angles, transition, callback)
        }
    });

    module.exports = AccordionLayout;
});
