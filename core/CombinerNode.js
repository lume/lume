/*
 * copyright © 2015 David Valdman
 */

define(function(require, exports, module) {

    function CombinerNode(nodes) {
        this.nodes = nodes || [];
    }

    CombinerNode.prototype = {
        add: function(node) {
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
        render: function() {
            for(var i = 0; i < this.nodes.length; i++){
                var node = this.nodes[i];
                node.render.apply(node, arguments);
            }
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
