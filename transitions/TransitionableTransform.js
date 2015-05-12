/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Transitionable = require('famous/core/Transitionable');
    var Transform = require('famous/core/Transform');
    var EventHandler = require('famous/core/EventHandler');
    var dirtyQueue = require('famous/core/dirtyQueue');

    /**
     * A class for transitioning the state of a Transform by transitioning
     * its translate, scale, skew and rotate components independently.
     *
     * @class TransitionableTransform
     * @constructor
     *
     */
    function TransitionableTransform() {
        this._transform = Transform.identity.slice();
        this._components = Transform.interpret(this._transform);

        this._dirty = true;
        this._dirtyLock = 0;
        this._getCalled = false;

        this._translateGetter = null;
        this._translateXGetter = null;
        this._translateYGetter = null;
        this._translateZGetter = null;
        this._scaleGetter = null;
        this._scaleXGetter = null;
        this._scaleYGetter = null;
        this._rotateGetter = null;
        this._rotateZGetter = null;
        this._skewGetter = null;

        this._eventOutput = new EventHandler();
        this._eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('dirty', function(){
            if (!this._dirty) {
                this._dirty = true;
                this._eventOutput.emit('dirty');
            }
            this._dirtyLock++;
        }.bind(this));

        this._eventInput.on('clean', function(){
            if (this._dirtyLock > 0) this._dirtyLock--;
            if (this._dirty && this._dirtyLock == 0) {
                this._dirty = false;
                this._eventOutput.emit('clean');
            }
        }.bind(this));
    }

    TransitionableTransform.prototype.translateXFrom = function translateXFrom(translateX) {
        if (translateX instanceof Function){
            this._translateXGetter = translateX;
            this._dirty = true;
            this._dirtyLock++;
        }
        else if (translateX instanceof Object && translateX.get){
            this._translateXGetter = translateX.get.bind(translateX);
            this._eventInput.subscribe(translateX);
        }
        else {
            this._translateXGetter = null;
            this._components.translate[0] = translateX;
            dirtyQueue.push(this);
        }
        return this;
    };

    TransitionableTransform.prototype.translateYFrom = function translateYFrom(translateY) {
        if (translateY instanceof Function){
            this._translateYGetter = translateY;
            this._dirty = true;
            this._dirtyLock++;
        }
        else if (translateY instanceof Object && translateY.get){
            this._translateYGetter = translateY.get.bind(translateY);
            this._eventInput.subscribe(translateY);
        }
        else {
            this._translateYGetter = null;
            this._components.translate[1] = translateY;
            dirtyQueue.push(this);
        }
        return this;
    };

    TransitionableTransform.prototype.translateZFrom = function translateYFrom(translateZ) {
        if (translateZ instanceof Function){
            this._translateZGetter = translateZ;
            this._dirty = true;
            this._dirtyLock++;
        }
        else if (translateZ instanceof Object && translateZ.get){
            this._translateZGetter = translateZ.get.bind(translateZ);
            this._eventInput.subscribe(translateZ);
        }
        else {
            this._translateZGetter = null;
            this._components.translate[2] = translateZ;
            dirtyQueue.push(this);
        }
        return this;
    };

    TransitionableTransform.prototype.translateFrom = function translateFrom(translate) {
        if (translate instanceof Function){
            this._translateGetter = translate;
            this._dirty = true;
            this._dirtyLock++;
        }
        else if (translate instanceof Object && translate.get){
            this._translateGetter = translate.get.bind(translate);
            this._eventInput.subscribe(translate);
        }
        else {
            this._translateGetter = null;
            this._components.translate = translate;
            if (!this._dirty) this.emit('dirty');
            dirtyQueue.push(this);
        }
        return this;
    };

    TransitionableTransform.prototype.scaleFrom = function scaleFrom(scale) {
        if (scale instanceof Function){
            this._scaleGetter = scale;
            this._dirty = true;
            this._dirtyLock++;
        }
        else if (scale instanceof Object && scale.get){
            this._scaleGetter = scale.get.bind(scale);
            this._eventInput.subscribe(scale);
        }
        else {
            this._scaleGetter = null;
            this._components.scale = scale;
            dirtyQueue.push(this);
        }
        return this;
    };

    TransitionableTransform.prototype.scaleXFrom = function scaleXFrom(scale) {
        if (scale instanceof Function){
            this._scaleGetter = scale;
            this._dirty = true;
            this._dirtyLock++;
        }
        else if (scale instanceof Object && scale.get){
            this._scaleXGetter = scale.get.bind(scale);
            this._eventInput.subscribe(scale);
        }
        else {
            this._scaleXGetter = null;
            this._components.scale[0] = scale;
            dirtyQueue.push(this);
        }
        return this;
    };

    TransitionableTransform.prototype.scaleYFrom = function scaleYFrom(scale) {
        if (scale instanceof Function){
            this._scaleGetter = scale;
            this._dirty = true;
            this._dirtyLock++;
        }
        else if (scale instanceof Object && scale.get){
            this._scaleYGetter = scale.get.bind(scale);
            this._eventInput.subscribe(scale);
        }
        else {
            this._scaleYGetter = null;
            this._components.scale[1] = scale;
            dirtyQueue.push(this);
        }
        return this;
    };

    TransitionableTransform.prototype.rotateFrom = function rotateFrom(rotate) {
        if (rotate instanceof Function){
            this._rotateGetter = rotate;
            this._dirty = true;
            this._dirtyLock++;
        }
        else if (rotate instanceof Object && rotate.get){
            this._rotateGetter = rotate.get.bind(rotate);
            this._eventInput.subscribe(rotate);
        }
        else {
            this._rotateGetter = null;
            this._components.rotate = rotate;
            dirtyQueue.push(this);
        }
        return this;
    };

    TransitionableTransform.prototype.rotateZFrom = function rotateZFrom(rotateZ) {
        if (rotateZ instanceof Function){
            this._rotateZGetter = rotateZ;
            this._dirty = true;
            this._dirtyLock++;
        }
        else if (rotateZ instanceof Object && rotateZ.get){
            this._rotateZGetter = rotateZ.get.bind(rotateZ);
            this._eventInput.subscribe(rotateZ);
        }
        else {
            this._rotateZGetter = null;
            this._components.rotate[2] = rotateZ;
            dirtyQueue.push(this);
        }
        return this;
    };

    TransitionableTransform.prototype.skewFrom = function skewFrom(skew) {
        if (skew instanceof Function){
            this._skewGetter = skew;
            this._dirty = true;
            this._dirtyLock++;
        }
        else if (skew instanceof Object && skew.get){
            this._skewGetter = skew.get.bind(skew);
            this._eventInput.subscribe(skew);
        }
        else {
            this._skewGetter = null;
            this._components.rotate = skew;
            dirtyQueue.push(this);
        }
        return this;
    };

    function _update(){
        if (this._translateGetter) this._components.translate = this._translateGetter();
        if (this._translateXGetter) this._components.translate[0] = this._translateXGetter();
        if (this._translateYGetter) this._components.translate[1] = this._translateYGetter();
        if (this._translateZGetter) this._components.translate[2] = this._translateZGetter();
        if (this._scaleGetter) this._components.scale = this._scaleGetter();
        if (this._scaleXGetter) this._components.scale[0] = this._scaleXGetter();
        if (this._scaleYGetter) this._components.scale[1] = this._scaleYGetter();
        if (this._rotateGetter) this._components.rotate = this._rotateGetter();
        if (this._rotateZGetter) this._components.rotate[2] = this._rotateZGetter();
        if (this._skewGetter) this._components.skew = this._skewGetter();
    }
    /**
     * Getter. Returns the current state of the Transform
     *
     * @method get
     *
     * @return {Transform}
     */
    TransitionableTransform.prototype.get = function get() {
        if (this._dirty){
            _update.call(this);
            this._transform = Transform.build(this._components);
            if (this._dirtyLock == 0) this._dirty = false;
        }
        return this._transform;
    };

    TransitionableTransform.prototype.clean = function(){
        if (this._dirtyLock == 0) {
            this._dirty = false;
            this.emit('clean');
        }
    };

    module.exports = TransitionableTransform;
});
