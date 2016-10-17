/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Transform = require('./Transform');
    var Stream = require('../streams/Stream');
    var EventHandler = require('../events/EventHandler');
    var Camera = require('./Camera');

    function Viewer(){
        Camera.call(this, arguments);

        var centerStream = Stream.lift(function(size, layout){
            if (!size || !layout) return false;
            var pos = Transform.getTranslate(layout.transform);
            return [pos[0] + size[0]/2, pos[1] + size[1]/2];
        }, [this._node._size, this._node.layout]);

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('start', function(){
            this._eventOutput.emit('start', {
                position: this.getPosition(),
                orientation: this.getOrientation()
            });
        }.bind(this));

        this._eventInput.on('end', function(){
            this._eventOutput.emit('end', {
                position: this.getPosition(),
                orientation: this.getOrientation()
            });
        }.bind(this));

        this._eventInput.on('rotate', function(rotation){
            this.rotateBy(rotation);
            this._eventOutput.emit('update', {
                position: this.getPosition(),
                orientation: this.getOrientation()
            });
        }.bind(this));

        this._eventInput.on('translate', function(delta){
            this.translateBy(delta);
            this._eventOutput.emit('update', {
                position: this.getPosition(),
                orientation: this.getOrientation()
            });
        }.bind(this));

        this._eventInput.on('zoom', function(zoom){
            this.zoomBy(zoom);
            this._eventOutput.emit('update', {
                position: this.getPosition(),
                orientation: this.getOrientation()
            });
        }.bind(this));
    }

    Viewer.prototype = Object.create(Camera.prototype);
    Viewer.prototype.constructor = Viewer;

    module.exports = Viewer;
});
