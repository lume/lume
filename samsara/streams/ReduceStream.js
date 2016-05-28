/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module) {
    var Stream = require('./Stream');
    var SimpleStream = require('./SimpleStream');
    var Observable = require('./Observable');

    function ReduceStream(reducer, value) {
        this.reducer = reducer;
        this.prev = null;
        this.next = null;
        this.headOutput = new SimpleStream();

        if (value) {
            this.value = value;
            this.input = new SimpleStream();
            this.output = Stream.lift(this.reducer, [this.input, this.value]);
        }
        else {
            this.value = null;
            this.output = new Observable(0);
        }

        setHeadOutput.call(this, this.output);
    }

    ReduceStream.prototype = Object.create(Stream.prototype);
    ReduceStream.prototype.constructor = ReduceStream;

    ReduceStream.prototype.push = function(stream) {
        var sizeArray = new ReduceStream(this.reducer, stream);

        var head = getHead.call(this);
        connect(head, sizeArray);

        setHeadOutput.call(this, sizeArray.output);

        return sizeArray.input;
    };

    ReduceStream.prototype.unshift = function(value) {
        var newNode = new ReduceStream(this.reducer, value);

        var curr = this;
        var next = curr.next;

        if (!next) {
            setHeadOutput.call(this, curr.output);
            sever(curr, next);
            connect(newNode, next);
        }

        connect(curr, newNode);
        
        return newNode.input;
    };

    ReduceStream.prototype.remove = function(value) {
        var curr = getNode.call(this, value);
        var prev = curr.prev;
        var next = curr.next;

        if (next) {
            sever(curr, next);
            sever(prev, curr);
            connect(prev, next);
        }
        else {
            sever(prev, curr);
            setHeadOutput.call(this, prev.output);
        }

        curr = null;
    };

    ReduceStream.prototype.insertAfter = function(target, value) {
        var curr = getNode.call(this, target);
        var next = curr.next;

        if (next) {
            var newNode = new ReduceStream(this.reducer, value);

            sever(curr, next);
            connect(newNode, next);
            connect(curr, newNode);

            return newNode.input;
        }
        else return this.push(value);
    };

    ReduceStream.prototype.insertBefore = function(target, value){
        var curr = getNode.call(this, target);
        var prev = curr.prev;

        if (prev != this){
            var newNode = new ReduceStream(this.reducer, value);
            sever(prev, curr);
            connect(newNode, curr);
            connect(prev, newNode);
            return newNode.input;
        }
        else return this.unshift(value);
    };

    function getNode(value){
        var node = this;
        while (node && node.value !== value)
            node = node.next;

        return node;
    }

    function getHead(){
        var head = this;
        while (head.next) head = head.next;
        return head;
    }

    function sever(node1, node2){
        node1.next = null;
        node2.prev = null;
        node2.input.unsubscribe(node1.output)
    }

    function connect(node1, node2){
        node1.next = node2;
        node2.prev = node1;
        node2.input.subscribe(node1.output);
    }

    function setHeadOutput(output){
        this.headOutput.unsubscribe();
        this.headOutput.subscribe(output);
    }

    module.exports = ReduceStream;
}); 
