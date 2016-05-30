/* Copyright © 2015-2016 David Valdman */
// TODO: allow spacing to be a stream
define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var View = require('../core/View');
    var ReduceStream = require('../streams/ReduceStream');
    var Stream = require('../streams/Stream');

    var CONSTANTS = {
        DIRECTION : {
            X : 0, 
            Y : 1
        }
    };

    var DEFAULT_LENGTH_MAP = function(length){
        return (this.options.direction === CONSTANTS.DIRECTION.X)
            ? Transform.translateX(length)
            : Transform.translateY(length);
    };

    /**
     * A layout which arranges items in series based on their size.
     *  Items can be arranged vertically or horizontally.
     *
     * @class SequentialLayout
     * @constructor
     * @namespace Layouts
     * @extends Core.View
     * @param [options] {Object}                        Options
     * @param [options.direction]{Number}               Direction to lay out items
     * @param [options.spacing] {Transitionable|Number} Gutter spacing between items
     */
    var SequentialLayout = View.extend({
        defaults : {
            direction : CONSTANTS.DIRECTION.X,
            spacing : 0
        }, 
        initialize : function initialize(options) {
            this.stream = new ReduceStream(function(prev, size) {
                if (!size) return false;
                return prev + size[options.direction] + options.spacing;
            });

            this.setLengthMap(DEFAULT_LENGTH_MAP);
            
            this.output.subscribe(this.stream.head.output);
        },
        setLengthMap : function(map){
            this.transformMap = map.bind(this);
        },
        push : function(item, sources) {
            var length = this.stream.push(item.size);
            var transform = createTransformFromLength.call(this, length, sources);
            this.add({transform : transform}).add(item);
        },
        unshift : function(item, sources){
            var length = this.stream.unshift(item.size);
            var transform = createTransformFromLength.call(this, length, sources);
            this.add({transform : transform}).add(item);
        },
        insertAfter : function(prevItem, item, sources) {
            var length = this.stream.insertAfter(prevItem.size, item.size);
            var transform = createTransformFromLength.call(this, length, sources);
            this.add({transform : transform}).add(item);
        },
        insertBefore : function(postItem, item, sources){
            if (!postItem) return;
            var length = this.stream.insertBefore(postItem.size, item.size);
            var transform = createTransformFromLength.call(this, length, sources);
            this.add({transform : transform}).add(item);
        },
        removeItem : function(item){
            this.stream.remove(item.size);
            item.remove();
        },
        shift : function(){
            this.stream.shift();
            item.remove();
        }
    }, CONSTANTS);

    function createTransformFromLength(length, sources){
        if (sources){
            sources = sources.slice();
            sources.unshift(length);
            return Stream.lift(this.transformMap, sources);
        }
        else return length.map(this.transformMap);
    }
    
    module.exports = SequentialLayout;
}); 
