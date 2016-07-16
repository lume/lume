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
        this.prevReducer = function(){
            arguments[0] *= -1;
            return -reducer.apply(null, arguments);
        };

        this.offset = new Observable(offset || 0);
        this.extras = extras;

        this.head = null;
        this.tail = null;
        this.pivot = null;

        this.tailOutput = new SimpleStream();
        this.tailOutput.subscribe(this.offset);

        this.headOutput = new SimpleStream();
        this.headOutput.subscribe(this.offset);
    }

    LinkedList.prototype.push = function(stream){
        var reduceNode = new ReduceNode(this.reducer, stream, this.extras);
        var node = new Node(reduceNode);

        if (this.head === null) {
            createFirstNode.call(this, node);
            setTailOutput.call(this, this.tail);
        }
        else {
            connect(this.head, node, 1);
            this.head = node;
        }

        setHeadOutput.call(this, this.head);

        return reduceNode.input;
    };

    LinkedList.prototype.unshift = function(stream){
        var reduceNode = new ReduceNode(this.prevReducer, stream, this.extras);
        var node = new Node(reduceNode);

        if (this.tail === null) {
            createFirstNode.call(this, node);
            setHeadOutput.call(this, this.head);
        }
        else {
            if (this.tail === this.pivot){
                node.next = this.tail;
                this.tail.prev = node;

                node.get().subscribe(this.pivot.get().input);
                this.offset.set(this.offset.get());
            }
            else {
                connect(node, this.tail, -1);
            }
            this.tail = node;
        }

        setTailOutput.call(this, this.tail);

        return reduceNode.output;
    };


    LinkedList.prototype.pop = function(){
        if (!this.head) return;

        var prev = this.head.prev;

        if (prev){
            sever(prev, this.head);
            this.head = prev;
            setHeadOutput.call(this, this.head);
        }
        else reset.call(this);
    };

    LinkedList.prototype.shift = function(){
        if (!this.tail) return;

        var next = this.tail.next;

        if (next){
            sever(this.tail, next);
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
        this.pivot = node;

        this.pivot.get().subscribe(this.offset);
        this.offset.set(this.offset.get());
    }

    function sever(node1, node2){
        node1.next = null;
        node2.prev = null;
        node2.get().unsubscribe(node1.get());
    }

    function connect(node1, node2, direction){
        node1.next = node2;
        node2.prev = node1;

        if (direction === 1)
            node2.get().subscribe(node1.get());
        else
            node1.get().subscribe(node2.get());
    }

    function setHeadOutput(head){
        this.headOutput.unsubscribe();
        this.headOutput.subscribe(head.get());
    }

    function setTailOutput(tail){
        this.tailOutput.unsubscribe();
        this.tailOutput.subscribe(tail.get());
    }

    module.exports = LinkedList;
});
