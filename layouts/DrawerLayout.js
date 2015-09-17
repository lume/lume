/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var View = require('samsara/core/view');
    var LayoutNode = require('samsara/core/nodes/LayoutNode');
    var Stream = require('samsara/streams/Stream');
    var Differential = require('samsara/streams/Differential');
    var Accumulator = require('samsara/streams/Accumulator');
    var EventMapper = require('samsara/events/EventMapper');

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        },
        SIDE : {
            LEFT : 0,
            TOP : 1,
            RIGHT : 2,
            BOTTOM : 3
        },
        ORIENTATION : {
            POSITIVE :  1,
            NEGATIVE : -1
        }
    };

    /**
     * A layout composed of two sections: content and drawer.
     *
     *  The drawer is initially hidden behind the content, until it is moved
     *  by a call to setPosition. The source of the movement can be by subscribing
     *  the layout to user input (like a Mouse/Touch/Scroll input), or by manually
     *  calling setPosition with a transition.
     *
     *  The layout emits a stream of pixel displacement and progress (between 0 and 1) JSON.
     *
     *  The drawer can be revealed from any side of the content (top, left, bottom, right).
     *
     *  @class DrawerLayout
     *  @constructor
     *  @extends View
     *  @param [options] {Object}                       Options
     *  @param [options.side] {Number}                  Side to reveal the drawer from. Defined in DrawerLayout.SIDES
     *  @param [options.revealLength] {Number}          The maximum length to reveal the drawer
     *  @param [options.velocityThreshold] {Number}     The velocity needed to complete the drawer transition
     *  @param [options.positionThreshold] {Number}     The displacement needed to complete the drawer transition
     *  @param [options.transitionClose] {Object}       A transition definition for closing the drawer
     *  @param [options.transitionOpen] {Object}        A transition definition for opening the drawer
     */

    var DrawerLayout = View.extend({
        defaults : {
            side : CONSTANTS.SIDE.LEFT,
            revealLength : undefined,
            velocityThreshold : 0,
            positionThreshold : 0,
            transitionOpen : true,
            transitionClose : true
        },
        events : {
            change : _updateState
        },
        initialize : function initialize(options){
            // DERIVED STATE

            // vertical or horizontal movement
            this.direction = _getDirectionFromSide(options.side);

            // positive or negative movement along the direction
            this.orientation = _getOrientationFromSide(options.side);

            // scale the revealLength by the parity of the direction
            this.options.revealLength *= this.orientation;

            // open state (needed for toggling)
            this.isOpen = false;

            // STREAMS
            
            // responsible for manually moving the content without user input
            this.transitionStream = new Transitionable(0);

            // responsible for moving the content from user input
            var gestureStream = new Stream({
                start : function (){
                    this.position.unsubscribe(differential);
                    return 0;
                }.bind(this),
                update : function (data){
                    // modify the delta from user input to be constrained
                    // by the revealLength
                    var delta = data.delta;
                    var newDelta = delta;
                    var revealLength = options.revealLength;

                    var currentPosition = this.position.get();
                    var newPosition = currentPosition + delta;

                    var MIN_LENGTH = 0;
                    var MAX_LENGTH = 0;

                    if (this.orientation === CONSTANTS.ORIENTATION.POSITIVE)
                        MAX_LENGTH = revealLength;
                    else
                        MIN_LENGTH = revealLength;

                    if (newPosition >= MAX_LENGTH || newPosition <= MIN_LENGTH){
                        if (newPosition > MAX_LENGTH && newPosition > MIN_LENGTH && currentPosition !== MAX_LENGTH)
                            newDelta = MAX_LENGTH - currentPosition;
                        else if (newPosition < MIN_LENGTH && currentPosition !== MIN_LENGTH)
                            newDelta = MIN_LENGTH - currentPosition;
                        else newDelta = 0;
                    }

                    return newDelta;
                }.bind(this),
                end : function (data){
                    this.position.subscribe(differential);
                    var velocity = data.velocity;
                    var orientation = this.orientation;
                    var length = this.options.revealLength;
                    var isOpen = this.isOpen;
                    var currentPosition = this.position.get();

                    var options = this.options;

                    var MAX_LENGTH = orientation * length;
                    var positionThreshold = options.positionThreshold || MAX_LENGTH / 2;
                    var velocityThreshold = options.velocityThreshold;

                    if (options.transition instanceof Object)
                        options.transition.velocity = velocity;

                    if (currentPosition === 0) {
                        this.isOpen = false;
                        return;
                    }

                    if (currentPosition === MAX_LENGTH) {
                        this.isOpen = true;
                        return;
                    }

                    var shouldToggle =
                        Math.abs(velocity) > velocityThreshold           ||
                        (!isOpen && currentPosition > positionThreshold) ||
                        (isOpen && currentPosition < positionThreshold);

                    (shouldToggle) ? this.toggle() : this.reset();
                }.bind(this)
            });

            gestureStream.subscribe(this.input);

            var differential = new Differential();
            differential.subscribe(this.transitionStream);

            this.position = new Accumulator();
            this.position.subscribe(gestureStream);
            this.position.subscribe(differential);


            this.position.on('start', function(){console.log('start')})
            this.position.on('update', function(){console.log('update')})
            this.position.on('end', function(){console.log('end')})

            var outputMapper = new EventMapper(function(position){
                return {
                    value : position,
                    progress : position / this.options.revealLength
                }
            }.bind(this));

            this.output.subscribe(outputMapper).subscribe(this.position);
        },
        addDrawer : function addDrawer(drawer){
            if (this.options.revealLength == undefined)
                this.options.revealLength = drawer.getSize()[this.direction];

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
            this.setPosition(this.options.revealLength, transition, callback);
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
            this.transitionStream.set(this.position.get());
            this.transitionStream.set(position, transition, callback);
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
        this.options.revealLength *= this.direction;
    }

    module.exports = DrawerLayout;
});
