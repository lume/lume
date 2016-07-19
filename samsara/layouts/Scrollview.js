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

            var inputs = options.enableMouseDrag
                ? ['touch', 'scroll', 'mouse']
                : ['touch', 'scroll'];

            var genericInput = new GenericInput(inputs, {
                direction: options.direction
            });

            var gestureDifferential = genericInput.pluck('delta');

            var position = new Accumulator(-options.startPosition);
            position.subscribe(gestureDifferential);

            var scrollInput = genericInput.getInput('scroll');
            scrollInput.on('start', function(){
                isMouseWheelActive = true;
            });

            scrollInput.on('end', function(){
                isMouseWheelActive = false;
            });

            genericInput.on('start', function () {
                isTouching = true;
            }.bind(this));

            genericInput.on('end', function () {
                isTouching = false;
            }.bind(this));

            this.position = position;

            this.layout = new SequentialLayout({
                direction : options.direction,
                offset: this.position
            });

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
                        genericInput.setOptions({scale: options.edgeGrip});
                        edge = EDGE.TOP;
                        if (!isTouching) handleEdge.call(this, overflow, this.velocity);
                    }
                }
                else if(top < overflow) { // reached bottom of scrollview
                    edgeOverflow = top - overflow;
                    if (edge !== EDGE.BOTTOM){
                        genericInput.setOptions({scale: options.edgeGrip});
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

            this.container = new ContainerSurface({
                properties: {overflow : 'hidden'}
            });

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
        addItems: function (items) {
            for (var i = 0; i < items.length; i++) 
                this.push(items[i]);

            var offset = Stream.lift(function(offset, pivotLength){
                if (offset === undefined || !pivotLength) return;

                var length = pivotLength - offset;

                if (pivotLength < 0){
                    this.position.set(pivotLength);
                    this.layout.setPivot(1);
                }
                else if (pivotLength > length){
                    this.position.set(length + offset);
                    this.layout.setPivot(-1);
                }
            }.bind(this), [this.position, this.layout.pivot]);

            offset.on('start', function(){});
            offset.on('update', function(){});
            offset.on('end', function(){});
        }
    }, CONSTANTS);

    module.exports = Scrollview;
});
