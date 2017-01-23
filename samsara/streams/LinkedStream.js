/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module){
    var Stream = require('./Stream');
    var ReduceStream = require('./_ReduceStream');
    var Observable = require('./Observable');
    var SimpleStream = require('./SimpleStream');
    var StreamInput = require('./_StreamInput');
    var StreamOutput = require('./_StreamContract');
    var StreamIO = require('../streams/_StreamIO');
    var preTickQueue = require('../core/queues/preTickQueue');
    var nextTick = require('../core/queues/nextTick');
    var Transitionable = require('../core/Transitionable');

    function LinkedStream(reducer, offset){
        this.reducer = reducer;
        this.prevReducer = function(){
            arguments[0] *= -1;
            return -reducer.apply(null, arguments);
        };

        this.offset = (offset === undefined || typeof offset === 'number')
            ? new Observable(offset || 0)
            : offset;

        this.prev = []; // A list of items rendered before the offset, in order of distance from the offset
        this.next = []; // A list of items rendered after the offset, in order of distance from the offset

        this.tailOutput = new StreamIO();
        this.tailOutput.subscribe(this.offset);

        this.headOutput = new StreamIO();
        this.headOutput.subscribe(this.offset);

        this.pivotOutput = new Stream();
        this.pivotOutput.subscribe(this.offset);

        this.prevPivot = new Stream();
        this.prevPivot.subscribe(this.offset);
    }

    function fireOffset(){
        this.offset.set(this.offset.get());
    }

    LinkedStream.prototype.push = function(stream, spacing){
        if (spacing === undefined) spacing = 0;
        var spacing = (typeof spacing === 'number')
            ? new Transitionable(spacing)
            : spacing;

        var node = new ReduceStream(this.reducer, stream, spacing);
        node.position.subscribe(node._input);

        if (this.next.length === 0){
            node.subscribe(this.offset);
            setPivotOutput.call(this, node);
            setHeadOutput.call(this, node, this.offset);
            fireOffset.call(this);
        }
        else {
            var lastNode = this.next[this.next.length - 1];
            node.subscribe(lastNode);
            setHeadOutput.call(this, node, lastNode);
        }

        this.next.push(node);

        return node.position;
    };

    LinkedStream.prototype.unshift = function(stream, spacing){
        if (spacing === undefined) spacing = 0;
        var spacing = (typeof spacing === 'number')
            ? new Transitionable(spacing)
            : spacing;

        var node = new ReduceStream(this.prevReducer, stream, spacing);
        node.position.subscribe(node._output);

        if (this.prev.length === 0){
            node.subscribe(this.offset);
            setPrevPivotOutput.call(this, node);
            setTailOutput.call(this, node, this.offset);
            fireOffset.call(this);
        }
        else {
            var firstNode = this.prev[this.prev.length - 1];
            node.subscribe(firstNode);
            setTailOutput.call(this, node, firstNode);
        }

        this.prev.push(node);

        return node.position;
    };

    LinkedStream.prototype.pop = function(){
        if (!this.next.length && !this.prev.length) return false;
        var node, prev;

        if (!this.next.length) {
            // no next array nodes so shift from prev array
            node = this.prev.shift();
            if (this.next.length > 0){
                prev = this.prev[0];
                prev.unsubscribe(node);
                prev.subscribe(this.offset);
            }
            else {
                setPivotOutput.call(this, node);
            }
        }
        else {
            node = this.next.pop();
            prev = (this.next.length === 0) ? this.offset : this.next[this.next.length - 1];

            node.unsubscribe(prev);
            setHeadOutput.call(this, prev);

            if (this.next.length === 0){
                setPivotOutput.call(this, node);
            }
        }

        fireOffset.call(this);

        return node;
    };

    LinkedStream.prototype.shift = function(){
        if (!this.next.length && !this.prev.length) return false;

        var node, next;

        if (!this.prev.length) {
            // no prev array nodes so shift from next array
            node = this.next.shift();
            if (this.next.length > 0){
                next = this.next[0];
                next.unsubscribe(node);
                next.subscribe(this.offset);
            }
            else {
                setPivotOutput.call(this, node);
            }
        }
        else {
            node = this.prev.pop();
            next = (this.prev.length === 0) ? this.offset : this.prev[0];

            node.unsubscribe(next);
            setTailOutput.call(this, next);

            if (this.prev.length === 0){
                setPrevPivotOutput.call(this, node);
            }
        }

        fireOffset.call(this);

        return node;
    };

    LinkedStream.prototype.setPivot = function(index){
        if (
            index === 0 ||
            index > 0 && index > this.next.length ||
            index < 0 && index < -this.prev.length
        ) return;

        if (this.prev.length === 2) console.log('here we go');

        if (this.next[0]) this.next[0].unsubscribe(this.offset);
        if (this.prev[0]) this.prev[0].unsubscribe(this.offset);

        var i;
        if (index > 0){
            // moving forwards

            var shouldAddTail = false;
            if (this.prev.length === 0){
                shouldAddTail = true;
            }

            for (i = 0; i < index; i++){
                var next = this.next.shift();

                next.setMap(this.prevReducer);
                next.position.unsubscribe(next._input);
                next.position.subscribe(next._output);

                if (this.next[0]) this.next[0].unsubscribe(next);
                if (this.prev[0]) this.prev[0].subscribe(next);

                this.prev.unshift(next);
            }

            if (this.next.length === 0) setHeadOutput.call(this, this.offset);

            if (shouldAddTail) setTailOutput.call(this, this.prev[this.prev.length - 1]);
        }
        else {
            // moving backwards

            var shouldAddHead = false;
            if (this.next.length === 0){
                shouldAddHead = true;
            }

            for (i = 0; i < -index; i++) {
                var prev = this.prev.shift();

                prev.setMap(this.reducer);
                prev.position.unsubscribe(prev._output);
                prev.position.subscribe(prev._input);

                if (this.prev[0]) this.prev[0].unsubscribe(prev);
                if (this.next[0]) this.next[0].subscribe(prev);

                this.next.unshift(prev);
            }

            if (this.prev.length === 0) setTailOutput.call(this, this.offset);

            if (shouldAddHead) setHeadOutput.call(this, this.next[this.next.length - 1]);
        }

        setPivotOutput.call(this, this.next[0] || this.offset);
        setPrevPivotOutput.call(this, this.prev[0] || this.offset);

        if (this.next[0]) this.next[0].subscribe(this.offset);
        if (this.prev[0]) this.prev[0].subscribe(this.offset);

        // fireOffset.call(this);
    };

    function setHeadOutput(head, prevHead){
        this.headOutput.unsubscribe(prevHead);
        this.headOutput.subscribe(head);
    }

    function setTailOutput(tail, prevTail){
        this.tailOutput.unsubscribe(prevTail);
        this.tailOutput.subscribe(tail);
    }

    function setPivotOutput(pivotStream){
        this.pivotOutput.unsubscribe();
        this.pivotOutput.subscribe(pivotStream);
    }

    function setPrevPivotOutput(pivotStream){
        this.prevPivot.unsubscribe();
        this.prevPivot.subscribe(pivotStream);
    }

    module.exports = LinkedStream;
});
