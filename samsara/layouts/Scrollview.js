/* Copyright © 2015-2016 David Valdman */

// This code is still in beta. Documentation forthcoming.

define(function (require, exports, module) {
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    var View = require('../core/View');
    var Stream = require('../streams/Stream');
    var Accumulator = require('../streams/Accumulator');
    var Differential = require('../streams/Differential');

    var SequentialLayout = require('./SequentialLayout');
    var ContainerSurface = require('../dom/ContainerSurface');

    var GenericInput = require('../inputs/GenericInput');
    var ScrollInput = require('../inputs/ScrollInput');
    var TouchInput = require('../inputs/TouchInput');
    var MouseInput = require('../inputs/MouseInput');

    GenericInput.register({
        touch: TouchInput,
        scroll: ScrollInput,
        mouse: MouseInput
    });

    var CONSTANTS = {
        DIRECTION: {
            X: 0,
            Y: 1
        }
    };

    var EDGE = {
        TOP: -1,
        BOTTOM : 1,
        NONE: 0
    };

    var Scrollview = View.extend({
        defaults: {
            direction: CONSTANTS.DIRECTION.Y,
            drag: 0.3,
            paginated: false,
            pageChangeSpeed: 0.5,
            startPosition: 0,
            marginTop: 0,
            marginBottom: 0,
            clip: true,
            enableMouseDrag: false,
            pageTransition: {
                curve : 'spring',
                period : 100,
                damping : 0.8
            },
            edgeTransition: {
                curve: 'spring',
                period: 100,
                damping: 1
            },
            edgeGrip: 0.5
        },
        initialize: function (options) {
            this._currentIndex = 0;
            this._previousIndex = 0;
            this.itemOffset = 0;
            this.items = [];
            this.velocity = 0;

            var edgeOverflow = 0;
            var isTouching = false;
            var isMouseWheelActive = false;
            var edge = EDGE.NONE;

            this.layout = new SequentialLayout({
                direction: options.direction
            });

            var inputs = options.enableMouseDrag
                ? ['touch', 'scroll', 'mouse']
                : ['touch', 'scroll'];

            var genericInput = new GenericInput(inputs, {
                direction: options.direction
            });

            var position = new Accumulator(-options.startPosition);

            this.drag = new Transitionable(0);
            this.spring = new Transitionable(0);

            var dragDifferential = new Differential();
            var springDifferential = new Differential();
            var gestureDifferential = genericInput.pluck('delta');

            dragDifferential.subscribe(this.drag);
            springDifferential.subscribe(this.spring);

            position.subscribe(gestureDifferential);
            position.subscribe(dragDifferential);
            position.subscribe(springDifferential);

            var scrollInput = genericInput.getInput('scroll');
            scrollInput.on('start', function(){
                isMouseWheelActive = true;
            });

            scrollInput.on('end', function(){
                isMouseWheelActive = false;
            });

            genericInput.on('start', function () {
                isTouching = true;
                this.drag.halt();
                this.spring.halt();
            }.bind(this));

            genericInput.on('update', function (data) {
                this.velocity = data.velocity;
            }.bind(this));

            genericInput.on('end', function (data) {
                isTouching = false;

                switch (edge){
                    case EDGE.NONE:
                        (this.options.paginated)
                            ? handlePagination.call(this, data.velocity)
                            : handleDrag.call(this, data.velocity);
                        break;
                    case EDGE.TOP:
                        handleEdge.call(this, edgeOverflow, data.velocity);
                        break;
                    case EDGE.BOTTOM:
                        handleEdge.call(this, edgeOverflow, data.velocity);
                        break;
                }
            }.bind(this));

            this.drag.on('update', function(){
                this.velocity = this.drag.getVelocity();
            }.bind(this));

            this.spring.on('update', function(){
                this.velocity = this.spring.getVelocity();
            }.bind(this));

            position.on('end', function () {
                if (!this.spring.isActive())
                    changePage.call(this, this._currentIndex);
            }.bind(this));

            this.position = position;

            // overflow is a measure of how much of the content
            // extends past the viewport
            var viewportOverflow = Stream.lift(function (contentLength, viewportSize) {
                if (!contentLength) return false;
                var overflow = viewportSize[options.direction] - options.marginBottom - contentLength;
                return (overflow >= 0) ? false : overflow;
            }, [this.layout, this.size]);

            // responsible for setting edgeGrip
            var setEdgeGrip = Stream.lift(function (top, overflow) {
                if (!overflow) return false;

                if (top > 0) { // reached top of scrollview
                    edgeOverflow = top;
                    if (edge !== EDGE.TOP){
                        genericInput.setOptions({scale: this.options.edgeGrip});
                        edge = EDGE.TOP;
                        if (!isTouching) handleEdge.call(this, overflow, this.velocity);
                    }
                }
                else if(top < overflow) { // reached bottom of scrollview
                    edgeOverflow = top - overflow;
                    if (edge !== EDGE.BOTTOM){
                        genericInput.setOptions({scale: this.options.edgeGrip});
                        edge = EDGE.BOTTOM;
                        if (!isTouching) handleEdge.call(this, overflow, this.velocity);
                    }
                }
                else if(top > overflow && top < 0 && edge !== EDGE.NONE){
                    edgeOverflow = 0;
                    genericInput.setOptions({scale : 1});
                    edge = EDGE.NONE;
                }
            }.bind(this), [position, viewportOverflow]);

            setEdgeGrip.on('start', function(){});
            setEdgeGrip.on('update', function(){});
            setEdgeGrip.on('end', function(){});

            var transform = this.position.map(function (position) {
                position += options.marginTop;
                return options.direction === CONSTANTS.DIRECTION.Y
                    ? Transform.translateY(position)
                    : Transform.translateX(position);
            });

            this.container = new ContainerSurface({
                properties: {overflow : 'hidden'}
            });

            genericInput.subscribe(this.container);

            this.container.add({transform : transform}).add(this.layout);
            this.add(this.container);
        },
        setPerspective: function(){
            ContainerSurface.prototype.setPerspective.apply(this.container, arguments);
        },
        getVelocity: function(){
            return this.velocity;
        },
        goTo: function (index, transition, callback) {
            transition = transition || this.options.pageTransition;
            var position = this.itemOffset;
            var i;

            if (index > this._currentIndex && index < this.items.length) {
                for (i = this._currentIndex; i < index; i++)
                    position -= this.items[i].getSize()[this.options.direction];
            }
            else if (index < this._currentIndex && index >= 0) {
                for (i = this._currentIndex; i > index; i--)
                    position += this.items[i].getSize()[this.options.direction];
            }

            this.spring.halt();
            this.spring.reset(0);
            this.spring.set(Math.ceil(position), transition, callback);
        },
        getCurrentIndex: function(){
            return this._currentIndex;
        },
        push: function(item) {
            this.layout.push(item);
        },
        addItems: function (items) {
            for (var i = 0; i < items.length; i++) 
                this.push(items[i]);
            
            this.items = items;

            var args = [this.position];
            for (i = 0; i < items.length; i++) {
                args.push(items[i].size);
            }

            var accumLength = 0;
            var itemOffsetStream = Stream.lift(function () {
                if (arguments[0] === undefined || arguments[1] === undefined)
                    return false;

                var offset = arguments[0];
                var direction = this.options.direction;
                var index = this._currentIndex;
                var currentSize = arguments[index + 1];

                if (!currentSize) return false;

                var progress = 0;
                var itemOffset = -offset - accumLength;
                var currentLength = currentSize[direction];

                if (itemOffset > currentLength && this._currentIndex !== items.length - 1) {
                    // pass currentNode forwards
                    this._currentIndex++;
                    progress = 0;
                    accumLength += currentLength;
                }
                else if (itemOffset < 0 && this._currentIndex !== 0) {
                    // pass currentNode backwards
                    this._currentIndex--;
                    progress = 1;
                    currentLength = arguments[this._currentIndex + 1][direction];
                    accumLength -= currentLength;
                }
                else {
                    progress = itemOffset / currentLength;
                }

                this.itemOffset = itemOffset;

                return {
                    index: this._currentIndex,
                    progress: progress
                };
            }.bind(this), args);

            this.output.subscribe(itemOffsetStream);

            itemOffsetStream.on('start', function () {});
            itemOffsetStream.on('update', function () {});
            itemOffsetStream.on('end', function () {});
        }
    }, CONSTANTS);

    function changePage(index) {
        if (index === this._previousIndex) return;
        this.emit('page', index);
        this._previousIndex = index;
    }

    function handleEdge(overflow, velocity){
        this.drag.halt();
        this.spring.reset(overflow);
        this.options.edgeTransition.velocity = velocity;
        this.spring.set(0, this.options.edgeTransition);
    }

    function handlePagination(velocity){
        var pageChangeSpeed = this.options.pageChangeSpeed;
        var currentLength = this.items[this._currentIndex].getSize()[this.options.direction];

        var backLength = this.itemOffset;
        var forwardLength = this.itemOffset - currentLength;

        var position = this.itemOffset;
        var positionThreshold = currentLength / 2;

        var target;
        if (velocity < 0){
            // moving forward
            target = (position > positionThreshold || velocity < -pageChangeSpeed)
                ? forwardLength
                : backLength;
        }
        else {
            // moving backward
            target = (position < positionThreshold || velocity > pageChangeSpeed)
                ? backLength
                : forwardLength;
        }

        this.options.pageTransition.velocity = velocity;
        this.spring.halt();
        this.spring.reset(-target);
        this.spring.set(0, this.options.pageTransition);
    }

    function handleDrag(velocity){
        this.drag.halt();
        this.drag.reset(0);
        this.drag.set(0, {
            curve: 'inertia',
            velocity: velocity,
            drag: this.options.drag
        });
    }

    module.exports = Scrollview;
});
