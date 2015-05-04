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

        this._eventOutput = new EventHandler();
        this._eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('start', function(){
            if (!this._dirty && this._dirtyLock == 0) {
                this._dirty = true;
                this._eventOutput.emit('start');
            }
            this._dirtyLock++;
        }.bind(this));

        this._eventInput.on('end', function(){
            this._dirtyLock--;
            if (this._dirty && this._dirtyLock == 0) {
                this._dirty = false;
                this._eventOutput.emit('end');
            }
        }.bind(this));
    }

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
            this._dirty = true;
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
            this._dirty = true;
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
            this._dirty = true;
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
            this._dirty = true;
        }
        return this;
    };

    function _update(){
        if (this._translateGetter) this._components.translate = this._translateGetter();
        if (this._scaleGetter) this._components.scale = this._scaleGetter();
        if (this._rotateGetter) this._components.rotate = this._rotateGetter();
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

    module.exports = TransitionableTransform;
});
