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
        render: function(size) {
            var result = [];
            for(var i = 0; i < this.nodes.length; i++)
                result.push(this.nodes[i].render(size));
            return result;
        }
    };

    module.exports = CombinerNode;
});
