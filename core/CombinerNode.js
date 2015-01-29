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
            return null;
        },
        render: function(context) {
            for(var i = 0; i < this.nodes.length; i++)
                this.nodes[i].render(context);
        }
    };

    module.exports = CombinerNode;
});
