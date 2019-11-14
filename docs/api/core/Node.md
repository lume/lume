
# <code>class <b>Node</b> extends [ImperativeBase](/ImperativeBase.md), [HTMLNode](../html/HTMLNode.md)</code> :id=Node

All objects in a 3D scene are an instance of Node. In other
words, the classes for anything that will be in a 3D scene are subclasses of
this class. Node contains the basics that all objects in a 3D scene need,
for example a transform (position, rotation, scale, etc) and a size.

Instances of Node can be used for simple CSS
rendering by placing HTML content inside of them, for example:

<div id="example1"></div>
<script type="application/javascript">
  new Vue({
    el: '#example1',
    template: '<code-vue :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`<script src="${location.origin}/infamous.js"><\/script>

<i-scene>
  <i-node
    id="container"
    size="100 100"
    position="100 100"
  >
    Hello 3D World!
  </i-node>
</i-scene>

<style>
  html, body {
    margin: 0; padding: 0;
    height: 100%; width: 100%;
  }
  i-scene { background: #333 }
  i-node { background: royalblue }
</style>

<script>
  infamous.useDefaultNames()
  container.rotation = (x, y, z) => [x, ++y, z]
<\/script>
`
    },
  })
</script>

Nodes can also be used as non-rendered parents that apply transforms to
their children. Here's an [example](/examples/hello3d-parent-transforms).

Other classes that extend from Node may create [layouts](/examples/autolayout-declarative), or
may render [WebGL content](/examples/material-texture), etc.



Inherits properties from [ImperativeBase](/ImperativeBase.md), [HTMLNode](../html/HTMLNode.md).



## Methods

Inherits methods from [ImperativeBase](/ImperativeBase.md), [HTMLNode](../html/HTMLNode.md).


### <code>.<b>constructor</b>(): void</code> :id=constructor

Create a Node instance with the given `props`.

Each option maps to a property on the instance. For example, writing

```js
var node = new Node({
  size: {x:100, y:100, z:100},
  rotation: {x:30, y:20, z:25}
})
```

is the same as writing

```js
var node = new Node()
node.size = {x:100, y:100, z:100}
node.rotation = {x:30, y:20, z:25}
```

The `props` property inherited from
[`WithUpdate`](../html/WithUpdate) also works for setting multiple
properties at once:

```js
var node = new Node()
node.props = {
  size: {x:100, y:100, z:100},
  rotation: {x:30, y:20, z:25}
}
```
        
        