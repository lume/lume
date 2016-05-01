/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module) {
    var ResizeStream = require('./ResizeStream');
    var EventHandler = require('../events/EventHandler');

    function SizeArray(reducer, value) {
        this.reducer = reducer;
        this.prev = null;
        this.next = null;

        this.output = null;

        if (value) {
            this.value = value;
            this.input = new EventHandler();
            this.output = ResizeStream.lift(this.reducer, [this.input, this.value]);
        }
        else this.value = null;
    }

    SizeArray.prototype = Object.create(ResizeStream.prototype);
    SizeArray.prototype.constructor = SizeArray;

    SizeArray.prototype.addStream = function(stream) {
        var node = this;
        var sizeArray;

        while (node.next) {
            node = node.next;
        }

        if (node === this && this.value === null) {
            this.output = stream.map(function() {
                return 0;
            }.bind(this));

            sizeArray = new SizeArray(this.reducer, stream);
            sizeArray.prev = this;
            node.next = sizeArray;

            sizeArray.input.subscribe(this.output);
            return node.output
        }
        else {
            sizeArray = new SizeArray(this.reducer, stream);
            sizeArray.prev = node;
            node.next = sizeArray;

            sizeArray.input.subscribe(node.output);
            return node.output;
        }
    };

    SizeArray.prototype.removeStream = function(stream) {
        var node = this;
        while (node.next && node.next.value !== stream)
            node = node.next;

        if (node.next !== null) {
            var curr = node.next;
            var prev = curr.prev;
            var next = curr.next;

            if (next) {
                next.input.unsubscribe(curr.output);
                next.input.subscribe(prev.output);
                prev.next = next;
                next.prev = prev;
            }

            curr = null;
        }
    };

    SizeArray.prototype.insertAfterStream = function(target, stream) {
        var node = this;
        while (node.next && node.next.value !== stream)
            node = node.next;

        if (node.next !== null) {
            var curr = node.next;
            var next = curr.next;
            var newNode = new SizeArray(this.reducer, stream);
            curr.next = newNode;
            newNode.prev = curr;

            if (next) {
                next.prev = newNode;
                newNode.next = next;
            }
        }
    };
    module.exports = SizeArray;
}); 
