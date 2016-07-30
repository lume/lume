/* Copyright © 2015-2016 David Valdman */

// This code is still in beta. Documentation forthcoming.

define(function (require, exports, module) {
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    var View = require('../core/View');
    var Stream = require('../streams/Stream');
    var SimpleStream = require('../streams/SimpleStream');
    var Accumulator = require('../streams/Accumulator');
    var Differential = require('../streams/Differential');

    var SequentialLayout = require('./SequentialLayout');
    var ContainerSurface = require('../dom/ContainerSurface');

    var GenericInput = require('../inputs/GenericInput');
    var ScrollInput = require('../inputs/ScrollInput');
    var TouchInput = require('../inputs/TouchInput');
    var MouseInput = require('../inputs/MouseInput');

    var preTickQueue = require('../core/queues/preTickQueue');
    var dirtyQueue = require('../core/queues/dirtyQueue');

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
            this.velocity = 0;

            var isTouching = false;
            var isMouseWheelActive = false;
            var edge = EDGE.NONE;

            var inputs = options.enableMouseDrag
                ? ['touch', 'scroll', 'mouse']
                : ['touch', 'scroll'];

            var genericInput = new GenericInput(inputs, {
                direction: options.direction
            });

            this.position = new Accumulator(-options.startPosition);
            this.drag = new Transitionable(0);
            this.spring = new Transitionable(0);

            var dragDifferential = new Differential();
            var springDifferential = new Differential();
            var gestureDifferential = genericInput.pluck('delta');

            dragDifferential.subscribe(this.drag);
            springDifferential.subscribe(this.spring);

            this.position.subscribe(gestureDifferential);
            this.position.subscribe(dragDifferential);
            this.position.subscribe(springDifferential);

            var scrollInput = genericInput.getInput('scroll');
            scrollInput.on('start', function(){
                isMouseWheelActive = true;
            });

            scrollInput.on('end', function(){
                isMouseWheelActive = false;
            });

            this.spring.on('end', function(){
                edge = EDGE.NONE;
            });

            genericInput.on('start', function () {
                isTouching = true;
                this.spring.halt();
            }.bind(this));

            genericInput.on('end', function (data) {
                isTouching = false;

                // switch (edge) {
                //     case EDGE.NONE:
                //         (this.options.paginated)
                //             ? handlePagination.call(this, data.velocity)
                //             : handleDrag.call(this, data.velocity);
                //         break;
                //     case EDGE.TOP:
                //         handleEdge.call(this, this.edgeOverflow, data.velocity);
                //         break;
                //     case EDGE.BOTTOM:
                //         handleEdge.call(this, this.edgeOverflow, data.velocity);
                //         break;
                // }
            }.bind(this));

            this.layout = new SequentialLayout({
                direction : options.direction,
                offset: this.position
            });

            // overflow is a measure of how much of the content
            // extends past the viewport
            // responsible for setting edgeGrip
            this.edgeOverflow = 0;
            var overflow = Stream.lift(function (lengths, viewportSize, offset) {
                if (!lengths || !viewportSize) return false;
                if (lengths[1] === 0) return false;

                var overflowPrev = lengths[0] - options.marginTop;
                var overflowNext = lengths[1] - viewportSize[options.direction] + options.marginBottom;

                if (overflowPrev > 0){ // reached top of scrollview
                    this.edgeOverflow = overflowPrev;
                    if (edge !== EDGE.TOP){
                        genericInput.setOptions({scale : options.edgeGrip});
                        edge = EDGE.TOP;

                        if (this.drag.isActive())
                            handleEdge.call(this, this.edgeOverflow, this.velocity);
                    }
                }
                else if (overflowNext < 0){ // reached bottom of scrollview
                    this.edgeOverflow = overflowNext;
                    if (edge !== EDGE.BOTTOM){
                        genericInput.setOptions({scale : options.edgeGrip});
                        edge = EDGE.BOTTOM;

                        if (this.drag.isActive())
                            handleEdge.call(this, this.edgeOverflow, this.velocity);
                    }
                }
                else if (edge !== EDGE.NONE){
                    this.edgeOverflow = 0;
                    genericInput.setOptions({scale : 1});
                    edge = EDGE.NONE;
                }

                return edge;
            }.bind(this), [this.layout, this.size, this.position]);

            overflow.on('start', function(){});
            overflow.on('update', function(){});
            overflow.on('end', function(){});

            var pivot = Stream.lift(function(offset, pivotLength, edge){
                if (offset === undefined || !pivotLength) return false;

                if (-offset > pivotLength){
                    // next
                    progress = 1;
                    if (edge !== EDGE.BOTTOM) {
                        dirtyQueue.push(function(){
                            this.layout.setPivot(1);
                            this.position.set(pivotLength + offset);
                            this._currentIndex++;
                        }.bind(this));
                    }
                }
                else if (offset > 0){
                    // previous
                    progress = 0;
                    if (edge !== EDGE.TOP) {
                        dirtyQueue.push(function(){
                            this.layout.setPivot(-1);
                            this.position.set(-pivotLength + offset);
                            this._currentIndex--;
                        }.bind(this))
                    }
                }
                else {
                    progress = -offset / pivotLength;
                }

                return {
                    index : this._currentIndex,
                    progress : progress
                }
            }.bind(this), [this.position, this.layout.pivot, overflow]);

            // this.output.subscribe(pivot);

            pivot.on('start', function(){});
            pivot.on('update', function(){});
            pivot.on('end', function(){});

            var properties = (this.options.clip) ? {overflow : 'hidden'} : {};
            this.container = new ContainerSurface(properties);

            genericInput.subscribe(this.container);

            this.container.add(this.layout);
            this.add(this.container);
        },
        setPerspective: function(){
            ContainerSurface.prototype.setPerspective.apply(this.container, arguments);
        },
        push: function(item) {
            this.layout.push(item);
        },
        unshift: function(item) {
            this.layout.unshift(item);
        },
        pop: function (){
            return this.layout.pop();
        },
        shift : function(){
            return this.layout.shift();
        },
        addItems: function (items) {
            for (var i = 0; i < items.length; i++)
                this.push(items[i]);
        }
    }, CONSTANTS);

    function handleEdge(overflow, velocity){
        this.drag.halt();
        this.spring.reset(overflow);
        this.options.edgeTransition.velocity = velocity;
        this.spring.set(0, this.options.edgeTransition);
    }

    function handlePagination(){

    }

    function handleDrag(velocity){
        this.drag.halt();
        this.drag.reset(0);
        this.drag.set(0, {
            curve : 'inertia',
            velocity : velocity,
            drag : this.options.drag
        });
    }

    module.exports = Scrollview;
});
