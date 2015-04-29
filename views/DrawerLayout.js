/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var RenderNode = require('famous/core/RenderNode');
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/core/Transitionable');
    var View = require('famous/core/view');
    var Modifier = require('famous/core/Modifier');

    /**
     * A layout which will arrange two renderables: a featured content, and a
     *   concealed drawer. The drawer can be revealed from any side of the
     *   content (left, top, right, bottom) by dragging the content.
     *
     *   A @link{Sync} must be piped in to receive user input.
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
        },
        ORIENTATION : {
            POSITIVE :  1,
            NEGATIVE : -1
        }
    };

    var DrawerLayout = View.extend({
        defaults : {
            side: CONSTANTS.SIDE.LEFT,
            drawerLength : 0,
            velocityThreshold : 0,
            positionThreshold : 0,
            transitionOpen : true,
            transitionClose : true
        },
        events : {
            update : _handleUpdate,
            end : _handleEnd,
            change : _updateState
        },
        state : {
            position : Transitionable,
            direction : Number,
            orientation : Number,
            drawerLength : Number
        },
        initialize : function initialize(options){
            this.initializeState(options);
            this.initializeSubviews();
            this.initializeEvents();

            this.add({transform : Transform.behind}).add(this.drawer);
            this.add({transform : function(){
                var position = this.getPosition();
                var direction = this.state.direction;

                return (direction == CONSTANTS.DIRECTION.X)
                    ? Transform.translate(position, 0, 0)
                    : Transform.translate(0, position, 0);

            }.bind(this)}).add(this.content);
        },
        initializeState : function initializeState(options){
            this.state.position.set(0);
            this.state.direction = _getDirectionFromSide(options.side);
            this.state.orientation = _getOrientationFromSide(options.side);
            this.state.drawerLength = 0;
            this.isOpen = false;
        },
        initializeSubviews : function initializeSubviews(){
            this.drawer = new RenderNode();
            this.content = new RenderNode();
        },
        initializeEvents : function initializeEvents(){
            this.state.position.on('update', function(data){
                this.emit('update', {progress : this.getProgress(data.value)});
            }.bind(this));
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
            if (transition === undefined) transition = this.options.transitionOpen;
            this.state.drawerLength = _resolveNodeSize.call(this, this.drawer);
            this.setPosition(this.state.drawerLength, transition, callback);
            if (!this.isOpen) {
                this.isOpen = true;
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
            if (transition === undefined) transition = this.options.transitionClose;
            this.setPosition(0, transition, callback);
            if (this.isOpen){
                this.isOpen = false;
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
            if (this.isOpen) this.close(transition);
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
            this.state.position.set(position, transition, callback);
        },
        /**
         * Gets the position in pixels for the content's displacement
         *
         * @method getPosition
         * @return position {Number} position
         */
        getPosition : function getPosition() {
            return this.state.position.get();
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
            return this.setPosition(progress * this.state.drawerLength, transition, callback);
        },
        /**
         * Gets the progress (between 0 and 1) for the content's displacement
         *
         * @method getProgress
         * @return position {Number} position
         */
        getProgress : function getProgress(position){
            if (position === undefined) position = this.getPosition();
            return position / this.state.drawerLength;
        },
        /**
         * Resets to last state of being open or closed
         *
         * @method reset
         * @param [transition] {Boolean|Object} transition definition
         */
        reset : function reset(transition) {
            if (this.isOpen) this.open(transition);
            else this.close(transition);
        },
        /*
         * Returns if drawer is committed to being open or closed
         *
         * @method isOpen
         * @return {Boolean}
         */
        isOpen : function isOpen(){
            return this.isOpen;
        }
    }, CONSTANTS);

    function _getDirectionFromSide(side) {
        var SIDES = CONSTANTS.SIDE;
        var DIRECTION = CONSTANTS.DIRECTION;
        return (side === SIDES.LEFT || side === SIDES.RIGHT)
            ? DIRECTION.X
            : DIRECTION.Y;
    }

    function _getOrientationFromSide(side) {
        var SIDES = CONSTANTS.SIDE;
        return (side === SIDES.LEFT || side === SIDES.TOP)
            ? CONSTANTS.ORIENTATION.POSITIVE
            : CONSTANTS.ORIENTATION.NEGATIVE;
    }

    function _resolveNodeSize(node) {
        var options = this.options;
        var size;
        if (options.drawerLength) size = options.drawerLength;
        else {
            var nodeSize = node.getSize();
            size = nodeSize ? nodeSize[this.state.direction] : options.drawerLength;
        }
        return this.state.orientation * size;
    }

    function _handleUpdate(data) {
        var oldPosition = this.getPosition();
        var newPosition = oldPosition + data.delta;

        if (oldPosition == newPosition) return;

        var MIN_LENGTH;
        var MAX_LENGTH;
        var length = _resolveNodeSize.call(this, this.drawer);
        this.state.drawerLength = length;

        if (this.state.orientation === 1){
            MIN_LENGTH = 0;
            MAX_LENGTH = length;
        }
        else {
            MIN_LENGTH = length;
            MAX_LENGTH = 0;
        }

        if (newPosition > MAX_LENGTH) newPosition = MAX_LENGTH;
        else if (newPosition < MIN_LENGTH) newPosition = MIN_LENGTH;

        this.setPosition(newPosition);
        this._eventOutput.emit('update', {progress : this.getProgress(newPosition)});
    }

    function _handleEnd(data) {
        var velocity = data.velocity;
        var orientation = this.state.orientation;
        var length = this.state.drawerLength;
        var isOpen = this.isOpen;

        var position = orientation * this.getPosition();
        var options = this.options;

        var MAX_LENGTH = orientation * length;
        var positionThreshold = options.positionThreshold || MAX_LENGTH / 2;
        var velocityThreshold = options.velocityThreshold;

        if (options.transition instanceof Object)
            options.transition.velocity = data.velocity;

        if (position === 0) {
            this.isOpen = false;
            return;
        }

        if (position === MAX_LENGTH) {
            this.isOpen = true;
            return;
        }

        var shouldToggle = Math.abs(velocity) > velocityThreshold || (!isOpen && position > positionThreshold) || (isOpen && position < positionThreshold);
        if (shouldToggle) this.toggle();
        else this.reset();
    }

    function _updateState(data){
        if (data.key !== 'side') {
            this.state.direction = _getDirectionFromSide(data.value);
            this.state.orientation = _getOrientationFromSide(data.value);
        }
    }

    module.exports = DrawerLayout;
});
