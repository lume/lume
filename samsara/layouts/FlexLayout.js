/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Transform = require('../core/Transform');
    var View = require('../core/View');
    var Transitionable = require('../core/Transitionable');
    var Stream = require('../streams/Stream');
    var ReduceStream = require('../streams/ReduceStream');
    var Accumulator = require('../streams/Accumulator');
    var Differential = require('../streams/Differential');

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        }
    };

    // Default map to convert displacement to transform
    var DEFAULT_LENGTH_MAP = function(length){
        return (this.options.direction === CONSTANTS.DIRECTION.X)
            ? Transform.translateX(length)
            : Transform.translateY(length);
    };

    /**
     * A layout which arranges items vertically or horizontally within a containing size.
     *  Items with a definite size in the specified direction keep their size, where
     *  items with an `undefined` size in the specified direction have a flexible size.
     *  Flexible sized items split up the left over size relative to their flex value.
     *
     * @class FlexLayout
     * @constructor
     * @namespace Layouts
     * @extends Core.View
     * @param [options] {Object}                        Options
     * @param [options.direction]{Number}               Direction to lay out items
     * @param [options.spacing]{Number}                 Spacing between items
     */
    var FlexLayout = View.extend({
        defaults : {
            direction : CONSTANTS.DIRECTION.X,
            spacing : 0
        },
        initialize : function initialize(options){
            // Store nodes and flex values
            this.nodes = [];
            this.flexs = [];

            // Displacement for each item
            this.lengthStream = new ReduceStream(function(prev, size){
                if (!size) return false;
                return prev + size[options.direction] + options.spacing;
            });

            // Amount of length used by fixed sized items
            this.usedLength = new ReduceStream(function(prev, size){
                if (!size) return false;
                return prev + size[options.direction];
            });

            // Amount of length left over for flex items
            this.availableLength = Stream.lift(function(totalSize, usedLength){
                if (!totalSize) return false;
                return totalSize[options.direction] - usedLength;
            }, [this.size, this.usedLength.headOutput]);

            // Total amount of flex
            this.totalFlex = new Accumulator(0);

            // Map to convert displacement to transform
            this.setLengthMap(DEFAULT_LENGTH_MAP);
        },
        /*
         * Set a custom map from length displacements to transforms.
         * `this` will automatically be bound to the instance.
         *
         * @method setLengthMap
         * @param map {Function} Map `(length) -> transform`
         */
        setLengthMap : function(map){
            this.transformMap = map.bind(this);
        },
        /*
         * Add a renderable to the end of the layout
         *
         * @method push
         * @param item {Surface|View}           Renderable
         * @param flex {Number|Transitionable}  Flex amount
         */
        push : function(item, flex){
            this.nodes.push(item);
            this.flexs.push(flex);

            if (flex === undefined) this.usedLength.push(item.size);
            var length = this.lengthStream.push(item.size);
            var node = createNodeFromLength.call(this, length, flex);
            this.add(node).add(item);
        },
        /*
         * Unlink the last renderable in the layout
         *
         * @method pop
         * @return item
         */
        pop : function(){
            return this.unlink(this.nodes.length - 1);
        },
        /*
         * Add a renderable to the beginning of the layout
         *
         * @method unshift
         * @param item {Surface|View}           Renderable
         * @param flex {Number|Transitionable}  Flex amount
         */
        unshift : function(item, flex){
            this.nodes.unshift(item);
            this.flexs.unshift(flex);

            if (flex === undefined) this.usedLength.push(item.size);
            var length = this.lengthStream.unshift(item.size);
            var node = createNodeFromLength.call(this, length, flex);
            this.add(node).add(item);
        },
        /*
         * Unlink the first renderable in the layout
         *
         * @method shift
         * @return item
         */
        shift : function(){
            return this.unlink(0);
        },
        /*
         * Add a renderable after a specified renderable
         *
         * @method insertAfter
         * @param prevItem {Number|Surface|View}    Index or renderable to insert after
         * @param item {Surface|View}               Renderable to insert
         * @param flex {Number|Transitionable}      Flex amount
         */
        insertAfter : function(prevItem, item, flex){
            var index;
            if (typeof prevItem === 'number'){
                index = prevItem + 1;
                prevItem = this.nodes[prevItem];
            }
            else index = this.nodes.indexOf(prevItem) + 1;

            this.nodes.splice(index, 0, item);
            this.flexs.splice(index, 0, flex);

            if (flex === undefined) this.usedLength.push(item.size);
            var length = this.lengthStream.insertAfter(prevItem.size, item.size);
            var node = createNodeFromLength.call(this, length, flex);
            this.add(node).add(item);
        },
        /*
         * Add a renderable before a specified renderable
         *
         * @method insertAfter
         * @param prevItem {Number|Surface|View}    Index or renderable to insert before
         * @param item {Surface|View}               Renderable to insert
         * @param flex {Number|Transitionable}      Flex amount
         */
        insertBefore : function(postItem, item, flex){
            var index;
            if (typeof postItem === 'number'){
                index = postItem - 1;
                postItem = this.nodes[postItem];
            }
            else index = this.nodes.indexOf(postItem) - 1;

            this.nodes.splice(index + 1, 0, item);
            this.flexs.splice(index + 1, 0, flex);

            if (flex === undefined) this.usedLength.push(item.size);
            var length = this.lengthStream.insertBefore(postItem.size, item.size);
            var node = createNodeFromLength.call(this, length, flex);
            this.add(node).add(item);
        },
        /*
         * Unlink the renderable.
         *  To remove the renderable, call the `.remove` method on it after unlinking.
         *
         * @method unlink
         * @param item {Number|Surface|View}        Index or item to remove
         * @return item
         */
        unlink : function(item){
            var index = (typeof item === 'number')
                ? item
                : this.nodes.indexOf(item);

            item = this.nodes.splice(index, 1)[0];
            var flex = this.flexs.splice(index, 1)[0];

            if (flex === undefined) this.usedLength.remove(item.size);
            else {
                if (typeof flex === 'number')
                    this.totalFlex.set(this.totalFlex.get() - flex);
                else
                    this.totalFlex.set(this.totalFlex.get() - flex.get());
            }
            this.lengthStream.remove(item.size);

            return item;
        },
        length : function(){
            return this.nodes.length;
        },
        /*
         * Returns flex for an item or index
         *
         * @method getFlexFor
         * @param item {Index|Surface|View} Index or item to get flex for
         * @return flex {Number|Transitionable}
         */
        getFlexFor : function(item){
            if (item === undefined) return this.getFlexes();
            return (typeof item === 'number')
                ? this.flexs[item]
                : this.flexs[this.nodes.indexOf(item)];
        },
        /*
         * Returns flexes of all current renderables
         *
         * @method getFlexes
         * @return flexes {Array}
         */
        getFlexes : function(){
            return this.flexs;
        }
    }, CONSTANTS);

    function createNodeFromLength(length, flex){
        var transform = length.map(this.transformMap);

        if (flex !== undefined){
            if (typeof flex === 'number'){
                this.totalFlex.set(this.totalFlex.get() + flex);
                // Flexible sized item: layout defines the size and transform
                var size = Stream.lift(function(availableLength, totalFlex){
                    if (!availableLength) return false;
                    var itemLength = (availableLength - (this.nodes.length - 1) * this.options.spacing) * (flex / totalFlex);
                    return (this.options.direction === CONSTANTS.DIRECTION.X)
                        ? [itemLength, undefined]
                        : [undefined, itemLength];
                }.bind(this), [this.availableLength, this.totalFlex]);
            }
            else {
                this.totalFlex.set(this.totalFlex.get() + flex.get());

                var flexDelta = new Differential();
                flexDelta.subscribe(flex);
                this.totalFlex.subscribe(flexDelta);

                var size = Stream.lift(function(availableLength, flex, totalFlex){
                    if (!availableLength) return false;
                    var itemLength = (availableLength - (this.nodes.length - 1) * this.options.spacing) * (flex / totalFlex);
                    return (this.options.direction === CONSTANTS.DIRECTION.X)
                        ? [itemLength, undefined]
                        : [undefined, itemLength];
                }.bind(this), [this.availableLength, flex, this.totalFlex]);
            }

            return {transform : transform, size : size};
        }
        else {
            // Fixed size item: layout only defines the transform
            return {transform : transform};
        }
    }

    module.exports = FlexLayout;
});
