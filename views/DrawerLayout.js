/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var RenderNode = require('../core/RenderNode');
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    View = require('./view');

    /**
     * A layout which will arrange two renderables: a featured content, and a
     *   concealed drawer. The drawer can be revealed from any side of the
     *   content (left, top, right, bottom) by dragging the content.
     *
     *   A @link{Sync} must be piped in to recieve user input.
     *
     *   Events:
     *     broadcasts: 'open', 'close'
     *     listens to: 'update', 'end'
     *
     * @class DrawerLayout
     *
     * @constructor
     *
     * @param [options] {Object}                                An object of configurable options
     * @param [options.side=DrawerLayout.SIDES.LEFT] {Number}   The side of the content the drawer is placed.
     *                                                          Choice of DrawerLayout.SIDES.LEFT/RIGHT/TOP/BOTTOM
     * @param [options.drawerLength=0] {Number}                 The default length of the drawer
     * @param [options.velocityThreshold=0] {Number}            The velocity threshold to trigger a toggle
     * @param [options.positionThreshold=0] {Number}            The position threshold to trigger a toggle
     * @param [options.transition=true] {Boolean|Object}        The toggle transition
     */
    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        },
        SIDE : {
            LEFT   : 0,
            TOP    : 1,
            RIGHT  : 2,
            BOTTOM : 3
        }
    };

    module.exports = View.extend({
        defaults : {
            side: CONSTANTS.SIDE.LEFT,
            drawerLength : 0,
            velocityThreshold : 0,
            positionThreshold : 0,
            transition : true
        },
        events : {
            update : _handleUpdate,
            end : _handleEnd,
            change : _updateState
        },
        initialize : function initialize(options){
            this.initializeState(options);
            this.initializeSubviews();
        },
        initializeState : function initializeState(){
            this._position = new Transitionable(0);
            this._direction = _getDirectionFromSide(this.options.side);
            this._orientation = _getOrientationFromSide(this.options.side);
            this._isOpen = false;
            this._cachedLength = 0;
            this._cachedPosition = 0;
        },
        initializeSubviews : function initializeSubviews(){
            this.drawer = new RenderNode();
            this.content = new RenderNode();
        },
        /**
         * Reveals the drawer with a transition
         *   Emits an 'open' event when an opening transition has been committed to.
         *
         * @method open
         * @param [transition] {Boolean|Object} transition definition
         * @param [callback] {Function}         callback
         */
        open : function open(transition, callback){
            if (transition instanceof Function) callback = transition;
            if (transition === undefined) transition = this.options.transition;
            this._cachedLength = _resolveNodeSize.call(this, this.drawer);
            this.setPosition(this._cachedLength, transition, callback);
            if (!this._isOpen) {
                this._isOpen = true;
                this.emit('open');
            }
        },
        /**
         * Conceals the drawer with a transition
         *   Emits a 'close' event when an closing transition has been committed to.
         *
         * @method close
         * @param [transition] {Boolean|Object} transition definition
         * @param [callback] {Function}         callback
         */
        close : function close(transition, callback){
            if (transition instanceof Function) callback = transition;
            if (transition === undefined) transition = this.options.transition;
            this.setPosition(0, transition, callback);
            if (this._isOpen){
                this._isOpen = false;
                this.emit('close');
            }
        },
        /**
         * Toggles between open and closed states
         *
         * @method toggle
         * @param [transition] {Boolean|Object} transition definition
         */
        toggle : function toggle(transition){
            if (this._isOpen) this.close(transition);
            else this.open(transition);
        },
        /**
         * Sets the position in pixels for the content's displacement
         *
         * @method setPosition
         * @param position {Number}             position
         * @param [transition] {Boolean|Object} transition definition
         * @param [callback] {Function}         callback
         */
        setPosition : function setPosition(position, transition, callback) {
            if (this._position.isActive()) this._position.halt();
            this._position.set(position, transition, callback);
        },
        /**
         * Gets the position in pixels for the content's displacement
         *
         * @method getPosition
         * @return position {Number} position
         */
        getPosition : function getPosition() {
            return this._position.get();
        },
        /**
         * Sets the progress (between 0 and 1) for the content's displacement
         *
         * @method setProgress
         * @param progress {Number}             position
         * @param [transition] {Boolean|Object} transition definition
         * @param [callback] {Function}         callback
         */
        setProgress : function setProgress(progress, transition, callback) {
            return this._position.set(progress * this._cachedLength, transition, callback);
        },
        /**
         * Gets the progress (between 0 and 1) for the content's displacement
         *
         * @method getProgress
         * @return position {Number} position
         */
        getProgress : function getProgress(){
            return this._position.get() / this._cachedLength;
        },
        /**
         * Resets to last state of being open or closed
         *
         * @method reset
         * @param [transition] {Boolean|Object} transition definition
         */
        reset : function reset(transition) {
            if (this._isOpen) this.open(transition);
            else this.close(transition);
        },
        /*
         * Returns if drawer is committed to being open or closed
         *
         * @method isOpen
         * @return {Boolean}
         */
        isOpen : function isOpen(){
            return this._isOpen;
        },
        /**
         * Generates a Render Spec from the contents of this component
         *
         * @private
         * @method render
         * @return {Spec}
         */
        render : function render(){
            var position = this.getPosition();

            // clamp transition on close
            if (!this._isOpen && (position < 0 && this._orientation === 1) || (position > 0 && this._orientation === -1)) {
                position = 0;
                this.setPosition(position);
            }

            if (position !== this._cachedPosition)
                this.emit('update', {progress : this.getProgress()});

            var contentTransform = (this._direction === CONSTANTS.DIRECTION.X)
                ? Transform.translate(position, 0, 0)
                : Transform.translate(0, position, 0);

            this._cachedPosition = position;

            return [
                {
                    transform : Transform.behind,
                    target: this.drawer.render()
                },
                {
                    transform: contentTransform,
                    target: this.content.render()
                }
            ];
        }
    }, CONSTANTS);

    function _getDirectionFromSide(side) {
        var SIDES = CONSTANTS.SIDE;
        var DIRECTION = CONSTANTS.DIRECTION;
        return (side === SIDES.LEFT || side === SIDES.RIGHT) ? DIRECTION.X : DIRECTION.Y;
    }

    function _getOrientationFromSide(side) {
        var SIDES = CONSTANTS.SIDE;
        return (side === SIDES.LEFT || side === SIDES.TOP) ? 1 : -1;
    }

    function _resolveNodeSize(node) {
        var options = this.options;
        var size;
        if (options.drawerLength) size = options.drawerLength;
        else {
            var nodeSize = node.getSize();
            size = nodeSize ? nodeSize[this._direction] : options.drawerLength;
        }
        return this._orientation * size;
    }

    function _handleUpdate(data) {
        var newPosition = this.getPosition() + data.delta;

        var MIN_LENGTH;
        var MAX_LENGTH;
        this._cachedLength = _resolveNodeSize.call(this, this.drawer);

        if (this._orientation === 1){
            MIN_LENGTH = 0;
            MAX_LENGTH = this._cachedLength;
        }
        else {
            MIN_LENGTH = this._cachedLength;
            MAX_LENGTH = 0;
        }

        if (newPosition > MAX_LENGTH) newPosition = MAX_LENGTH;
        else if (newPosition < MIN_LENGTH) newPosition = MIN_LENGTH;

        this.setPosition(newPosition);
    }

    function _handleEnd(data) {
        var velocity = data.velocity;
        var position = this._orientation * this.getPosition();
        var options = this.options;

        var MAX_LENGTH = this._orientation * this._cachedLength;
        var positionThreshold = options.positionThreshold || MAX_LENGTH / 2;
        var velocityThreshold = options.velocityThreshold;

        if (options.transition instanceof Object)
            options.transition.velocity = data.velocity;

        if (position === 0) {
            this._isOpen = false;
            return;
        }

        if (position === MAX_LENGTH) {
            this._isOpen = true;
            return;
        }

        var shouldToggle = Math.abs(velocity) > velocityThreshold || (!this._isOpen && position > positionThreshold) || (this._isOpen && position < positionThreshold);
        if (shouldToggle) this.toggle();
        else this.reset();
    }

    function _updateState(data){
        if (data.key !== 'side') {
            this._direction = _getDirectionFromSide(data.value);
            this._orientation = _getOrientationFromSide(data.value);
        }
    }

});
