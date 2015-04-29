/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var PhysicsEngine = require('famous/physics/PhysicsEngine');
    var Particle = require('famous/physics/bodies/Particle');
    var Drag = require('famous/physics/forces/Drag');
    var Spring = require('famous/physics/constraints/Snap');

    var ViewSequence = require('famous/core/ViewSequence');
    var Transitionable = require('famous/core/Transitionable');

    var View = require('famous/core/View');
    var Scroller = require('famous/views/Scroller');

    var Accumulator = require('famous/inputs/Accumulator');
    var GenericSync = require('famous/inputs/GenericSync');
    var ScrollSync = require('famous/inputs/ScrollSync');
    var TouchSync = require('famous/inputs/TouchSync');
    GenericSync.register({scroll : ScrollSync, touch : TouchSync});

    /** @enum */
    var SpringStates = {
        NONE: 0,
        EDGE: 1,
        PAGE: 2
    };

    /** @enum */
    var EdgeStates = Scroller.EDGE_STATES;

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        }
    };

    /**
     * Scrollview will lay out a collection of renderables sequentially in the specified direction, and will
     * allow you to scroll through them with mousewheel or touch events.
     * @class Scrollview
     */

    var Scrollview = module.exports = View.extend({
        defaults : {
            direction: CONSTANTS.DIRECTION.Y,
            rails: true,
            friction: 0.005,
            drag: 0.0001,
            edgeGrip: 0.3,
            edgePeriod: 300,
            edgeDamp: 1,
            margin: 2*Math.max(1000, window.innerWidth, window.innerHeight),
            paginated: false,
            pagePeriod: 200,
            pageDamp: 0.7,
            clipSize: undefined,
            pageStopSpeed: 1,       // speed threshold to stop a pagination from firing
            pageSwitchSpeed: 0.5,   // speed threshold to flick forward or back
            speedLimit: 0.5,        // maximum speed the scrollview can scroll without user input
            groupScroll: false,     // pipes mouse and touch events automatically to the scrollview
            syncScale: 1,
            preventDefault: true
        },
        events : {
            change : _updateOptions
        },
        initialize : function(options){
            this.initializeState(options);
            this.initializeSubviews(options);
            this.initializeEvents(options);

            this.add(this._scroller);
        },
        initializeSubviews : function(options){
            this._scroller = new Scroller(options);
            this._scroller.offsetFrom(this.getOffset.bind(this));
        },
        initializeState : function(options){
            // physics
            this._physicsEngine = new PhysicsEngine();
            this._particle = new Particle();
            this._physicsEngine.addBody(this._particle);

            this.spring = new Spring({
                anchor: [0, 0, 0],
                period: options.edgePeriod,
                dampingRatio: options.edgeDamp
            });
            this.drag = new Drag({
                forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC,
                strength: options.drag
            });
            this.friction = new Drag({
                forceFunction: Drag.FORCE_FUNCTIONS.LINEAR,
                strength: options.friction
            });

            // state
            this._node = null;
            this._touchCount = 0;
            this._springState = SpringStates.NONE;
            this._edgeState = EdgeStates.NONE;
            this._pageSpringPosition = 0;
            this._edgeSpringPosition = 0;
            this._earlyEnd = false;
            this._displacement = 0;
            this._totalShift = 0;

            this._offset = new Accumulator(0);
            this._position = new Transitionable(0);

            this._payload = {
                index: 0,
                position: 0,
                offset: 0,
                progress : 0
            };
        },
        initializeEvents : function(options){
            this.sync = new GenericSync(
                ['scroll', 'touch'],
                {
                    direction :     options.direction,
                    scale :         -options.syncScale,
                    rails:          options.rails,
                    preventDefault: options.preventDefault
                }
            );

            this._scroller.on('onEdge', function(data) {
                this.sync.setOptions({scale: options.edgeGrip});
                this._edgeSpringPosition = data.offset;
                _handleEdge.call(this, data.edge);
            }.bind(this));

            this._scroller.on('offEdge', function() {
                this.sync.setOptions({scale: -options.syncScale});
                this._edgeState = EdgeStates.NONE;
            }.bind(this));

            this.sync.on('start', _handleSyncStart.bind(this));
            this.sync.on('update', _handleSyncUpdate.bind(this));
            this.sync.on('end', _handleSyncEnd.bind(this));

            this._particle.on('start', _handlePhysicsStart.bind(this));
            this._particle.on('update', _handlePhysicsUpdate.bind(this));
            this._particle.on('end', _handlePhysicsEnd.bind(this));

            this._offset.on('update', _handleOffsetUpdate.bind(this));

            this._position.on('start', _handleStart.bind(this));
            this._position.on('end', _handleEnd.bind(this));

            // sync, particle and transitionable accumulate in offset
            this._offset.addSource(this._position);
            this._offset.addSource(this._particle);
            this._offset.addSource(this.sync);

            // touch input goes to the sync
            this.sync.subscribe(this._eventInput);

            this.subscribe(this._offset);

            if (options.groupScroll)
                this.subscribe(this._scroller)
        },
        /**
         * Returns the index of the first visible renderable
         *
         * @method getCurrentIndex
         * @return {Number} The current index of the ViewSequence
         */
        getCurrentIndex : function(){
            return this._node.index;
        },
        /**
         * goToPreviousPage paginates your Scrollview instance backwards by one item.
         *
         * @method goToPreviousPage
         */
        goToPreviousPage : function(){
            if (!this._node || this._edgeState === EdgeStates.TOP) return;

            // if moving back to the current node
            if (this.getOffset() > 0 && this._springState === SpringStates.NONE) {
                _detachDrag.call(this);
                _setSpring.call(this, 0, SpringStates.PAGE);
                _attachSpring.call(this);
                return;
            }

            // if moving to the previous node
            var previousNode = this._node.getPrevious();
            if (previousNode) {
                var previousNodeSize = _nodeSizeForDirection.call(this, previousNode);
                this._scroller.sequenceFrom(previousNode);
                this._node = previousNode;
                _shiftOrigin.call(this, previousNodeSize);
                _detachDrag.call(this);
                _setSpring.call(this, 0, SpringStates.PAGE);
                _attachSpring.call(this);

                if (this.getOffset() > 0.5 * previousNodeSize)
                    this.emit('pageChange', {direction: -1, index: this.getCurrentIndex()});

                return;
            }
        },
        /**
         * goToNextPage paginates your Scrollview instance forwards by one item.
         *
         * @method goToNextPage
         */
        goToNextPage : function(){
            if (!this._node || this._edgeState === EdgeStates.BOTTOM) return;

            var nextNode = this._node.getNext();
            if (nextNode) {
                var currentNodeSize = _nodeSizeForDirection.call(this, this._node);
                this._scroller.sequenceFrom(nextNode);
                this._node = nextNode;
                _shiftOrigin.call(this, -currentNodeSize);
                _detachDrag.call(this);
                _setSpring.call(this, 0, SpringStates.PAGE);
                _attachSpring.call(this);

                if (this.getOffset() < 0.5 * currentNodeSize)
                    this.emit('pageChange', {direction: 1, index: this.getCurrentIndex()});
            }
        },
        /**
         * Paginates the Scrollview to an absolute page index.
         *
         * @method goToPage
         */
        goToPage : function(index){
            var currentIndex = this.getCurrentIndex();
            if (currentIndex > index) {
                while (currentIndex !== index) {
                    this.goToPreviousPage();
                    currentIndex--;
                }
            }
            else if (currentIndex < index) {
                while (currentIndex !== index) {
                    this.goToNextPage();
                    currentIndex++;
                }
            }
        },
        /**
         * Returns the position associated with the Scrollview instance's current node
         *  (generally the node currently at the top).
         *
         * @method getPosition
         * @return {number} The Scrollview's total pixels translated.
         */
        getPosition : function(){
            return this.getOffset() - this._totalShift;
        },
        setPosition : function(position, transition, callback){
            if (this._position.isActive()) this._position.halt();
            this._position.set(position, transition, callback);
        },
        /**
         * Returns the offset associated with the Scrollview instance's current node
         *  (generally the node currently at the top).
         *
         * @method getOffset
         * @param {number} [node] If specified, returns the position of the node at that index in the
         * Scrollview instance's currently managed collection.
         * @return {number} The position of either the specified node, or the Scrollview's current Node,
         * in pixels translated.
         */
        getOffset : function(){
            return this._offset.get();
        },
        /**
         * Sets the offset of the physics particle that controls Scrollview instance's "position"
         *
         * @method setOffset
         * @param {number} offset The amount of pixels you want your scrollview to progress by.
         */
        setOffset : function(offset){
            this._offset.set(offset);
        },
        getProgress : function getProgress() {
            var length = _nodeSizeForDirection.call(this, this._node);
            if (!length) return 0;
            var offset = this.getOffset();
            return offset / length;
        },
        /**
         * Returns the Scrollview instance's velocity.
         *
         * @method getVelocity
         * @return {Number} The velocity.
         */
        getVelocity : function(){
            return this._particle.getVelocity1D();
        },
        /**
         * Sets the Scrollview instance's velocity. Until affected by input or another call of setVelocity
         *  the Scrollview instance will scroll at the passed-in velocity.
         *
         * @method setVelocity
         * @param {number} velocity The magnitude of the velocity.
         */
        setVelocity : function(velocity){
            var velocity = _cap(velocity, this.options.speedLimit);
            this._particle.setVelocity1D(velocity);
        },
        outputFrom : function(){
            return Scroller.prototype.outputFrom.apply(this._scroller, arguments);
        },
        /**
         * Sets the collection of renderables under the Scrollview instance's control, by
         *  setting its current node to the passed in ViewSequence. If you
         *  pass in an array, the Scrollview instance will set its node as a ViewSequence instantiated with
         *  the passed-in array.
         *
         * @method sequenceFrom
         * @param {Array|ViewSequence} node Either an array of renderables or a Famous viewSequence.
         */
        sequenceFrom : function sequenceFrom(node) {
            if (node instanceof Array) node = new ViewSequence({array: node, trackSize: true});
            this._node = node;
            return this._scroller.sequenceFrom(node);
        }
    }, CONSTANTS);

    /**
     * Patches the Scrollview instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the Scrollview instance.
     */
    function _updateOptions(options){
        var key = options.key;
        var value = options.value;
        switch (key){
            case 'direction':
                this.options.direction = (value === 'x' || value === CONSTANTS.DIRECTION.X)
                    ? CONSTANTS.DIRECTION.X
                    : CONSTANTS.DIRECTION.Y;
                this.sync.setOptions({direction: this.options.direction});
                break;
            case 'groupScroll':
                (value)
                    ? this.subscribe(this._scroller)
                    : this.unsubscribe(this._scroller);
                break;
            case 'drag':
                this.drag.setOptions({strength: value});
                break;
            case 'friction':
                this.friction.setOptions({strength: value});
                break;
            case 'edgePeriod':
                this.spring.setOptions({period: value});
                break;
            case 'edgeDamp':
                this.spring.setOptions({dampingRatio: value});
                break;
            case 'rails':
            case 'scale':
            case 'rails':
            case 'preventDefault':
                this.sync.setOptions({
                    rails: this.options.rails,
                    direction: this.options.direction,
                    scale: -this.options.syncScale,
                    preventDefault: this.options.preventDefault
                });
                break;
        }

        this._scroller.setOptions(options);
    }

    function _cap(value, limit){
        if (value > limit) return limit;
        else if (value < -limit) return -limit;
        else return value;
    }

    function _updatePayload(){
        this._payload.index = this.getCurrentIndex();
        this._payload.position = this.getCurrentIndex();
        this._payload.offset = this.getOffset();
        this._payload.progress = this.getProgress();
    }

    function _handleStart(event){
        _updatePayload.call(this);
        this.emit('start', this._payload);
    }

    function _handleUpdate(event){
        if (this._springState === SpringStates.NONE && this._edgeState === EdgeStates.NONE)
            _normalizeCurrentIndex.call(this);
        _updatePayload.call(this);
        this.emit('update', this._payload);
    }

    function _handleEnd(event){
        _updatePayload.call(this);
        this.emit('end', this._payload);
    }

    function _handleOffsetUpdate(event){
        _handleUpdate.call(this);
    }

    function _handleSyncStart(event) {
        this._particle.sleep();

        if (this._position.isActive()) this._position.halt();

        if (this._removedSync && this._endFired){
            this._offset.addSource(this.sync);
            this._removedSync = false;
        }

        this._endFired = false;
        this._earlyEnd = false;
        this._touchCount = event.count || 1;

        _handleStart.call(this, event);
    }

    function _handleSyncUpdate(event) {
        var velocity = event.velocity;
        _handleUpdate.call(this, event);

        // if touching, return
        if (event.count) return;

        // reactivate sync if move in opposite direction from edge
        var callStart = this._removedSync &&
            (this._edgeState == EdgeStates.TOP && velocity > 0) ||
            (this._edgeState == EdgeStates.BOTTOM && velocity < 0);

        if (callStart){
            this._endFired = true;
            _handleSyncStart.call(this, event);
        }
        else {
            var callEnd = !this._earlyEnd &&
                this._edgeState === EdgeStates.TOP    && velocity < 0 ||
                this._edgeState === EdgeStates.BOTTOM && velocity > 0;

            // if past the end, call end prematurely
            if (callEnd){
                event.velocity *= this.options.edgeGrip;
                this._offset.removeSource(this.sync);
                this._earlyEnd = true;
                this._removedSync = true;
                _handleSyncEnd.call(this, event);
            }
        }
    }

    //TODO: fix particle wake. Necessary on early end when physics is sleeping
    function _handleSyncEnd(event) {
        this._endFired = true;
        this._touchCount = event.count;
        if (!this._touchCount) {
            if (this._touchCount == 0 && this._edgeState !== EdgeStates.NONE){
                _handleEdge.call(this, this._edgeState);
            }
            else if (this.options.paginated)
                _handlePagination.call(this);
            else if (!event.scroll){
                _detachSpring.call(this);
                _attachDrag.call(this);
            }
            else _handleEnd.call(this, event);

            if (!event.scroll){
                this.setVelocity(-event.velocity);
            }
        }
    }

    function _handlePhysicsStart(particle){
        if (this._position.isActive()) this._position.halt();
        particle.setPosition1D(this.getOffset());
    }

    function _handlePhysicsUpdate(){
    }

    function _handlePhysicsEnd(){
        _detachAgents.call(this);
        _handleEnd.call(this);
    }


    function _attachDrag(){
        if (this.dragID === undefined)
            this.dragID = this._physicsEngine.attach(this.drag, this._particle);
        if (this.frictionID == undefined)
            this.frictionID = this._physicsEngine.attach(this.friction, this._particle);
    }

    function _attachSpring(){
        if (this.springID === undefined)
            this.springID = this._physicsEngine.attach(this.spring, this._particle);
    }

    function _detachDrag(){
        if (this.dragID !== undefined) {
            this._physicsEngine.detach(this.dragID);
            this.dragID = undefined;
        }
        if (this.frictionID !== undefined) {
            this._physicsEngine.detach(this.frictionID);
            this.frictionID = undefined;
        }
    }

    function _detachSpring(){
        if (this.springID !== undefined) {
            this._physicsEngine.detach(this.springID);
            this.springID = undefined;
        }
        this._springState = SpringStates.NONE;
    }

    function _detachAgents() {
        _detachDrag.call(this);
        _detachSpring.call(this);
    }

    function _nodeSizeForDirection(node) {
        var direction = this.options.direction;
        var size = node.getSize();
        return (size) ? size[direction] : null;
    }

    // TODO: fix for overshoot and position is size of node
    function _handleEdge(edge) {
        this.sync.setOptions({scale: -this.options.edgeGrip});
        this._edgeState = edge;
        _detachDrag.call(this);
        _setSpring.call(this, this._edgeSpringPosition, SpringStates.EDGE);
        _attachSpring.call(this);
    }

    function _handlePagination() {
        if (this._touchCount) return;
        if (this._springState === SpringStates.EDGE) return;

        var velocity = this.getVelocity();
        if (Math.abs(velocity) >= this.options.pageStopSpeed) return;

        var position = this.getOffset();
        var velocitySwitch = Math.abs(velocity) > this.options.pageSwitchSpeed;

        // parameters to determine when to switch pages
        var nodeSize = _nodeSizeForDirection.call(this, this._node);

        var positionNext = position > 0.5 * nodeSize;
        var velocityNext = velocity > 0;

        (positionNext && !velocitySwitch) || (velocitySwitch && velocityNext)
            ? this.goToNextPage()
            : this.goToPreviousPage();
    }

    function _setSpring(position, springState) {
        var springOptions;
        switch (springState){
            case SpringStates.EDGE:
                this._edgeSpringPosition = position;
                springOptions = {
                    anchor: [this._edgeSpringPosition, 0, 0],
                    period: this.options.edgePeriod,
                    dampingRatio: this.options.edgeDamp
                };
                break;
            case SpringStates.PAGE:
                this._pageSpringPosition = position;
                springOptions = {
                    anchor: [this._pageSpringPosition, 0, 0],
                    period: this.options.pagePeriod,
                    dampingRatio: this.options.pageDamp
                };
                break;
        }

        this.spring.setOptions(springOptions);
        this._springState = springState;
    }

    function _normalizeCurrentIndex() {
        var previousOffset = this.getOffset();
        var offset = previousOffset; // position of first partially visible node
        var currNode = this._node;
        var nodeSize = _nodeSizeForDirection.call(this, this._node);

        // if you can fit more nodes within the current offset
        // increment the current node and shift the offset by its size
        while (nodeSize < offset) {
            if (currNode.getNext()) currNode = currNode.getNext();
            else break;
            offset -= nodeSize;
            nodeSize = _nodeSizeForDirection.call(this, currNode);
        }

        // if you can fit more nodes behind the zero point, decrement
        while (offset < 0) {
            if (currNode.getPrevious()) currNode = currNode.getPrevious();
            else break;
            offset += nodeSize;
            nodeSize = _nodeSizeForDirection.call(this, currNode);
        }

        _shiftOrigin.call(this, offset - previousOffset);

        this._node = currNode;
        this._scroller.sequenceFrom(currNode);
    }

    function _shiftOrigin(amount){
        this.setOffset(this.getOffset() + amount);
        this._totalShift += amount;
    }
});
