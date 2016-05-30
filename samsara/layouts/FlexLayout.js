/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Transform = require('../core/Transform');
    var View = require('../core/View');
    var Stream = require('../streams/Stream');
    var ReduceStream = require('../streams/ReduceStream');
    var Observable = require('../streams/Observable');

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        }
    };

    // Map to convert displacement to transform
    var DEFAULT_LENGTH_MAP = function(length){
        return (this.options.direction === CONSTANTS.DIRECTION.X)
            ? Transform.translateX(length)
            : Transform.translateY(length);
    };

    /**
     * A layout which arranges items vertically or horizontally and
     *  with sizes prescribed by ratios of a containing size. These
     *  ratios can be animated.
     *
     * @class FlexLayout
     * @constructor
     * @namespace Layouts
     * @extends Core.View
     * @param [options] {Object}                        Options
     * @param [options.direction]{Number}               Direction to lay out items
     * @param [options.ratios] {Transitionable|Array}   The proportions
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
            this.totalFlex = new Observable(0);

            // Map to convert displacement to transform
            this.setLengthMap(DEFAULT_LENGTH_MAP);
        },
        setLengthMap : function(map){
            this.transformMap = map.bind(this);
        },
        push : function(item, flex){
            var length = this.lengthStream.push(item.size);
            var node = createNodeFromLength.call(this, length, flex);
            this.add(node).add(item);
        },
        unshift : function(item, flex){
            var length = this.lengthStream.unshift(item.size);
            var node = createNodeFromLength.call(this, length, flex);
            this.add(node).add(item);
        },
        insertAfter : function(prevItem, item, flex){
            var length = this.lengthStream.insertAfter(prevItem.size, item.size);
            var node = createNodeFromLength.call(this, length, flex);
            this.add(node).add(item);
        },
        insertBefore : function(postItem, item, flex){
            if (!postItem) return;
            var length = this.stream.insertBefore(postItem.size, item.size);
            var node = createNodeFromLength.call(this, length, flex);
            this.add(node).add(item);
        },
        removeItem : function(item){
            this.lengthStream.remove(item.size);
            item.remove();
        },
        shift : function(){
            this.lengthStream.shift();
            item.remove();
        }
    }, CONSTANTS);

    function createNodeFromLength(length, flex){
        var transform = length.map(this.transformMap);

        if (flex !== undefined){
            this.totalFlex.set(this.totalFlex.get() + flex);
            // Flexible sized item: layout defines the size and transform
            var size = Stream.lift(function(availableLength, totalFlex){
                if (!availableLength) return false;
                var itemLength = availableLength * (flex / totalFlex);
                return (this.options.direction === CONSTANTS.DIRECTION.X)
                    ? [itemLength, undefined]
                    : [undefined, itemLength];
            }.bind(this), [this.availableLength, this.totalFlex]);

            return {transform : transform, size : size};
        }
        else {
            // Fixed size item: layout only defines the transform
            this.usedLength.push(item.size);
            return {transform : transform};
        }
    }

    module.exports = FlexLayout;
});
