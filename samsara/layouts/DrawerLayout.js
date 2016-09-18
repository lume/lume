/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    var View = require('../core/View');
    var Stream = require('../streams/Stream');
    var Differential = require('../streams/Differential');
    var Accumulator = require('../streams/Accumulator');
    var EventMapper = require('../events/EventMapper');

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
     *  @class DrawerLayout
     *  @constructor
     *  @namespace Layouts
     *  @extends Core.View
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
            velocityThreshold : Infinity,
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
            var gestureDelta = new Stream({
                start : function (){
                    this.transitionStream.halt();
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
                        else
                            newDelta = 0;
                    }

                    return newDelta;
                }.bind(this),
                end : function (data){
                    var velocity = data.velocity;

                    var orientation = this.orientation;
                    var position = this.position.get();

                    var length = options.revealLength;
                    var MAX_LENGTH = orientation * length;
                    var positionThreshold = options.positionThreshold || MAX_LENGTH / 2;
                    var velocityThreshold = options.velocityThreshold;

                    if (position === 0) {
                        this.isOpen = false;
                        return false;
                    }

                    if (position === MAX_LENGTH) {
                        this.isOpen = true;
                        return false;
                    }

                    var shouldOpen =
                        (position >= positionThreshold) && ((velocity > -velocityThreshold) || (velocity > velocityThreshold)) ||
                        (position <  positionThreshold) && ((velocity >  velocityThreshold));

                    if (shouldOpen){
                        this.options.transitionOpen.velocity = velocity;
                        this.open(this.options.transitionOpen, function(){
                            this.options.transitionOpen.velocity = 0;
                        }.bind(this));
                    }
                    else {
                        this.options.transitionClose.velocity = velocity;
                        this.close(this.options.transitionClose, function(){
                            this.options.transitionClose.velocity = 0;
                        }.bind(this));
                    }

                    return 0;
                }.bind(this)
            });

            gestureDelta.subscribe(this.input);

            var transitionDelta = new Differential();
            transitionDelta.subscribe(this.transitionStream);

            this.position = new Accumulator(0);
            this.position.subscribe(gestureDelta);
            this.position.subscribe(transitionDelta);

            var outputMapper = new EventMapper(function(position){
                return {
                    value : position,
                    progress : position / this.options.revealLength
                }
            }.bind(this));

            this.output.subscribe(outputMapper).subscribe(this.position);
        },
        /**
         * Set the drawer component with a Surface of View.
         *
         * @method addDrawer
         * @param drawer {Surface|View}
         */
        addDrawer : function addDrawer(drawer){
            if (this.options.revealLength === undefined)
                this.options.revealLength = drawer.getSize()[this.direction];

            this.drawer = drawer;
            this.add({transform : Transform.behind}).add(this.drawer);
        },
        /**
         * Set the content component with a Surface or View.
         *
         * @method addContent
         * @param content {Surface|View}
         */
        addContent : function addContent(content){
            var transform = this.position.map(function(position){
                return (this.direction === CONSTANTS.DIRECTION.X)
                    ? Transform.translateX(position)
                    : Transform.translateY(position)
            }.bind(this));

            this.add({transform : transform}).add(content);
        },
        /**
         * Reveals the drawer with a transition.
         *   Emits an `open` event when an opening transition has been committed to.
         *
         * @method open
         * @param [transition] {Boolean|Object} transition definition
         * @param [callback] {Function}         callback
         */
        open : function open(transition, callback){
            if (transition === undefined) transition = this.options.transitionOpen;
            this.setPosition(this.options.revealLength, transition, callback);
            if (!this.isOpen) {
                this.isOpen = true;
                this.emit('open');
            }
        },
        /**
         * Conceals the drawer with a transition.
         *   Emits a `close` event when an closing transition has been committed to.
         *
         * @method close
         * @param [transition] {Boolean|Object} transition definition
         * @param [callback] {Function}         callback
         */
        close : function close(transition, callback){
            if (transition === undefined) transition = this.options.transitionClose;
            this.setPosition(0, transition, callback);
            if (this.isOpen){
                this.isOpen = false;
                this.emit('close');
            }
        },
        /**
         * Toggles between open and closed states.
         *
         * @method toggle
         * @param [transition] {Boolean|Object} transition definition
         */
        toggle : function toggle(transition){
            if (this.isOpen) this.close(transition);
            else this.open(transition);
        },
        /**
         * Sets the position in pixels for the content's displacement.
         *
         * @method setPosition
         * @param position {Number}             position
         * @param [transition] {Boolean|Object} transition definition
         * @param [callback] {Function}         callback
         */
        setPosition : function setPosition(position, transition, callback) {
            this.transitionStream.reset(this.position.get());
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
