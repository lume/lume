
# <code>class <b>TreeNode</b> extends [WithUpdate](../html/WithUpdate.md)</code> :id=TreeNode

The `TreeNode` class represents objects that are connected
to each other in parent-child relationships in a tree structure. A parent
can have multiple children, and a child can have only one parent. Inherits from [WithUpdate](../html/WithUpdate)

## Properties

Inherits properties from [WithUpdate](../html/WithUpdate.md).


### <code>.<b>parent</b>: TreeNode</code> :id=parent

The parent of the current TreeNode.
Each node in a tree can have only one parent.
        


### <code>.<b>subnodes</b>: TreeNode[]</code> :id=subnodes

An array of this TreeNode's
children. This returns a clone of the internal child array, so
modifying the cloned array directly does not effect the state of the
TreeNode. Use [TreeNode.add(child)](#addchild) and
[TreeNode.removeNode(child)](#removenode) to modify a TreeNode's
list of children.
This is named `subnodes` to avoid conflict with HTML's Element.children property.
        

## Methods

Inherits methods from [WithUpdate](../html/WithUpdate.md).


### <code>.<b>add</b>(): this</code> :id=add

Add a child node to this TreeNode.
        


### <code>.<b>removeNode</b>(): this</code> :id=removeNode

Remove a child node from this node.
        
        