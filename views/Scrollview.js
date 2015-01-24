/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var PhysicsEngine = require('../physics/PhysicsEngine');
    var Particle = require('../physics/bodies/Particle');
    var Drag = require('../physics/forces/Drag');
    var Spring = require('../physics/constraints/Snap');

    var EventHandler = require('../core/EventHandler');
    var OptionsManager = require('../core/OptionsManager');
    var ViewSequence = require('../core/ViewSequence');
    var Scroller = require('../views/Scroller');

    var Transitionable = require('../core/Transitionable');
    var Accumulator = require('../inputs/Accumulator');

    var GenericSync = require('../inputs/GenericSync');
    var ScrollSync = require('../inputs/ScrollSync');
    var TouchSync = require('../inputs/TouchSync');
    GenericSync.register({scroll : ScrollSync, touch : TouchSync});

    /** @const */
    var TOLERANCE = 0.5;

    /** @enum */
    var SpringStates = {
        NONE: 0,
        EDGE: 1,
        PAGE: 2
    };

    /** @enum */
    var EdgeStates = {
        TOP:   -1,
        NONE:   0,
        BOTTOM: 1
    };

    /**
     * Scrollview will lay out a collection of renderables sequentially in the specified direction, and will
     * allow you to scroll through them with mousewheel or touch events.
     * @class Scrollview
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=Utility.Direction.Y] Using the direction helper found in the famous Utility
     * module, this option will lay out the Scrollview instance's renderables either horizontally
     * (x) or vertically (y). Utility's direction is essentially either zero (X) or one (Y), so feel free
     * to just use integers as well.
     * @param {Boolean} [options.rails=true] When true, Scrollview's genericSync will only process input in it's primary access.
     * @param {Number} [clipSize=undefined] The size of the area (in pixels) that Scrollview will display content in.
     * @param {Number} [margin=undefined] The size of the area (in pixels) that Scrollview will process renderables' associated calculations in.
     * @param {Number} [friction=0.001] Input resistance proportional to the velocity of the input.
     * Controls the feel of the Scrollview instance at low velocities.
     * @param {Number} [drag=0.0001] Input resistance proportional to the square of the velocity of the input.
     * Affects Scrollview instance more prominently at high velocities.
     * @param {Number} [edgeGrip=0.5] A coefficient for resistance against after-touch momentum.
     * @param {Number} [egePeriod=300] Sets the period on the spring that handles the physics associated
     * with hitting the end of a scrollview.
     * @param {Number} [edgeDamp=1] Sets the damping on the spring that handles the physics associated
     * with hitting the end of a scrollview.
     * @param {Boolean} [paginated=false] A paginated scrollview will scroll through items discretely
     * rather than continously.
     * @param {Number} [pagePeriod=500] Sets the period on the spring that handles the physics associated
     * with pagination.
     * @param {Number} [pageDamp=0.8] Sets the damping on the spring that handles the physics associated
     * with pagination.
     * @param {Number} [pageStopSpeed=Infinity] The threshold for determining the amount of velocity
     * required to trigger pagination. The lower the threshold, the easier it is to scroll continuosly.
     * @param {Number} [pageSwitchSpeed=1] The threshold for momentum-based velocity pagination.
     * @param {Number} [speedLimit=10] The highest scrolling speed you can reach.
     */
    function Scrollview(options) {
        // patch options with defaults
        this.options = Object.create(Scrollview.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        // create sub-components
        this._scroller = new Scroller(this.options);

        this.sync = new GenericSync(
            ['scroll', 'touch'],
            {
                direction : this.options.direction,
                scale : -this.options.syncScale,
                rails: this.options.rails,
                preventDefault: this.options.preventDefault
            }
        );

        this._physicsEngine = new PhysicsEngine();
        this._particle = new Particle();
        this._physicsEngine.addBody(this._particle);

        this.spring = new Spring({
            anchor: [0, 0, 0],
            period: this.options.edgePeriod,
            dampingRatio: this.options.edgeDamp
        });
        this.drag = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC,
            strength: this.options.drag
        });
        this.friction = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.LINEAR,
            strength: this.options.friction
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
        this._cachedIndex = 0;
        this._dragging = false;

        this._offset = new Accumulator(0);
        this._position = new Transitionable(0);

        // subcomponent logic
        this._scroller.positionFrom(this.getOffset.bind(this));

        // eventing
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        _bindEvents.call(this);

        this._payload = {
            index: 0,
            position: 0,
            offset: 0,
            progress : 0
        };

        // override default options with passed-in custom options
        if (options) this.setOptions(options);
    }

    Scrollview.Direction = {
        X : 0,
        Y : 1
    };

    Scrollview.DEFAULT_OPTIONS = {
        direction: Scrollview.Direction.Y,
        rails: true,
        friction: 0.005,
        drag: 0.0001,
        edgeGrip: 0.3,
        edgePeriod: 300,
        edgeDamp: 1,
        margin: Math.max(1000, window.innerWidth, window.innerHeight),
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
    };

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
        this._eventOutput.emit('start', this._payload);
    }

    function _handleUpdate(event){
        _updatePayload.call(this);
        this._eventOutput.emit('update', this._payload);
    }

    function _handleEnd(event){
        _updatePayload.call(this);
        this._eventOutput.emit('end', this._payload);
    }

    function _handleOffsetUpdate(event){
        if (this._springState === SpringStates.NONE && this._edgeState === EdgeStates.NONE)
            _normalizeState.call(this);
        _handleUpdate.call(this);
    }

    function _handleSyncStart(event) {
        if (this._position.isActive()) this._position.halt();

        if (this._removedSync && this._endFired){
            this._offset.addSource(this.sync);
            this._removedSync = false;
        }

        this._endFired = false;
        this._earlyEnd = false;
        this._dragging = !event.scroll;
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
                this._edgeState === EdgeStates.TOP && velocity < 0 ||
                this._edgeState === EdgeStates.BOTTOM && velocity > 0;

            // if past the end, call end prematurely
            if (callEnd){
                event.velocity *= this.options.edgeGrip;
                this._offset.removeSource(this.sync);
//                this._particle.set(this.getOffset());
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
            this._dragging = false;

            if (this._touchCount == 0 && this._edgeState !== EdgeStates.NONE){
                this._particle.set(this.getOffset());
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
        particle.set(this.getOffset());
        this._dragging = false;
    }

    function _handlePhysicsEnd(){
        _detachAgents.call(this);
        _handleEnd.call(this);
    }

    function _bindEvents() {
        this._scroller.on('onEdge', function(data) {
            this.sync.setOptions({scale: this.options.edgeGrip});
            this._edgeSpringPosition = data.position;
            _handleEdge.call(this, data.edge);
            this._eventOutput.emit('onEdge');
        }.bind(this));

        this._scroller.on('offEdge', function() {
            this.sync.setOptions({scale: -this.options.syncScale});
            this._edgeState = this._scroller.onEdge();
            this._eventOutput.emit('offEdge');
        }.bind(this));

        this.sync.on('start', _handleSyncStart.bind(this));
        this.sync.on('update', _handleSyncUpdate.bind(this));
        this.sync.on('end', _handleSyncEnd.bind(this));

        this._particle.on('start', _handlePhysicsStart.bind(this));
        this._particle.on('end', _handlePhysicsEnd.bind(this));

        this._offset.on('update', _handleOffsetUpdate.bind(this));

        this._position.on('start', _handleStart.bind(this));
        this._position.on('end', _handleEnd.bind(this));

        // touch input goes to the sync
        this._eventInput.pipe(this.sync);

        // sync, particle and transitionable accumulate in offset
        this._offset.addSource(this._position);
        this._offset.addSource(this._particle);
        this._offset.addSource(this.sync);

        // create universal update event
        this._offset.pipe(this);
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
            this._springState = SpringStates.NONE;
            this.springID = undefined;
        }
    }

    function _detachAgents() {
        _detachDrag.call(this);
        _detachSpring.call(this);
    }

    function _nodeSizeForDirection(node) {
        var direction = this.options.direction;
        var size = node.getSize() || this.getSize();
        return size[direction];
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

    function _normalizeState() {
        var offset = 0; // discrete node distance
        var position = this.getOffset(); // position of first partially visible node

        var nodeSize = _nodeSizeForDirection.call(this, this._node);
        if (!nodeSize) return;

        var nextNode = this._node.getNext();

        while (offset + position >= nodeSize && nextNode) {
            offset -= nodeSize;
            this._scroller.sequenceFrom(nextNode);
            this._node = nextNode;
            nextNode = this._node.getNext();
            nodeSize = _nodeSizeForDirection.call(this, this._node);
        }

        var previousNode = this._node.getPrevious();
        var previousNodeSize;

        while (offset + position <= 0 && previousNode) {
            previousNodeSize = _nodeSizeForDirection.call(this, previousNode);
            this._scroller.sequenceFrom(previousNode);
            this._node = previousNode;
            offset += previousNodeSize;
            previousNode = this._node.getPrevious();
        }


        if (offset) _shiftOrigin.call(this, offset);

        var tolerance = (this._dragging)
            ? 1
            : 0.5;

        // when dragging, pageChange called when physics takes over
        // dragging while touchStart and physics not enabled
        // because scroll is still like dragging
        if (this._node) {
            if (!this._dragging && this._node.index !== this._cachedIndex) {
                // backwards
                if (this._dragging) return;
                if (this.getOffset() < tolerance * nodeSize) {
                    this._cachedIndex = this._node.index;
                    this._eventOutput.emit('pageChange', {direction: -1, index: this._cachedIndex});
                }
            } else {
                // forwards
                if (this.getOffset() > tolerance * nodeSize) {
                    this._cachedIndex = this._node.index + 1;
                    this._eventOutput.emit('pageChange', {direction: 1, index: this._cachedIndex});
                }
            }
        }
    }

    function _shiftOrigin(amount) {
        var newOffset = this.getOffset() + amount;
        this.setOffset(newOffset);
        this._particle.set(newOffset);
        this._totalShift += amount;
    }

    /**
     * Returns the index of the first visible renderable
     *
     * @method getCurrentIndex
     * @return {Number} The current index of the ViewSequence
     */
    Scrollview.prototype.getCurrentIndex = function getCurrentIndex() {
        return this._node.index;
    };

    /**
     * goToPreviousPage paginates your Scrollview instance backwards by one item.
     *
     * @method goToPreviousPage
     * @return {ViewSequence} The previous node.
     */
    Scrollview.prototype.goToPreviousPage = function goToPreviousPage() {
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
            return;
        }
    };

    /**
     * goToNextPage paginates your Scrollview instance forwards by one item.
     *
     * @method goToNextPage
     * @return {ViewSequence} The next node.
     */
    Scrollview.prototype.goToNextPage = function goToNextPage() {
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
        }
    };

    /**
     * Paginates the Scrollview to an absolute page index.
     *
     * @method goToPage
     */
    Scrollview.prototype.goToPage = function goToPage(index) {
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
    };

    /**
     * Returns the position associated with the Scrollview instance's current node
     *  (generally the node currently at the top).
     *
     * @method getPosition
     * @return {number} The Scrollview's total pixels translated.
     */
    Scrollview.prototype.getPosition = function getPosition() {
        return this.getOffset() - this._totalShift;
    };

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
    Scrollview.prototype.getOffset = function(){
        return this._offset.get();
    };

    /**
     * Sets the offset of the physics particle that controls Scrollview instance's "position"
     *
     * @method setOffset
     * @param {number} x The amount of pixels you want your scrollview to progress by.
     */
    Scrollview.prototype.setOffset = function setOffset(x) {
        this._offset.set(x);
    };

    /**
     * Returns the Scrollview instance's velocity.
     *
     * @method getVelocity
     * @return {Number} The velocity.
     */

    Scrollview.prototype.getVelocity = function getVelocity() {
        return this._particle.getVelocity1D();
    };

    /**
     * Sets the Scrollview instance's velocity. Until affected by input or another call of setVelocity
     *  the Scrollview instance will scroll at the passed-in velocity.
     *
     * @method setVelocity
     * @param {number} v The magnitude of the velocity.
     */
    Scrollview.prototype.setVelocity = function setVelocity(velocity) {
        var velocity = _cap(velocity, this.options.speedLimit);
        this._particle.setVelocity1D(velocity);
    };

    /**
     * Patches the Scrollview instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the Scrollview instance.
     */
    Scrollview.prototype.setOptions = function setOptions(options) {
        // preprocess custom options
        if (options.direction !== undefined) {
            if (options.direction === 'x') options.direction = Scrollview.Direction.X;
            else if (options.direction === 'y') options.direction = Scrollview.Direction.Y;
        }

        if (options.groupScroll !== this.options.groupScroll) {
            (options.groupScroll)
                ? this.subscribe(this._scroller)
                : this.unsubscribe(this._scroller);
        }

        // patch custom options
        this._optionsManager.setOptions(options);

        // propagate options to sub-components

        // scroller sub-component
        this._scroller.setOptions(options);

        // physics sub-components
        if (options.drag !== undefined) this.drag.setOptions({strength: this.options.drag});
        if (options.friction !== undefined) this.friction.setOptions({strength: this.options.friction});
        if (options.edgePeriod !== undefined || options.edgeDamp !== undefined) {
            this.spring.setOptions({
                period: this.options.edgePeriod,
                dampingRatio: this.options.edgeDamp
            });
        }

        // sync sub-component
        if (options.rails || options.direction !== undefined || options.syncScale !== undefined || options.preventDefault) {
            this.sync.setOptions({
                rails: this.options.rails,
                direction: this.options.direction,
                scale: -this.options.syncScale,
                preventDefault: this.options.preventDefault
            });
        }
    };

    /**
     * Sets the collection of renderables under the Scrollview instance's control, by
     *  setting its current node to the passed in ViewSequence. If you
     *  pass in an array, the Scrollview instance will set its node as a ViewSequence instantiated with
     *  the passed-in array.
     *
     * @method sequenceFrom
     * @param {Array|ViewSequence} node Either an array of renderables or a Famous viewSequence.
     */
    Scrollview.prototype.sequenceFrom = function sequenceFrom(node) {
        if (node instanceof Array) node = new ViewSequence({array: node, trackSize: true});
        this._node = node;
        return this._scroller.sequenceFrom(node);
    };

    Scrollview.prototype.setPosition = function(position, transition, callback){
        if (this._position.isActive()) this._position.halt();
        this._position.set(position, transition, callback);
    };

    Scrollview.prototype.outputFrom = function outputFrom() {
        return Scroller.prototype.outputFrom.apply(this._scroller, arguments);
    };

    Scrollview.prototype.getProgress = function getProgress() {
        var length = _nodeSizeForDirection.call(this, this._node);
        if (!length) return 0;
        var offset = this.getOffset();
        return offset / length;
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    Scrollview.prototype.render = function render() {
        return Scroller.prototype.render.apply(this._scroller, arguments);
    };

    module.exports = Scrollview;
});
