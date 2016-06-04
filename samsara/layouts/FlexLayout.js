/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Transform = require('../core/Transform');
    var View = require('../core/View');
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
     */
    var FlexLayout = View.extend({
        defaults : {
            direction : CONSTANTS.DIRECTION.X
        },
        initialize : function initialize(options){
            // Displacement for each item
            this.lengthStream = new ReduceStream(function(prev, size){
                if (!size) return false;
                return prev + size[options.direction];
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

            // Cached arrays for reference
            this.nodes = [];
            this.flexs = [];
        },
        /*
         * Set a custom map from length displacements to transforms.
         * `this` will automatically be bound to the instance.
         *
         * @method setLengthMap
         * @param map [Function] Map `(length) -> transform`
         */
        setLengthMap : function(map){
            this.transformMap = map.bind(this);
        },
        /*
         * Set a custom map from length displacements to transforms.
         * Within the map function, `this` will automatically be bound to the instance.
         *
         * @method push
         * @param map [Function] Map `(length) -> transform`
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
         * Add a renderable to the beginning of the layout
         *
         * @method unshift
         * @param item {Surface|View} Renderable
         * @param flex {Number}       Flex amount
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
         * Add a renderable after a specified renderable
         *
         * @method insertAfter
         * @param prevItem {Number|Surface|View}    Renderable to insert after
         * @param item {Surface|View}               Renderable to insert
         * @param flex {Number}                     Flex amount
         */
        insertAfter : function(prevItem, item, flex){
            var index = (typeof prevItem === 'number')
                ? prevItem + 1
                : this.nodes.indexOf(prevItem) + 1;

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
         * @param prevItem {Number|Surface|View}    Renderable to insert before
         * @param item {Surface|View}               Renderable to insert
         * @param flex {Number}                     Flex amount
         */
        insertBefore : function(postItem, item, flex){
            if (!postItem) return;

            var index = (typeof postItem === 'number')
                ? postItem - 1
                : this.nodes.indexOf(postItem) - 1;

            this.nodes.splice(index, 0, item);
            this.flexs.splice(index, 0, flex);

            if (flex === undefined) this.usedLength.push(item.size);
            var length = this.stream.insertBefore(postItem.size, item.size);
            var node = createNodeFromLength.call(this, length, flex);
            this.add(node).add(item);
        },
        /*
         * Remove a renderable
         *
         * @method removeItem
         * @param item {Number|Surface|View} Item to remove
         */
        removeItem : function(item){
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
            item.remove();
        },
        getFlexFor : function(item){
            if (item === undefined) return this.getFlexes();
            return (typeof item === 'number')
                ? this.flexs[index]
                : this.flexs[this.surfaces.indexOf(item)];
        },
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
                    var itemLength = availableLength * (flex / totalFlex);
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
                    var itemLength = availableLength * (flex / totalFlex);
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
