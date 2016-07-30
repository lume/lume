/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var View = require('../core/View');
    // var ReduceStream = require('../streams/ReduceStream');
    var ReduceStream = require('../streams/LinkedStream');
    var SimpleStream = require('../streams/SimpleStream');
    var Stream = require('../streams/Stream');

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
            spacing : 0,
            offset : 0
        },
        initialize : function initialize(options) {
            // Store nodes and flex values
            this.nodes = [];

            this.stream = new ReduceStream(function(prev, length, spacing){
                if (length === undefined) return false;
                return prev + length + spacing;
            }, options.offset, [options.spacing]);

            this.setLengthMap(DEFAULT_LENGTH_MAP);

            var length = Stream.lift(function(length, spacing){
                return Math.max(length - spacing, 0);
            }, [this.stream.headOutput, options.spacing]);

            this.output.subscribe(Stream.merge([this.stream.tailOutput, this.stream.headOutput]));

            this.pivot = new SimpleStream();
            this.pivot.subscribe(this.stream.pivotOutput);

            // SequentialLayout derives its size from its content
            var size = [];
            this.size = Stream.lift(function(parentSize, length){
                if (!parentSize || length === undefined) return;
                size[options.direction] = length;
                size[1 - options.direction] = parentSize[1 - options.direction];
                return size;
            }, [this._size, length]);
        },
        /*
        * Set a custom map from length displacements to transforms.
        * `this` will automatically be bound to the instance.
        *
        * @method setLengthMap
        * @param map [Function] Map `(length) -> transform`
        */
        setLengthMap : function(map, sources){
            this.transformMap = map.bind(this);
            if (sources) this.setSources(sources);
        },
        setSources : function(sources){
            this.sources = sources;
        },
        /*
         * Add a renderable to the end of the layout
         *
         * @method push
         * @param map [Function] Map `(length) -> transform`
         */
        push : function(item) {
            var stream = item.size.map(function(size){
                return size[this.options.direction];
            }.bind(this));

            var length = this.stream.push(stream);

            this.nodes.push(item);

            var transform = (this.sources)
                ? Stream.lift(this.transformMap, [length].concat(this.sources))
                : length.map(this.transformMap);

            this.add({transform : transform}).add(item);
        },
        /*
         * Unlink the last renderable in the layout
         *
         * @method pop
         * @return item
         */
        pop : function(){
            this.stream.pop();
            return this.nodes.pop();
        },
        /*
         * Add a renderable to the beginning of the layout
         *
         * @method unshift
         * @param item {Surface|View} Renderable
         */
        unshift : function(item){
            var stream = item.size.map(function(size){
                return size[this.options.direction];
            }.bind(this));

            var length = this.stream.unshift(stream);

            this.nodes.unshift(item);

            var transform = length.map(this.transformMap);
            this.add({transform : transform}).add(item);
        },
        /*
         * Unlink the first renderable in the layout
         *
         * @method shift
         * @return item
         */
        shift : function(){
            this.stream.shift();
            return this.nodes.shift();
        },
        /*
         * Unlink the renderable.
         *  To remove the renderable, call the `.remove` method on it after unlinking.
         *
         * @method unlink
         * @param item {Surface|View} Item to remove
         * @return item
         */
        unlink : function(item){
            var index;
            if (typeof item === 'number'){
                index = item;
                item = this.nodes[item];
            }
            else index = this.nodes.indexOf(item);

            if (!item) return;

            if (index === 0){
                return this.shift();
            }
            else if (index === this.nodes.length - 1){
                return this.pop();
            }
            else {
                this.stream.remove(item.size);
                this.nodes.splice(index, 1);
            }
        },
        setPivot : function(index){
            this.stream.setPivot(index);
        }
    }, CONSTANTS);

    module.exports = SequentialLayout;
});
