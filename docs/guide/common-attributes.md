# Common Attributes

LUME's 3D elements share a common set of attributes with commonalities regarding
how their values can be set.

This doc details how the following attributes can be modified, but not what
their values actually mean. For their actual meaning, click on them to go to
their specific documentation:

[`rotation`](../api/core/Transformable#rotation),
[`position`](../api/core/Transformable#position),
[`scale`](../api/core/Transformable#scale),
[`origin`](../api/core/Transformable#origin),
[`align-point`](../api/core/Transformable#alignpoint),
[`mount-point`](../api/core/Transformable#mountpoint),
[`size`](../api/core/Sizeable#size),
[`size-mode`](../api/core/Sizeable#sizemode),
and [`opacity`](../api/core/Transformable#opacity).

All of them, except `opacity` (more on that below), accept three values
separated by space. For example,

```html
<lume-box position="20 30 40"></lume-box>
```

or optionally with a comma separator,

```html
<lume-box id="box" rotation="20, 30, 40"></lume-box>
```

The three values correspond to values for the X, Y, and Z axes.

It is easier to write three values with spaces in between, but the optional
commas are especially useful when an array is passed in because arrays coerced
to strings include commas. For example,

```html
<script>
	const box = document.getElementById('box')
	const rotation = [40, 50, 60]

	// This works because the array is coerced to the string "40, 50, 60".
	box.setAttribute('rotation', rotation)
</script>
```

The `opacity` attribute accepts a single value, for example,

```html
<lume-sphere opacity="0.5"></lume-sphere>
```

and has no relation to X, Y, or Z axes like the other attributes do.

All of them, except `opacity`, are backed by an
[`XYZValues`](../api/xyz-values/XYZValues.md) object. Their equivalently-named
(but camelCase) JavaScript property getters return the underlying `XYZValues`
object (or an object that extends from `XYZValues` such as
[`XYZNumberValues`](../api/xyz-values/XYZNumberValues)). For example,

```js
console.log(box.rotation instanceof LUME.XYZValues) // true
box.rotation.x = 90
box.rotation.y = 45
```

The setter for any of these can accept a string containing one to three values
for X, Y, and Z,

```js
box.rotation = '10 20 30'
```

an array with one to three values for X, Y, and Z,

```js
box.rotation = [10, 20, 30]
```

an object with optional `x`, `y`, and `z` properties,

```js
box.rotation = {x: 10, y: 20, z: 30}
```

or an instance of `XYZValues` (or subclass):

```js
const other = new XYZNumberValues(30, 20, 10)

box.rotation = other
```

**NOTE!** Setting a new value, even an `XYZValues` object, does _not_ replace the
underlying `XYZValues` object, but copies data to it. The getter always returns
the _same_ `XYZValues` instance. For example,

```js
const other = new XYZNumberValues(30, 20, 10)
box.rotation = other
console.log(box.rotation !== other) // true

const rotation = box.rotation
box.rotation = [40, 50, 60]
console.log(box.rotation === rotation) // true
console.log(box.rotation.y === 50) // true
```

Refer to each property's documentation to learn about the specific types of
`XYZValues` instances they have.

When a attribute or property is set with a string or an array, if the
list of values has one, two, or three values, then only the respective
coordinates of the underlying `XYZValues` object will be modified, in the order
x, y, z. For example,

```js
box.rotation = [20] // modifies only x
box.rotation = [20, 40] // modifies only x and y
box.rotation = [20, 40, 60] // modifies x, y, and z
```

Similarly, if an attribute or property is set with an object, if any of the `x`,
`y`, or `z` properties are missing then the respective values in the underlying
`XYZValues` object will not be modified. For example,

```js
box.scale = {y: 2} // modifies only y
box.size = {x: 300, z: 300} // modifies x and z
```

The `opacity` attribute's property stores a single value. For example,

```js
box.opacity = 0.5
console.log(typeof box.opacity) // "number"
```

and setting it of course changes the underlying value.
