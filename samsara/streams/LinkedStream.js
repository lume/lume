/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module){
    var Stream = require('./Stream');
    var ReduceStream = require('./_ReduceStream');
    var SimpleStream = require('./SimpleStream');
    var Observable = require('./Observable');
    var StreamInput = require('./_StreamInput');
    var StreamOutput = require('./_StreamContract');
    var preTickQueue = require('../core/queues/preTickQueue');
    var nextTick = require('../core/queues/nextTick');

    function LinkedStream(reducer, offset, extras){
        this.reducer = reducer;
        this.prevReducer = function(){
            arguments[0] *= -1;
            return -reducer.apply(null, arguments);
        };

        this.offset = (offset === undefined || typeof offset === 'number')
            ? new Observable(offset || 0)
            : offset;

        this.cachedOffset = 0;
        this.offset.on(['set', 'start', 'update', 'end'], function(value){
            this.cachedOffset = value;
        }.bind(this));

        this.extras = extras;

        this.prev = []; // A list of items rendered before the offset, in order of distance from the offset
        this.next = []; // A list of items rendered after the offset, in order of distance from the offset

        this.tailOutput = new Stream();
        this.tailOutput.subscribe(this.offset);

        this.headOutput = new Stream();
        this.headOutput.subscribe(this.offset);

        this.pivotOutput = new Stream();
        this.pivotOutput.subscribe(this.offset);
    }

    function fireOffset(){
        this.offset.set(this.offset.get());
    }

    LinkedStream.prototype.push = function(stream){
        var node = new ReduceStream(this.reducer, stream, this.extras);
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

    LinkedStream.prototype.unshift = function(stream){
        var node = new ReduceStream(this.prevReducer, stream, this.extras);
        node.position.subscribe(node._output);

        if (this.prev.length === 0){
            node.subscribe(this.offset);
            fireOffset.call(this);
            setTailOutput.call(this, node);
        }
        else {
            var firstNode = this.prev[this.prev.length - 1];
            node.subscribe(firstNode);
            setTailOutput.call(this, node);
        }

        this.prev.push(node);

        return node.position;
    };

    LinkedStream.prototype.pop = function(){
        if (!this.next.length) return;

        var node = this.next.pop();
        var prev = (this.next.length === 0) ? this.offset : this.next[this.next.length - 1];

        node.unsubscribe(prev);
        setHeadOutput.call(this, prev);

        return node;
    };

    LinkedStream.prototype.shift = function(){
        if (!this.prev.length) return;

        var node = this.prev.shift();
        var next = (this.prev.length === 0) ? this.offset : this.prev[0];

        node.unsubscribe(next);
        setTailOutput.call(this, next);

        return node;
    };

    LinkedStream.prototype.setPivot = function(index){
        if (
            index === 0 ||
            index > 0 && index > this.next.length ||
            index < 0 && index < -this.prev.length
        ) return;

        if (this.next[0]) this.next[0].unsubscribe(this.offset);
        if (this.prev[0]) this.prev[0].unsubscribe(this.offset);

        var i;
        if (index > 0){
            for (i = 0; i < index; i++){
                var next = this.next.shift();

                next.setMap(this.prevReducer);
                next.position.unsubscribe(next._input);
                next.position.subscribe(next._output);

                if (this.next[0]) this.next[0].unsubscribe(next);
                if (this.prev[0]) this.prev[0].subscribe(next);

                this.prev.unshift(next);
            }
        }
        else {
            for (i = 0; i < -index; i++) {
                var prev = this.prev.shift();

                prev.setMap(this.reducer);
                prev.position.unsubscribe(prev._output);
                prev.position.subscribe(prev._input);

                if (this.prev[0]) this.prev[0].unsubscribe(prev);
                if (this.next[0]) this.next[0].subscribe(prev);

                this.next.unshift(prev);
            }
        }

        if (this.prev[0]) {
            this.prev[0].subscribe(this.offset);
            setTailOutput.call(this, this.prev[this.prev.length - 1]);
        }
        else setTailOutput.call(this, this.offset);

        if (this.next[0]) {
            this.next[0].subscribe(this.offset);
            setHeadOutput.call(this, this.next[this.next.length - 1]);
        }
        else setHeadOutput.call(this, this.offset);

        setPivotOutput.call(this, this.next[0] || this.offset);

        fireOffset.call(this);
    };

    function setHeadOutput(head, prevHead){
        this.headOutput.unsubscribe();
        this.headOutput.subscribe(head);
    }

    function setTailOutput(tail){
        this.tailOutput.unsubscribe();
        this.tailOutput.subscribe(tail);
    }

    function setPivotOutput(pivotStream){
        this.pivotOutput.unsubscribe();
        this.pivotOutput.subscribe(pivotStream);
    }

    module.exports = LinkedStream;
});
