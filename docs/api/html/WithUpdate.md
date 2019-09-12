
# <code>class <b>WithUpdate</b></code> :id=WithUpdate

Provides the reactivity system for the properties of subclasses.

## Properties




### <code>.<b>props</b>: any</code> :id=props

This is a convenience property for getting
the values of all reactive props at once, or for setting all or a
subset of all reactive props at once.

For example, to set `prop1` and `prop2` props at the same time, you can write:

```js
instance.props = {
  prop1: 'foo',
  prop2: 'bar',
}
```

To get all reactive prop values at once, without including non-reactive props, use

```js
instance.props
```

Otherwise, you can get or set each reactive prop on the instance directly, individually:

```js
instance.prop1 = 'foo'
instance.prop2 = 'bar'
console.log(instance.prop1, instance.prop2)
```
        






        