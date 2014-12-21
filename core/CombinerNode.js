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
            return this.nodes[0].getSize() || null;
        },
        render: function() {
            var result = [];
            for(var i = 0; i < this.nodes.length; i++)
                result.push(this.nodes[i].render());
            return result;
        }
    };

    module.exports = CombinerNode;
});
