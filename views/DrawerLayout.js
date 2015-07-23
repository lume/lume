/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/core/Transitionable');
    var View = require('famous/core/view');
    var LayoutNode = require('famous/core/nodes/LayoutNode');
    var Stream = require('famous/streams/Stream');
    var Differential = require('famous/streams/Differential');
    var EventMapper = require('famous/events/EventMapper');

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
            change : _updateState
        },
        initialize : function initialize(options){
            this.direction = _getDirectionFromSide(options.side);
            this.orientation = _getOrientationFromSide(options.side);
            this.drawerLength = options.drawerLength;
            this.isOpen = false;

            this._position = 0;

            this.gestureStream = new Stream({
                update : function(data){
                    var newPosition = this._position + data.delta;

                    var MIN_LENGTH = 0;
                    var MAX_LENGTH = 0;

                    if (this.orientation === CONSTANTS.ORIENTATION.POSITIVE)
                        MAX_LENGTH = this.drawerLength;
                    else
                        MIN_LENGTH = this.drawerLength;

                    if (newPosition < MAX_LENGTH && newPosition > MIN_LENGTH)
                        this.gestureStream.emit('update', {delta : data.delta});
                    else {
                        if (newPosition > MAX_LENGTH && newPosition > MIN_LENGTH && this._position !== MAX_LENGTH){
                            var delta = MAX_LENGTH - this._position;
                            this.gestureStream.emit('update', {delta : delta});
                        } else if (newPosition < MIN_LENGTH && this._position !== MIN_LENGTH){
                            var delta = MIN_LENGTH - this._position;
                            this.gestureStream.emit('update', {delta : delta});
                        }
                    }
                }.bind(this)
            });

            this.gestureStream.on('end', function(data){
                var velocity = data.velocity;
                var orientation = this.orientation;
                var length = this.drawerLength;
                var isOpen = this.isOpen;

                var options = this.options;

                var MAX_LENGTH = orientation * length;
                var positionThreshold = options.positionThreshold || MAX_LENGTH / 2;
                var velocityThreshold = options.velocityThreshold;

                if (options.transition instanceof Object)
                    options.transition.velocity = data.velocity;

                if (this._position === 0) {
                    this.isOpen = false;
                    return;
                }

                if (this._position === MAX_LENGTH) {
                    this.isOpen = true;
                    return;
                }

                var shouldToggle = Math.abs(velocity) > velocityThreshold || (!isOpen && this._position > positionThreshold) || (isOpen && this._position < positionThreshold);
                (shouldToggle) ? this.toggle() : this.reset();
            }.bind(this));

            this.inertialStream = new Transitionable(0);

            var differential = new Differential();
            differential.subscribe(this.inertialStream);

            this.position = new Stream({
                start : function(){
                    this.position.emit('start',this._position);
                }.bind(this),
                update : function(data){
                    this._position += data.delta;
                    this.position.emit('update', this._position);
                }.bind(this),
                end : function(){
                    this.position.emit('end',this._position);
                }.bind(this)
            });

            this.position.subscribe(this.gestureStream);
            this.position.subscribe(differential);

            var outputMapper = new EventMapper(function(position){
                return {
                    value : position,
                    progress : position / this.drawerLength
                }
            }.bind(this));

            this._eventOutput.subscribe(outputMapper).subscribe(this.position);
        },
        addDrawer : function addDrawer(drawer){
            this.drawer = drawer;
            var layout = new LayoutNode({transform : Transform.behind});
            this.add(layout).add(this.drawer);
        },
        addContent : function addContent(content){
            var transform = this.position.map(function(position){
                return (this.direction === CONSTANTS.DIRECTION.X)
                    ? Transform.translateX(position)
                    : Transform.translateY(position)
            }.bind(this));

            var layout = new LayoutNode({transform : transform});
            this.add(layout).add(content);
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
            this.setPosition(this.drawerLength, transition, callback);
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
            this.inertialStream.set(this._position);
            this.inertialStream.set(position, transition, callback);
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
        var SIDE = CONSTANTS.SIDE;
        var DIRECTION = CONSTANTS.DIRECTION;
        return (side === SIDE.LEFT || side === SIDE.RIGHT)
            ? DIRECTION.X
            : DIRECTION.Y;
    }

    function _getOrientationFromSide(side) {
        var SIDES = CONSTANTS.SIDE;
        return (side === SIDES.LEFT || side === SIDES.TOP)
            ? CONSTANTS.ORIENTATION.POSITIVE
            : CONSTANTS.ORIENTATION.NEGATIVE;
    }

    function _updateState(data){
        var key = data.key;
        var value = data.value;
        if (key !== 'side') {
            this.direction = _getDirectionFromSide(value);
            this.orientation = _getOrientationFromSide(value);
        }
    }

    module.exports = DrawerLayout;
});
