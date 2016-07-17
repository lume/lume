/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module) {
    var Stream = require('./Stream');
    var SimpleStream = require('./SimpleStream');
    var Observable = require('./Observable');
    var EventHandler = require('../events/EventHandler');

    function ReduceNode(reducer, stream, extras){
        this._input = new SimpleStream();

        var sources = [this._input, stream];
        if (extras) sources = sources.concat(extras);

        this._output = Stream.lift(reducer, sources);

        this.output = new SimpleStream();

        this.stream = stream;

        EventHandler.setInputHandler(this, this._input);
        EventHandler.setOutputHandler(this, this._output);
    }

    ReduceNode.prototype.setMap = function(map){
        this._output.setMap(map);
    };

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

    Node.prototype.is = function(stream){
        return this.get().stream === stream;
    };

    function LinkedList(reducer, offset, extras){
        this.reducer = reducer;
        this.prevReducer = function(){
            if (arguments[1] === undefined) return false;
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
        reduceNode.output.subscribe(reduceNode._input);

        var node = new Node(reduceNode);

        if (this.head === null) {
            createFirstNode.call(this, node);
            setTailOutput.call(this, this.tail);
        }
        else {
            if (this.head === this.pivot){
                this.head.next = node;
                node.prev = this.head;

                node.get().subscribe(this.pivot.get());
                this.offset.set(this.offset.get());
            }
            else
                connect(this.head, node, 1);
            this.head = node;
        }

        setHeadOutput.call(this, this.head);

        return reduceNode.output;
    };

    LinkedList.prototype.unshift = function(stream){
        var reduceNode = new ReduceNode(this.prevReducer, stream, this.extras);
        reduceNode.output.subscribe(reduceNode._output);

        var node = new Node(reduceNode);

        if (this.tail === null) {
            createFirstNode.call(this, node);
            setHeadOutput.call(this, this.head);
        }
        else {
            if (this.tail === this.pivot){
                node.next = this.tail;
                this.tail.prev = node;

                node.get().subscribe(this.pivot.get().output);
                this.offset.set(this.offset.get());
            }
            else
                connect(node, this.tail, -1);
            this.tail = node;
        }

        setTailOutput.call(this, this.tail);

        return reduceNode.output;
    };


    LinkedList.prototype.pop = function(){
        if (!this.head) return;

        var prev = this.head.prev;

        if (prev){
            if (this.head === this.pivot){
                setNewPivot.call(this, prev);
            }

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
            if (this.tail === this.pivot){
                setNewPivot.call(this, next);
            }

            sever(this.tail, next);
            this.tail = next;
            setTailOutput.call(this, this.tail);
        }
        else reset.call(this);
    };

    LinkedList.prototype.setPivot = function(stream){
        var prevPivot = this.pivot;
        if (!prevPivot || prevPivot.is(stream)) return;

        var prev = prevPivot.prev;
        var next = prevPivot.next;

        var found = false;
        var newPivot;

        while (!found && (prev || next)){
            if (prev){
                if (prev.is(stream)){
                    found = true;
                    newPivot = prev;
                }
                else {
                    prev = prev.prev;
                }
            }

            if (next){
                if (next.is(stream)){
                    found = true;
                    newPivot = next;
                }
                else {
                    next = next.next;
                }
            }
        }

        // iterate between old and new pivots
        if (found){
            prevPivot.get().unsubscribe(this.offset);
            var curr = prevPivot;

            // new pivot is ahead of previous pivot
            if (newPivot === next){
                while (curr !== newPivot){
                    curr.get().setMap(this.prevReducer);
                    curr.get().output.unsubscribe();
                    curr.get().output.subscribe(curr.get()._output);

                    curr.next.get().unsubscribe(curr.get());

                    if (curr.next === newPivot){
                        curr.get().subscribe(newPivot.get()._input);
                    }
                    else {
                        curr.get().subscribe(curr.next.get());
                    }

                    curr = curr.next;
                }
            }
            else {
                // new pivot is behind previous pivot
                while (curr !== newPivot) {
                    curr.get().setMap(this.reducer);
                    curr.get().output.unsubscribe();
                    curr.get().output.subscribe(curr.get()._input);

                    curr.prev.get().unsubscribe(curr.get());
                    curr.get().subscribe(curr.prev.get());

                    curr = curr.prev;
                }
            }

            setNewPivot.call(this, newPivot);
        }
    };

    function reset(){
        this.head = null;
        this.tail = null;

        this.headOutput.unsubscribe();
        this.headOutput.subscribe(this.offset);
    }

    function setNewPivot(node){
        this.pivot = node;
        node.get().unsubscribe();
        this.pivot.get().subscribe(this.offset);
        this.offset.set(this.offset.get());
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
