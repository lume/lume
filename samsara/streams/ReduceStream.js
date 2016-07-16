/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module) {
    var Stream = require('./Stream');
    var SimpleStream = require('./SimpleStream');
    var Observable = require('./Observable');
    var EventHandler = require('../events/EventHandler');

    function ReduceNode(reducer, stream, extras){
        this.input = new SimpleStream();

        var sources = [this.input, stream];
        if (extras) sources = sources.concat(extras);

        this.output = Stream.lift(reducer, sources);

        EventHandler.setInputHandler(this, this.input);
        EventHandler.setOutputHandler(this, this.output);
    }

    function Node(value){
        this.prev = null;
        this.next = null;
        this.value = null;
        
        if (value) this.set(value);
    }

    Node.prototype.set = function(value){
        this.value = value;
    };

    Node.prototype.get = function(){
        return this.value;
    };

    Node.prototype.is = function(value){
        return this.get() === value;
    };

    function LinkedList(reducer, offset, extras){
        this.reducer = reducer;
        this.offset = new Observable(offset || 0);
        this.extras = extras;

        this.head = null;
        this.tail = null;

        this.headOutput = new SimpleStream();
        this.headOutput.subscribe(this.offset);
    }

    LinkedList.prototype.push = function(stream){
        var reduceNode = new ReduceNode(this.reducer, stream, this.extras);
        var node = new Node(reduceNode);

        if (this.head === null) createFirstNode.call(this, node);
        else connectLL(this.head, node);

        this.head = node;
        setHeadOutputLL.call(this, this.head);

        return reduceNode.input;
    };

    LinkedList.prototype.unshift = function(stream){
        var reduceNode = new ReduceNode(this.reducer, stream, this.extras);
        var node = new Node(reduceNode);

        if (this.tail === null) {
            createFirstNode.call(this, node);
            setHeadOutputLL.call(this, this.head);
        }
        else {
            this.tail.get().unsubscribe(this.offset);
            node.get().subscribe(this.offset);
            connectLL(node, this.tail);
            this.offset.set(this.offset.get())
        }

        this.tail = node;

        return reduceNode.input;
    };


    LinkedList.prototype.pop = function(){
        if (!this.head) return;

        var prev = this.head.prev;

        if (prev){
            severLL(prev, this.head);
            this.head = prev;
            setHeadOutputLL.call(this, this.head);
        }
        else reset.call(this);
    };

    LinkedList.prototype.shift = function(){
        if (!this.tail) return;

        var next = this.tail.next;

        if (next){
            severLL(this.tail, next);
            this.tail = next;
        }
        else reset.call(this);
    };

    function reset(){
        this.head = null;
        this.tail = null;

        this.headOutput.unsubscribe();
        this.headOutput.subscribe(this.offset);
    }

    function createFirstNode(node){
        this.head = node;
        this.tail = node;

        node.get().subscribe(this.offset);
        this.offset.set(this.offset.get());
    }

    function severLL(node1, node2){
        node1.next = null;
        node2.prev = null;
        node2.get().unsubscribe(node1.get());
    }

    function connectLL(node1, node2){
        node1.next = node2;
        node2.prev = node1;
        node2.get().subscribe(node1.get());
    }

    function setHeadOutputLL(node){
        this.headOutput.unsubscribe();
        this.headOutput.subscribe(node.get());
    }

    // function ReduceStream(reducer, value, options) {
    //     this.reducer = reducer;
    //     this.options = options || {offset : 0};
    //
    //     this.prev = null;
    //     this.next = null;
    //
    //     this.head = this;
    //     this.headOutput = new SimpleStream();
    //
    //     if (value) {
    //         this.value = value;
    //         this.input = new SimpleStream();
    //         this.output = (options.sources)
    //             ? Stream.lift(this.reducer, [this.input, this.value].concat(options.sources))
    //             : Stream.lift(this.reducer, [this.input, this.value]);
    //     }
    //     else {
    //         this.value = null;
    //
    //         if (typeof this.options.offset === 'number'){
    //             this.output = new Observable(this.options.offset);
    //         }
    //         else {
    //             this.output = new SimpleStream();
    //             this.output.subscribe(this.options.offset);
    //         }
    //     }
    //
    //     setHeadOutput.call(this, this.head.output);
    // }
    //
    // ReduceStream.prototype = Object.create(Stream.prototype);
    // ReduceStream.prototype.constructor = ReduceStream;
    //
    // ReduceStream.prototype.push = function(stream) {
    //     // refire the initial value if adding to an empty list
    //     if (this.head === this && this.output.set)
    //         this.output.set(this.options.offset || 0);
    //
    //     var sizeArray = new ReduceStream(this.reducer, stream, this.options);
    //     connect(this.head, sizeArray);
    //
    //     this.head = sizeArray;
    //     setHeadOutput.call(this, this.head.output);
    //
    //     return sizeArray.input;
    // };
    //
    // ReduceStream.prototype.pop = function() {
    //     var prev = this.head.prev;
    //
    //     sever(prev, this.head);
    //     this.head = prev;
    //
    //     setHeadOutput.call(this, this.head.output);
    // };
    //
    // ReduceStream.prototype.unshift = function(value) {
    //     var curr = this;
    //     var next = curr.next;
    //
    //     if (!next) return this.push(value);
    //
    //     var newNode = new ReduceStream(this.reducer, value, this.options);
    //
    //     sever(curr, next);
    //     connect(curr, newNode);
    //     connect(newNode, next);
    //
    //     if (this.output.set) this.output.set(this.options.offset || 0);
    //
    //     return newNode.input;
    // };
    //
    // ReduceStream.prototype.shift = function(){
    //     this.remove(this.next.value);
    // };
    //
    // ReduceStream.prototype.insertAfter = function(target, value) {
    //     var curr = getNode.call(this, target);
    //     if (!curr) return;
    //
    //     var next = curr.next;
    //
    //     if (next) {
    //         var newNode = new ReduceStream(this.reducer, value, this.options);
    //
    //         sever(curr, next);
    //         connect(newNode, next);
    //         connect(curr, newNode);
    //
    //         return newNode.input;
    //     }
    //     else return this.push(value);
    // };
    //
    // ReduceStream.prototype.insertBefore = function(target, value){
    //     var curr = getNode.call(this, target);
    //     if (!curr) return;
    //
    //     var prev = curr.prev;
    //
    //     if (prev !== this){
    //         var newNode = new ReduceStream(this.reducer, value, this.options);
    //         sever(prev, curr);
    //         connect(newNode, curr);
    //         connect(prev, newNode);
    //         return newNode.input;
    //     }
    //     else return this.unshift(value);
    // };
    //
    // ReduceStream.prototype.remove = function(value){
    //     var curr = getNode.call(this, value);
    //     if (!curr) return;
    //
    //     var prev = curr.prev;
    //     var next = curr.next;
    //
    //     if (next){
    //         sever(curr, next);
    //         sever(prev, curr);
    //         connect(prev, next);
    //
    //         if (this.output.set) this.output.set(this.options.offset || 0);
    //     }
    //     else this.pop();
    // };
    //
    // function getNode(value){
    //     var node = this;
    //     while (node && node.value !== value)
    //         node = node.next;
    //
    //     return node;
    // }
    //
    // function sever(node1, node2){
    //     node1.next = null;
    //     node2.prev = null;
    //     node2.input.unsubscribe(node1.output)
    // }
    //
    // function connect(node1, node2){
    //     node1.next = node2;
    //     node2.prev = node1;
    //     node2.input.subscribe(node1.output);
    // }
    //
    // function setHeadOutput(output){
    //     this.headOutput.unsubscribe();
    //     this.headOutput.subscribe(output);
    // }

    module.exports = LinkedList;
});
