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

            this.orientation = this.camera.orientation;
            this.position = this.camera.position;

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

            var hasMoved = false;
            rotationInput.on('start', function(data){
                hasMoved = false;
                if (inertia && inertia.isActive()) inertia.halt();

                this.emit('start', {
                    position: this.getPosition(),
                    orientation: this.getOrientation()
                });
            }.bind(this));

            rotationInput.on('update', function(data){
                hasMoved = true;
                var angleAxis = convertInputToAngleAxis.call(this, data);
                Quaternion.fromAngleAxis(angleAxis, this.delta);
                this.rotateBy(this.delta);

                this.emit('update', {
                    position: this.getPosition(),
                    orientation: this.getOrientation()
                });
            }.bind(this));

            rotationInput.on('end', function(data){
                if (!hasMoved || !inertia) {
                    this.emit('end', {
                        position: this.getPosition(),
                        orientation: this.getOrientation()
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
                    this.rotateBy(this.delta);

                    this.emit('update', {
                        position: this.getPosition(),
                        orientation: this.getOrientation()
                    });
                }.bind(this));

                inertia.on('end', function(value){
                    this.emit('end', {
                        position: this.getPosition(),
                        orientation: this.getOrientation()
                    });
                }.bind(this));
            }

            zoomInput.on('update', function(data){
                var zoom = data.delta;
                this.zoomBy(zoom);

                this.emit('update', {
                    position: this.getPosition(),
                    orientation: this.getOrientation()
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
        },
        setPosition : function(position, transition, callback){
            Camera.prototype.setPosition.apply(this.camera, arguments);
        },
        getPosition : function(){
            return Camera.prototype.getPosition.apply(this.camera);
        },
        setOrientation : function(orientation, transition, callback){
            Camera.prototype.setOrientation.apply(this.camera, arguments);
        },
        getOrientation : function(){
            return Camera.prototype.getOrientation.apply(this.camera);
        },
        zoomBy : function(delta, transition, callback){
            Camera.prototype.zoomBy.apply(this.camera, arguments);
        },
        rotateBy : function(rotation, transition, callback){
            Camera.prototype.rotateBy.apply(this.camera, arguments);
        },
        lookAt : function(transform, transition, callback){
            Camera.prototype.lookAt.apply(this.camera, arguments);
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

        var dpInv = 1 / Math.hypot(px, py, pz);
        var dqInv = 1 / Math.hypot(qx, qy, qz);

        px *= dpInv;
        py *= dpInv;
        pz *= dpInv;
        qx *= dqInv;
        qy *= dqInv;
        qz *= dqInv;

        var angle = Math.acos(px * qx + py * qy + pz * qz);

        var axisX = py * qz - pz * qy;
        var axisY = pz * qx - px * qz;
        var axisZ = px * qy - py * qx;

        return [angle, axisX, axisY, axisZ];
    }

    module.exports = Viewer;
});
