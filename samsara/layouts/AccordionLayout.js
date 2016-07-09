/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    var View = require('../core/View');
    var Stream = require('../streams/Stream');

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        }
    };

    // Still in development
    // TODO: documentation

    var AccordionLayout = View.extend({
        defaults : {
            direction : CONSTANTS.DIRECTION.Y,
            initialAngles : [],
            pivotIndex: 0,
            pivotOffset: 0,
            pivotOffsetRatio: 0
        },
        initialize : function(options){
            this.angles = new Transitionable(options.initialAngles);

            this.maxLength = 0; // length of all nodes fully extended
            this.offset = 0; // shift accordion so starting point is at (0,0)

            var displacement = 0;
            this.currentAngles = Stream.lift(function(input, angles){
                if (input === undefined) return angles;

                displacement -= input.delta;

                var ratio = ((this.maxLength - displacement) / this.maxLength);

                var currentAngles = [];
                for (var i = 0; i < angles.length; i++){
                    var angle = angles[i];
                    var currentAngle = (ratio * angle) % (2 * Math.PI);
                    currentAngles.push(currentAngle);
                }

                return currentAngles;
            }.bind(this), [this.input, this.angles]);
        },
        setNodes : function(nodes){
            var transforms = this.currentAngles.map(function(angles){
                var transforms = [];

                var direction = this.options.direction;
                var startIndex = this.options.pivotIndex;

                var pivotOffset = (this.options.pivotOffset)
                    ? this.options.pivotOffset
                    : this.options.pivotOffsetRatio * nodes[startIndex].getSize()[direction];

                var startAngle = angles[startIndex];
                var originY = -pivotOffset * Math.cos(startAngle);
                var originZ = -pivotOffset * Math.sin(startAngle);

                var accordionOffset = this.offset;    // shift to ensure starting point is at 0
                var y = originY - accordionOffset;
                var z = originZ;
                // var length = 0;

                var angle, transform, l;
                for (i = startIndex - 1; i >= 0; i--) {
                    angle = angles[i];
                    l = nodes[i].getSize()[direction];

                    y -= l * Math.cos(angle);
                    z -= l * Math.sin(angle);

                    transform = (direction === CONSTANTS.DIRECTION.Y)
                        ? Transform.thenMove(
                            Transform.rotateX(angle),
                            [0, y, z]
                        )
                        : Transform.thenMove(
                            Transform.rotateY(-angle),
                            [y, 0, z]
                        );

                    transforms[i] = transform;
                }

                // length += y;

                y = originY - accordionOffset;
                z = originZ;

                for (i = startIndex; i < nodes.length; i++){
                    angle = angles[i];
                    l = nodes[i].getSize()[direction];

                    transform = (direction === CONSTANTS.DIRECTION.Y)
                        ? Transform.thenMove(
                            Transform.rotateX(angle),
                            [0, y, z]
                        )
                        : Transform.thenMove(
                            Transform.rotateY(-angle),
                            [y, 0, z]
                        );

                    z += l * Math.sin(angle);
                    y += l * Math.cos(angle);
                    transforms.push(transform);
                }

                // var x = nodes[0].getSize()[1 - direction];
                // length += y;
                //
                //TODO: make dynamic sizing more robust
                //if (this.options.size && this.options.size[0] === true && this.options.size[1] == true)
                //    this.setSize([x,length]);

                return {
                    transforms : transforms,
                    length : y
                };
            }.bind(this));

            this.offset = 0;
            for (var i = 0; i < nodes.length; i++){
                var angle = this.options.initialAngles[i];
                var l = nodes[i].getSize()[this.options.direction];
                var length = l * Math.cos(angle);
                if (i < this.options.pivotIndex)
                    this.offset -= length;

                var transform = transforms.pluck('transforms').pluck(i);

                this.add({transform : transform}).add(nodes[i]);

                this.maxLength += nodes[i].getSize()[this.options.direction];
            }

            this.output.subscribe(transforms
                .pluck('length')
                .map(function(length){
                    return {
                        value : length,
                        progress : length / this.maxLength
                    };
                }.bind(this))
            );
        },
        setAngles : function(angles, transition, callback){
            this.angles.set(angles, transition, callback)
        }
    });

    module.exports = AccordionLayout;
});
