/*
 * copyright © 2015 David Valdman
 */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    function CombinerNode(nodes) {
        this.nodes = nodes || [];

        this._dirty = true;
        this._dirtyLock = 0;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
        this._eventInput.bindThis(this);

        this._eventInput.on('dirty', function(){
            if (!this._dirty) {
                this._dirty = true;
                this._eventOutput.emit('dirty');
            }
            this._dirtyLock++;
        });

        this._eventInput.on('clean', function(){
            this._dirtyLock--;
            if (this._dirty && this._dirtyLock == 0) {
                this._dirty = false;
                this._eventOutput.emit('clean');
            }
        });
    }

    CombinerNode.prototype = {
        add: function(node) {
            this._eventInput.subscribe(node);
            this.nodes.push(node);
            return node;
        },
        get: function(){
            return null;
        },
        getSize : function(){
            //TODO: aggregate sizes of children
            return null;
        },
        clean : function(){
            if (this._dirty && this._dirtyLock == 0) {
                this._dirty = false;
            }
        },
        render: function() {
            for(var i = 0; i < this.nodes.length; i++){
                var node = this.nodes[i];
                node.render.apply(node, arguments);
            }
            this.clean();
        },
        commit: function() {
            for(var i = 0; i < this.nodes.length; i++){
                var node = this.nodes[i];
                node.commit.apply(node, arguments);
            }
        }
    };

    module.exports = CombinerNode;
});
