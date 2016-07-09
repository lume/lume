/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var View = require('../core/View');
    var SequentialLayout = require('./SequentialLayout');

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        }
    };

    // Default map to convert displacement to transform
    function DEFAULT_LENGTH_MAP(length){
        return (this.options.direction === CONSTANTS.DIRECTION.X)
            ? Transform.translateX(length)
            : Transform.translateY(length);
    }

    /**
     * A layout which arranges items vertically or horizontally within a containing size.
     *  Items with a definite size in the specified direction keep their size, where
     *  items with an `undefined` size in the specified direction have a flexible size.
     *  Flexible sized items split up the left over size relative to their flex value.
     *
     * @class BidirectionalList
     * @constructor
     * @namespace Layouts
     * @extends Core.View
     * @param [options] {Object}                        Options
     * @param [options.direction]{Number}               Direction to lay out items
     * @param [options.spacing]{Number}                 Spacing between items
     */
    var BidirectionalList = View.extend({
        defaults : {
            direction : CONSTANTS.DIRECTION.X,
            spacing : 0,
            offset : 0
        },
        initialize : function initialize(options){
            var leftOptions = Object.create(options);
            if (options.offset){
                if (typeof options.offset === 'number')
                    leftOptions.offset = -options.offset;
                else
                    leftOptions.offset = options.offset.map(function(value){
                        return -value;
                    });
            }

            this.left = new SequentialLayout(leftOptions);

            var rightOptions = Object.create(options);
            this.right = new SequentialLayout(rightOptions);

            this.setLengthMap(DEFAULT_LENGTH_MAP);

            this.add(this.left);
            this.add(this.right);
        },
        /*
         * Set a custom map from length displacements to transforms.
         * `this` will automatically be bound to the instance.
         *
         * @method setLengthMap
         * @param map {Function} Map `(length) -> transform`
         */
        setLengthMap : function(map, sources){
            function negativeLengthMap(){
                arguments[0] *= -1;
                return map.apply(this, arguments);
            }

            this.right.setLengthMap(map, sources);
            this.left.setLengthMap(negativeLengthMap, sources);
        },
        setPivot : function(pivot){
            var item, i;
            if (pivot > 0){
                for (i = 0; i < pivot; i++){
                    item = this.right.pop();
                    item.remove();
                    this.left.push(item);
                }
            }
            else {
                for (i = 0; i < -pivot; i++) {
                    item = this.left.pop();
                    item.remove();
                    this.right.push(item);
                }
            }
        },
        length : function(){
            return this.right.length() + this.left.length();
        }
    }, CONSTANTS);

    module.exports = BidirectionalList;
});
