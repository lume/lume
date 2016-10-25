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
    var PinchInput = require('../inputs/PinchInput');
    var GenericInput = require('../inputs/GenericInput');

    GenericInput.register({
        mouse : MouseInput,
        touch : TouchInput,
        pinch : PinchInput,
        scroll : ScrollInput
    });

    /**
     * A tackball camera. This is a camera that rotates (in place) what is added to its render tree. It can
     *  also zoom in and out. These actions are tied to DOM events. Rotation is connected to mouse and touch events,
     *  and zooming is connected to the scrollwheel.
     *
     *  The drawer is initially hidden behind the content, until it is moved
     *  by a call to setPosition. The source of the movement can be by subscribing
     *  the layout to user input (like a Mouse/Touch/Scroll input), or by manually
     *  calling setPosition with a transition.
     *
     *  The layout emits a `start`, `update` and `end` Stream with payload
     *
     *      `progress` - Number between 0 and 1 indicating how open the drawer is
     *      `value` - Pixel displacement in how open the drawer is
     *
     *  It also emits `close` and `open` events.
     *
     *  The drawer can be revealed from any side of the content (top, left, bottom, right),
     *  by specifying a side option.
     *
     *  @class TrackballCamera
     *  @constructor
     *  @namespace Camera
     *  @extends Core.Controller
     *  @param [options] {Object}                       Options
     *  @param [options.radius] {Number}                  Side to reveal the drawer from. Defined in DrawerLayout.SIDES
     *  @param [options.rotationScale] {Number}          The maximum length to reveal the drawer
     *  @param [options.zoomScale] {Number}     The velocity needed to complete the drawer transition
     *  @param [options.inertia] {Number}     The displacement needed to complete the drawer transition
     *  @param [options.position] {Object}       A transition definition for closing the drawer
     *  @param [options.orientation] {Object}        A transition definition for opening the drawer
     */
    var TrackballCamera = Controller.extend({
        defaults : {
            radius: 500,
            rotationScale: 1,
            zoomScale: 1,
            inertia: true,
            position: Camera.DEFAULT_OPTIONS.position,
            orientation: Camera.DEFAULT_OPTIONS.orientation
        },
        initialize : function(options){
            this.camera = new Camera(options);
            this.delta = Quaternion.create();

            this.orientation = this.camera.orientation;
            this.position = this.camera.position;

            this.center = [];
            var centerStream = Stream.lift(function(size, layout){
                if (!size || !layout) return false;
                var pos = Transform.getTranslate(layout.transform);
                this.center[0] = pos[0] + 0.5 * size[0];
                this.center[1] = pos[1] + 0.5 * size[1];
            }.bind(this), [this.camera._node._size, this.camera._node.layout]);

            centerStream.on('start', function(center){});
            centerStream.on('update', function(center){});
            centerStream.on('end', function(center){});

            var rotationInertia = options.inertia ? new Transitionable(0) : false;
            var rotationInput = new GenericInput(['mouse', 'touch'], {scale : options.rotationScale, limit: 1});
            var zoomInput = new GenericInput({
                pinch : {scale: options.zoomScale},
                scroll : {scale: options.zoomScale, direction: ScrollInput.DIRECTION.Y}
            });

            rotationInput.subscribe(this.input);
            zoomInput.subscribe(this.input);

            var hasMoved = false;
            rotationInput.on('start', function(data){
                hasMoved = false;
                if (rotationInertia && rotationInertia.isActive()) rotationInertia.halt();

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
                if (!hasMoved || !rotationInertia) {
                    this.emit('end', {
                        position: this.getPosition(),
                        orientation: this.getOrientation()
                    });
                }
                else {
                    var angle = Quaternion.getAngle(this.delta);
                    rotationInertia.reset(angle);
                    rotationInertia.set(angle, {
                        curve : 'damp',
                        damping : .9
                    });
                }
            }.bind(this));

            if (rotationInertia){
                rotationInertia.on('update', function(angle){
                    Quaternion.setAngle(this.delta, angle, this.delta);
                    this.rotateBy(this.delta);

                    this.emit('update', {
                        position: this.getPosition(),
                        orientation: this.getOrientation()
                    });
                }.bind(this));

                rotationInertia.on('end', function(value){
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

    module.exports = TrackballCamera;
});
