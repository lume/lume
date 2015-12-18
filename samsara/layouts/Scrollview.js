/* Copyright © 2015 David Valdman */

define(function (require, exports, module) {
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    var View = require('../core/View');
    var LayoutNode = require('../core/LayoutNode');
    var Stream = require('../streams/Stream');
    var ResizeStream = require('../streams/ResizeStream');
    var Accumulator = require('../streams/Accumulator');
    var Differential = require('../streams/Differential');

    var SequentialLayout = require('./SequentialLayout');
    var ContainerSurface = require('../dom/ContainerSurface');

    var GenericInput = require('../inputs/GenericInput');
    var ScrollInput = require('../inputs/ScrollInput');
    var TouchInput = require('../inputs/TouchInput');

    GenericInput.register({
        touch: TouchInput,
        scroll: ScrollInput
    });

    var CONSTANTS = {
        DIRECTION: {
            X: 0,
            Y: 1
        }
    };

    var Scrollview = View.extend({
        defaults: {
            direction: CONSTANTS.DIRECTION.Y,
            pageTransition: false
        },
        initialize: function (options) {
            this._currentIndex = 0;
            this._previousIndex = 0;
            this.itemOffset = 0;
            this.items = [];

            this.layout = new SequentialLayout({
                direction: options.direction
            });

            var genericInput = new GenericInput(['touch', 'scroll'], {
                direction: options.direction
            });

            var position = new Accumulator(0);

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

            if (options.pageTransition) {
                genericInput.on('end', function (data) {
                    if (!shouldBounce) return;
                    this.drag.reset(0);
                    this.spring.reset(0);
                    options.pageTransition.velocity = data.velocity + this.drag.getVelocity();
                    this.drag.set(0, options.pageTransition);
                }.bind(this));

                genericInput.on('start', function () {
                    this.drag.halt();
                    this.spring.halt();
                }.bind(this));

                this.spring.on('start', function () {
                    this.drag.velocity = 0;
                }.bind(this));

                this.spring.on('end', function () {
                    changePage.call(this, this._currentIndex);
                }.bind(this));
            }

            position.on('end', function(){
                changePage.call(this, this._currentIndex);
            }.bind(this));

            var overflowStream = ResizeStream.lift(function (contentLength, viewportSize) {
                if (!contentLength) return false;
                return viewportSize[options.direction] - contentLength;
            }, [this.layout, this.size]);


            var shouldBounce = true;
            this.offset = Stream.lift(function (top, overflow) {
                shouldBounce = true;
                if (!overflow) return false;

                if (this.drag.isActive() || this.spring.isActive())
                    return Math.round(top);

                if (top <= overflow) {
                    shouldBounce = false;
                    position.set(overflow, true);
                    changePage.call(this, this._currentIndex);
                    return overflow;
                }
                else if (top >= 0) {
                    shouldBounce = false;
                    position.set(0, true);
                    changePage.call(this, this._currentIndex);
                    return 0;
                }
                else
                    return Math.round(top);
            }.bind(this), [position, overflowStream]);

            var displacementNode = new LayoutNode({
                transform: this.offset.map(function (position) {
                    return options.direction == CONSTANTS.DIRECTION.Y
                        ? Transform.translateY(position)
                        : Transform.translateX(position);
                })
            });

            var container = new ContainerSurface({
                properties: {
                    overflow: 'hidden'
                }
            });

            genericInput.subscribe(container);

            container.add(displacementNode).add(this.layout);
            this.add(container);
        },
        goto: function (index, transition, callback) {
            transition = transition || this.options.transition;
            var position = this.itemOffset;
            if (index > this._currentIndex) {
                for (var i = this._currentIndex; i < index; i++)
                    position -= this.items[i].getSize()[this.options.direction];
            }
            else if (index < this._currentIndex) {
                for (var i = this._currentIndex; i > index; i--)
                    position += this.items[i].getSize()[this.options.direction];
            }
            else return;

            this.spring.set(0);
            this.spring.set(Math.ceil(position), transition, callback);
        },
        addItems: function (items) {
            this.layout.addItems(items);
            this.items = items;

            var args = [this.offset];
            for (var i = 0; i < items.length; i++) {
                args.push(items[i].size);
            }

            var accumLength = 0;
            var itemOffsetStream = Stream.lift(function () {
                if (arguments[1] === undefined) return false;

                var offset = arguments[0];
                var direction = this.options.direction;
                var index = this._currentIndex;
                var currentSize = arguments[index + 1];

                if (!currentSize) return false;

                var progress = 0;
                var itemOffset = -offset - accumLength;
                var currentLength = currentSize[direction];

                if (itemOffset >= currentLength) {
                    // pass currentNode forwards
                    this._currentIndex++;
                    progress = 0;
                    accumLength += currentLength;
                }
                else if (itemOffset < 0) {
                    // pass currentNode backwards
                    if (this._currentIndex == 0) return false;
                    this._currentIndex--;
                    progress = 1;
                    currentLength = arguments[this._currentIndex + 1][direction];
                    accumLength -= currentLength;
                }
                else {
                    progress = itemOffset / currentLength;
                }

                this.itemOffset = (itemOffset < currentLength / 2)
                    ? itemOffset
                    : itemOffset - currentLength;

                return {
                    index: this._currentIndex,
                    progress: progress
                };
            }.bind(this), args);

            this.output.subscribe(itemOffsetStream);

            itemOffsetStream.on('start', function (value) {
            }.bind(this));

            itemOffsetStream.on('update', function (value) {
            }.bind(this));

            itemOffsetStream.on('end', function (value) {
            }.bind(this));
        }
    });

    function changePage(index) {
        if (index == this._previousIndex) return;
        this.emit('page', index);
        this._previousIndex = index;
    }

    module.exports = Scrollview;
});
