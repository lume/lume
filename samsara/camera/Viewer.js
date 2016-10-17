/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Camera = require('./Camera');
    var Quaternion = require('./_Quaternion');
    var Controller = require('../core/Controller');
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    var Stream = require('../streams/Stream');

    var MouseInput = require('../inputs/MouseInput');
    var TouchInput = require('../inputs/TouchInput');
    var ScrollInput = require('../inputs/ScrollInput');
    var GenericInput = require('../inputs/GenericInput');

    GenericInput.register({
        mouse : MouseInput,
        touch : TouchInput
    });

    var Viewer = Controller.extend({
        defaults : {
            radius: 500,
            rotationScale: 1,
            zoomScale: 1,
            inertia: true
        },
        initialize : function(options){
            this.camera = new Camera(options);
            this.delta = Quaternion.create();
            this.center = [];

            var centerStream = Stream.lift(function(size, layout){
                if (!size || !layout) return false;
                var pos = Transform.getTranslate(layout.transform);
                return [pos[0] + 0.5 * size[0], pos[1] + 0.5 * size[1]];
            }, [this.camera._node._size, this.camera._node.layout]);

            centerStream.on('start', function(center){
                this.center[0] = center[0];
                this.center[1] = center[1];
            }.bind(this));

            centerStream.on('update', function(center){
                this.center[0] = center[0];
                this.center[1] = center[1];
            }.bind(this));

            centerStream.on('end', function(center){
                this.center[0] = center[0];
                this.center[1] = center[1];
            }.bind(this));

            var inertia = options.inertia ? new Transitionable(0) : false;
            var rotationInput = new GenericInput(['mouse', 'touch'], {scale : options.rotationScale});
            var zoomInput = new ScrollInput({
                direction : ScrollInput.DIRECTION.Y,
                scale: options.zoomScale
            });

            rotationInput.subscribe(this.input);
            zoomInput.subscribe(this.input);

            rotationInput.on('start', function(data){
                if (inertia && inertia.isActive()) inertia.halt();

                this.emit('start', {
                    position: this.camera.getPosition(),
                    orientation: this.camera.getOrientation()
                });
            }.bind(this));

            rotationInput.on('update', function(data){
                var angleAxis = convertInputToAngleAxis.call(this, data);
                Quaternion.fromAngleAxis(angleAxis, this.delta);
                this.camera.rotateBy(this.delta);

                this.emit('update', {
                    position: this.camera.getPosition(),
                    orientation: this.camera.getOrientation()
                });
            }.bind(this));

            rotationInput.on('end', function(data){
                if (!inertia) {
                    this.emit('end', {
                        position: this.camera.getPosition(),
                        orientation: this.camera.getOrientation()
                    });
                }
                else {
                    var angle = Quaternion.getAngle(this.delta);
                    inertia.reset(angle);
                    inertia.set(angle, {
                        curve : 'damp',
                        damping : .9
                    });
                }
            }.bind(this));

            if (inertia){
                inertia.on('update', function(angle){
                    Quaternion.setAngle(this.delta, angle, this.delta);
                    this.camera.rotateBy(this.delta);

                    this.emit('update', {
                        position: this.camera.getPosition(),
                        orientation: this.camera.getOrientation()
                    });
                }.bind(this));

                inertia.on('end', function(value){
                    this.emit('end', {
                        position: this.camera.getPosition(),
                        orientation: this.camera.getOrientation()
                    });
                }.bind(this));
            }

            zoomInput.on('update', function(data){
                var zoom = data.delta;
                this.camera.zoomBy(zoom);

                this.emit('update', {
                    position: this.camera.getPosition(),
                    orientation: this.camera.getOrientation()
                });
            }.bind(this));
        },
        _onAdd : function(){
            return Camera.prototype._onAdd.apply(this.camera, arguments);
        },
        add : function(){
            return Camera.prototype.add.apply(this.camera, arguments);
        },
        remove : function(){
            return Camera.prototype.remove.apply(this.camera, arguments);
        }
    });

    function convertInputToAngleAxis(data){
        var delta = data.delta;

        var dx = delta[0];
        var dy = delta[1];

        var px = data.x - this.center[0];
        var py = data.y - this.center[1];
        var pz = this.options.radius;

        var qx = px + dx;
        var qy = py + dy;
        var qz = this.options.radius;

        var dp = Math.sqrt(px * px + py * py + pz * pz);
        var dq = Math.sqrt(qx * qx + qy * qy + qz * qz);

        px /= dp;
        py /= dp;
        pz /= dp;
        qx /= dq;
        qy /= dq;
        qz /= dq;

        var angle = Math.acos(px * qx + py * qy + pz * qz);

        var axisX = py * qz - pz * qy;
        var axisY = pz * qx - px * qz;
        var axisZ = px * qy - py * qx;

        return [angle, axisX, axisY, axisZ];
    }

    module.exports = Viewer;
});
