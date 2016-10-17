/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Transform = require('./Transform');
    var Transitionable = require('./Transitionable');
    var Quaternion = require('./_Quaternion');
    var Stream = require('../streams/Stream');
    var EventHandler = require('../events/EventHandler');
    var Camera = require('./Camera');

    var MouseInput = require('../inputs/MouseInput');
    var TouchInput = require('../inputs/TouchInput');
    var ScrollInput = require('../inputs/ScrollInput');
    var GenericInput = require('../inputs/GenericInput');

    GenericInput.register({
        mouse : MouseInput,
        touch : TouchInput
    });

    function Viewer(options) {
        Camera.call(this, arguments);

        this.delta = Quaternion.create();
        this.radius = 1000;
        this.center = [];

        var centerStream = Stream.lift(function(size, layout){
            if (!size || !layout) return false;
            var pos = Transform.getTranslate(layout.transform);
            return [pos[0] + size[0]/2, pos[1] + size[1]/2];
        }, [this._node._size, this._node.layout]);

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

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        var inertia = new Transitionable(0);
        var rotationInput = new GenericInput(['mouse', 'touch']);
        var zoomInput = new ScrollInput({direction : ScrollInput.DIRECTION.Y});

        rotationInput.subscribe(this._eventInput);
        zoomInput.subscribe(this._eventInput);

        rotationInput.on('start', function(data){
            if (inertia.isActive()) inertia.halt();

            this._eventOutput.emit('start', {
                position: this.getPosition(),
                orientation: this.getOrientation()
            });
        }.bind(this));

        rotationInput.on('update', function(data){
            var angleAxis = convertInputToAngleAxis.call(this, data);
            Quaternion.fromAngleAxis(angleAxis, this.delta);
            this.rotateBy(this.delta);

            this._eventOutput.emit('update', {
                position: this.getPosition(),
                orientation: this.getOrientation()
            });
        }.bind(this));

        rotationInput.on('end', function(data){
            var angle = Quaternion.getAngle(this.delta);
            inertia.reset(angle);
            inertia.set(angle, {
                curve : 'damp',
                damping : .9
            });
        }.bind(this));

        inertia.on('update', function(angle){
            Quaternion.setAngle(this.delta, angle, this.delta);
            this.rotateBy(this.delta);

            this._eventOutput.emit('update', {
                position: this.getPosition(),
                orientation: this.getOrientation()
            });
        }.bind(this));

        inertia.on('end', function(value){
            this._eventOutput.emit('end', {
                position: this.getPosition(),
                orientation: this.getOrientation()
            });
        }.bind(this));

        zoomInput.on('update', function(data){
            var zoom = data.delta;
            this.zoomBy(zoom);

            this._eventOutput.emit('update', {
                position: this.getPosition(),
                orientation: this.getOrientation()
            });
        }.bind(this));
    }

    Viewer.prototype = Object.create(Camera.prototype);
    Viewer.prototype.constructor = Viewer;

    function convertInputToAngleAxis(data){
        var delta = data.delta;

        var dx = delta[0];
        var dy = delta[1];

        var px = data.x - this.center[0];
        var py = data.y - this.center[1];
        var pz = this.radius;

        var qx = px + dx;
        var qy = py + dy;
        var qz = this.radius;

        var dp = Math.sqrt(px*px + py*py + pz*pz);
        var dq = Math.sqrt(qx*qx + qy*qy + qz*qz);

        px /= dp;
        py /= dp;
        pz /= dp;
        qx /= dq;
        qy /= dq;
        qz /= dq;

        var angle = Math.acos(px*qx + py*qy + pz*qz);

        var axisX = py*qz - pz*qy;
        var axisY = pz*qx - px*qz;
        var axisZ = px*qy - py*qx;

        return [angle, axisX, axisY, axisZ];
    }

    module.exports = Viewer;
});
