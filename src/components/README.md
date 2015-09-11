## Components

### What is it?

Node simply forms part of a hierarchical structure, they can't
do very much on their on.  Hence, we extend nodes with components,
that add specific properties and behaviours to it.  These can be:

* Size, Position
* DOMElement, Mesh

### Usage

```js
var node = Node.instance();
var size = SizeComponent.instance();
node.addComponent(size);
```

```js
var node = Node.instance();

var size = SizeComponent.instance().attachTo(node);
size === node.components.size;  // created automatically
```

```js
var node = Node.instance();
SizeComponent.instance().attachTo(node);
node.size.setAbsolute(...);
```

```js
var node = Node.instance();
node.addComponents(SizeComponent, PositionComponent);
node.size.setAbsolute(...);
```


### Architecture

Components

* have (private) **properties** for options and final calculated values
* have (public) **setters** for options, and getters for pre-calculated values
* have an `update()` method to calculate values - that depend on
  options and other components - that is called at most, once per frame.
* have a `requestUpdate()` method, to be called by setters if a value
  (that is used for calculations) changes.
* can `observe(anotherComponent)` to have it's `update()` method called
  on `anotherComponent.update()`.

For a documented example, see [SizeComponent.js](SizeComponent.js).

### Differences from traditional Entity-Component-System [1]

In the traditional model, the component is not responsible for
updates / final calculation.  This is handled by the system,
which iterates over every component of that type.

So we can either cache values and still loop over everything
or use an observer pattern [2] to track dependencies.  I
went for the latter.

Beyond that, it seemed more natural to have one nice base
class that could be extended with all related logic in a
single file.  i.e. no SizeComponent AND SizeSystem.

[1] https://en.wikipedia.org/wiki/Entity_component_system
[2] https://en.wikipedia.org/wiki/Observer_pattern