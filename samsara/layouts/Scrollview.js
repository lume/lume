// /* Copyright © 2015-2016 David Valdman */

// This code is still in beta. Documentation forthcoming.

define(function (require, exports, module) {
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    var View = require('../core/View');
    var Stream = require('../streams/Stream');
    var SimpleStream = require('../streams/SimpleStream');
    var Accumulator = require('../streams/Accumulator');
    var Differential = require('../streams/Differential');
    var preTickQueue = require('../core/queues/preTickQueue');
    var nextTick = require('../core/queues/nextTick');

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
            drag: 0.25,
            paginated: false,
            pageChangeSpeed: 0.5,
            startPosition: 0,
            endPosition: false,
            spacing: 0,
            clip: true,
            enableMouseDrag: false,
            pageTransition: {
                curve : 'spring',
                period : 100,
                damping : 0.8
            },
            edgeTransition: {
                curve: 'spring',
                period: 70,
                damping: 1
            },
            edgeGrip: 0.25,
            container: {properties : {}}
        },
        initialize: function (options) {
            this._currentIndex = 0;
            this._previousIndex = 0;
            this.velocity = 0;
            this.isPaused = false;

            var isTouching = false;
            var isMouseWheelActive = false;
            var edge = EDGE.NONE;

            var inputs = options.enableMouseDrag
                ? ['touch', 'scroll', 'mouse']
                : ['touch', 'scroll'];

            this.input = new GenericInput(inputs, {
                direction: options.direction,
                limit: 1
            });

            this.position = new Accumulator(options.startPosition);
            this.drag = new Transitionable(0);
            this.spring = new Transitionable(0);

            var dragDifferential = new Differential();
            var springDifferential = new Differential();
            var inputDifferential = this.input.pluck('delta');

            dragDifferential.subscribe(this.drag);
            springDifferential.subscribe(this.spring);

            this.position.subscribe(inputDifferential);
            this.position.subscribe(dragDifferential);
            this.position.subscribe(springDifferential);

            var scrollInput = this.input.getInput('scroll');

            scrollInput.on('start', function(){
                isMouseWheelActive = true;
            });

            scrollInput.on('end', function(){
                isMouseWheelActive = false;
            });

            this.input.on('start', function () {
                isTouching = true;
                this.spring.halt();
                this.drag.halt();
            }.bind(this));

            this.input.on('end', function (data) {
                isTouching = false;
                if (this.position._isPaused) return false;

                nextTick.push(function(){
                    switch (edge) {
                        case EDGE.NONE:
                            (this.options.paginated)
                                ? handlePagination.call(this, this.pageOverflow, data.velocity)
                                : handleDrag.call(this, data.velocity);
                            break;
                        case EDGE.TOP:
                            handleEdge.call(this, this.edgeOverflow, data.velocity);
                            break;
                        case EDGE.BOTTOM:
                            handleEdge.call(this, this.edgeOverflow, data.velocity);
                            break;
                    }
                }.bind(this));
            }.bind(this));

            this.layout = new SequentialLayout({
                direction : options.direction,
                offset: this.position,
                spacing: options.spacing
            });

            // overflow is a measure of how much of the content
            // extends past the viewport
            // responsible for setting edgeGrip
            this.edgeOverflow = 0;
            this.pageOverflow = 0;
            var handledEdge = false;
            var overflow = Stream.lift(function (size, viewportSize, offset, endPosition) {
                if (!size || !viewportSize) return false;

                var overflowPrev = size[0]
                // var overflowNext = size[1] - viewportSize[options.direction];
                // console.log(size[0], size[1])
                var overflowNext = size[1] - (endPosition || viewportSize[options.direction]);

                // contents smaller than the viewport
                if (overflowNext - overflowPrev < 0) {
                    if (overflowPrev < 0){
                        this.edgeOverflow = overflowPrev;
                        if (edge !== EDGE.TOP){
                            edge = EDGE.TOP;
                            this.input.setOptions({scale : options.edgeGrip});
                            if (!isTouching) {
                                handleEdge.call(this, this.edgeOverflow, this.velocity);
                                handledEdge = true;
                            }
                        }
                    }
                    else if (overflowNext > 0){
                        this.edgeOverflow = overflowNext;
                        if (edge !== EDGE.BOTTOM){
                            edge = EDGE.BOTTOM;
                            this.input.setOptions({scale : options.edgeGrip});
                            if (!isTouching) {
                                handleEdge.call(this, this.edgeOverflow, this.velocity);
                                handledEdge = true;
                            }
                        }
                    }
                    else if (edge !== EDGE.NONE){
                        this.input.setOptions({scale : 1});
                        edge = EDGE.NONE;
                    }

                    return false;
                }

                // contents larger than the viewport
                if (overflowPrev > 0){
                    // reached top of scrollview
                    this.edgeOverflow = overflowPrev;
                    if (edge !== EDGE.TOP){
                        console.log('top')
                        edge = EDGE.TOP;

                        this.input.setOptions({scale : options.edgeGrip});
                        if (!isTouching) handleEdge.call(this, this.edgeOverflow, this.velocity);
                    }
                }
                else if (overflowNext < 0){
                    // reached bottom of scrollview
                    this.edgeOverflow = overflowNext;
                    if (edge !== EDGE.BOTTOM){
                        console.log('bottom')
                        edge = EDGE.BOTTOM;

                        this.input.setOptions({scale : options.edgeGrip});
                        if (!isTouching) handleEdge.call(this, this.edgeOverflow, this.velocity);
                    }
                }
                else if (edge !== EDGE.NONE){
                    console.log('middle')
                    this.input.setOptions({scale : 1});
                    edge = EDGE.NONE;
                }

                return edge;
            }.bind(this), [this.layout.bounds, this.size, this.position, this.options.endPosition]);

            // var prevPivotLength;
            this.layout.prevPivot.on(['set', 'start', 'update', 'end'], function(length){
                prevPivotLength = length;
            });

            // offset is positive and decreasing
            // pivotLength is negative and decreasing
            var pivot = Stream.lift(function(offset, pivotLength, prevPivotLength, edge){
                // console.log(offset, pivotLength, prevPivotLength);

                var itemLength = pivotLength - offset;
                if (-offset > itemLength/2){
                    this.pageOverflow = pivotLength;
                }
                else {
                    this.pageOverflow = offset;
                }

                if (offset > 0 && edge !== EDGE.TOP){
                    // previous
                    // debugger
                    console.log('prev')
                    this.layout.setPivot(-1);
                    this.position.set(prevPivotLength);
                    this._currentIndex--;
                    progress = 1;
                }
                else if (pivotLength < 0 && edge !== EDGE.BOTTOM){
                    // next
                    // debugger
                    console.log('next')
                    this.layout.setPivot(1);
                    this.position.set(pivotLength);
                    this._currentIndex++;
                    progress = 0;
                }
                else {
                    progress = offset / (offset - pivotLength);
                }

                return {
                    index : this._currentIndex,
                    progress : progress
                }
            }.bind(this), [this.position, this.layout.pivot, this.layout.prevPivot, overflow]);

            pivot.on(['set', 'start', 'update', 'end'], function(){});

            this.output.subscribe(pivot);

            if (options.clip) options.container.properties.overflow = 'hidden';
            this.container = new ContainerSurface(options.container);

            this.input.subscribe(this.container);

            this.container.add(this.layout);
            this.add(this.container);
        },
        setLengthMap : function(map, sources){
            this.layout.setLengthMap(map, sources);
        },
        setPerspective: function(){
            ContainerSurface.prototype.setPerspective.apply(this.container, arguments);
        },
        perspectiveFrom: function(){
            ContainerSurface.prototype.perspectiveFrom.apply(this.container, arguments);
        },
        setPerspectiveOrigin: function(){
            ContainerSurface.prototype.setPerspectiveOrigin.apply(this.container, arguments);
        },
        perspectiveOriginFrom: function(){
            ContainerSurface.prototype.perspectiveOriginFrom.apply(this.container, arguments);
        },
        push: function(item) {
            return this.layout.push(item);
        },
        unshift: function(item) {
            return this.layout.unshift(item);
        },
        pop: function (){
            return this.layout.pop();
        },
        shift : function(){
            return this.layout.shift();
        },
        pause : function(){
            this.input.unsubscribe(this.container);
        },
        resume : function(){
            this.input.subscribe(this.container);
        }
    }, CONSTANTS);

    function handleEdge(overflow, velocity){
        this.drag.halt();
        this.options.edgeTransition.velocity = velocity;

        this.spring.reset(0);
        this.spring.set(-overflow, this.options.edgeTransition);
    }

    function handlePagination(pageOverflow, velocity){
        this.drag.halt();
        this.options.pageTransition.velocity = velocity;

        this.spring.reset(pageOverflow);
        this.spring.set(0, this.options.pageTransition);
    }

    function handleDrag(velocity){
        this.drag.reset(0);
        this.drag.set(0, {
            curve : 'inertia',
            velocity : velocity,
            drag : this.options.drag
        });
    }

    module.exports = Scrollview;
});
