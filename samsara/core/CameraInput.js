/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Quaternion = require('./_Quaternion');
    var EventHandler = require('../events/EventHandler');

    var MouseInput = require('../inputs/MouseInput');
    var TouchInput = require('../inputs/TouchInput');
    var ScrollInput = require('../inputs/ScrollInput');
    var GenericInput = require('../inputs/GenericInput');

    GenericInput.register({
        mouse : MouseInput,
        touch : TouchInput
    });

    function CameraInput(){
        this.delta = Quaternion.create();
        this.radius = 300;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        var rotationInput = new GenericInput(['mouse', 'touch']);
        var zoomInput = new ScrollInput({direction : ScrollInput.DIRECTION.Y});

        rotationInput.on('start', function(data){
            this._eventOutput.emit('start', data);
        }.bind(this));

        rotationInput.on('end', function(data){
            this._eventOutput.emit('end', data);
        }.bind(this));

        rotationInput.subscribe(this._eventInput);
        zoomInput.subscribe(this._eventInput);

        rotationInput.on('update', handleRotation.bind(this));
        zoomInput.on('update', handleZoom.bind(this));
    }

    function handleRotation(data){
        var delta = data.delta;

        var dx = delta[0];
        var dy = delta[1];

        var px = data.x - window.innerWidth/2;
        var py = data.y - window.innerHeight/2;
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

        Quaternion.fromAngleAxis([angle, axisX, axisY, axisZ], this.delta);

        this.emit('rotate', this.delta);
    }

    function handleZoom(data){
        this.emit('zoom', data.delta);
    }

    module.exports = CameraInput;
});
