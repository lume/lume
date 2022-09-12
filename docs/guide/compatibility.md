# Compatibility

This doc describes how to use LUME elements with various frameworks and libraries other than LUME's own.

We recommend trying out [LUME Element](https://github.com/lume/element), LUME's own component system. However you can use LUME's HTML elements with any DOM manipulation libraries or frameworks that you wish.

## React JavaScript

To import and use LUME elements in your (JavaScript) React project, enable the LUME elements with
their default element names.

```tsx
import {defineElements} from 'lume'
defineElements()
```

Then import your React stuff as usual and use the elements in your JSX markup:

```jsx
import {useRef, useEffect} from 'react'

function MyReactComponent() {
	const boxRef = useRef(null)

	useEffect(() => {
		const box = boxRef.current

		console.log(box) // the <lume-box> element instance

		// Give it a simple rotation animation.
		box.rotation = (x, y, z) => [++x, ++y, ++z]
	})

	return (
		<lume-scene webgl>
			<lume-point-light position="20 -20 20" />
			<lume-perspective-camera position="0 0 20" active />
			<lume-box size="10 10 10" mount-point="0.5 0.5 0.5" ref={boxRef} />
		</lume-scene>
	)
}

ReactDOM.render(<MyReactComponent />, document.body)
```

### Limitations

- Props accept only strings or booleans.
  - Unlike other frameworks, React is behind the times when it comes to Custom Elements, and only supports passing strings or booleans to custom element attributes. This means passing dynamic values like functions, arrays, or objects will not be possible, and instead you'll need to use a `ref` and set JS properties manually.
  - If you do attempt to pass anything other than a boolean or string to a custom element attribute, React will coerce it into a string regardless.
  - To work around this issue, instead of writing `<lume-element3d rotation={(x, y, z) => [x, ++y, z]} />` you would need to write something like `<lume-element3d ref={nodeRef} />` along with `nodeRef.current.rotation = (x, y, z) => [x, ++y, z]` inside of `componentDidMount` (for class components) or `useEffect` (for function components with Hooks).
- Due to the previous bullet point, this has a (usually insignificant) performance implication.
  - Because React always passes prop values to custom elements as strings, LUME will always be converting the strings into number values.
  - _In most cases, this will not result in a noticeable performance hit._ But if you do run into a case where things slow down due to this, this is good to keep in mind.
  - Workaround: Modifying an element reference directly like `nodeRef.current.position.x = xPosition` will always be faster than `` <lume-element3d position={`0 ${xPosition} 0`} /> ``. In the former, the number will be passed directly to the element without any coercion.

### Example

Take the [react](https://github.com/lume/lume/tree/develop/examples/react) example for a spin.

## React TypeScript

This expands on the ideas of the previous "React JavaScript" section.

LUME's HTML elements come with type definitions for TypeScript projects, but
they aren't perfect yet (help wanted!).

To import and use LUME elements with their type definitions in your
TypeScript-React project, first enable the LUME elements with their default
element names. Here we also import the `Box` class for use as a type argument
with `useRef` further below:

```tsx
import {defineElements, Box} from 'lume'
defineElements()
```

Then import the React JSX type definitions for the elements:

```tsx
import type {} from 'lume/dist/index.react-jsx'
```

Finally, import your React stuff as usual and use the elements in your JSX markup:

```tsx
import {useRef, useEffect} from 'react'

function MyReactComponent() {
	const boxRef = useRef<Box>(null)

	useEffect(() => {
		const box = boxRef.current

		console.log(box) // the <lume-box> element instance

		// Give it a simple rotation animation.
		box.rotation = (x, y, z) => [++x, ++y, ++z]
	})

	return (
		<lume-scene webgl>
			<lume-point-light position="20 -20 20" />
			<lume-perspective-camera position="0 0 20" active />
			<lume-box
				size="10 10 10"
				mount-point="0.5 0.5 0.5"
				// @ts-ignore
				ref={boxRef}
			/>
		</lume-scene>
	)
}

ReactDOM.render(<MyReactComponent />, document.body)
```

### Limitations

- The same limitations regarding string and boolean props mentioned in the previous "Limitations" subsection of the "React JavaScript" section apply here too.
  - Likewise, all props are of type `string | undefined` or `boolean | string | undefined`.
- At the moment `ref={}` props may have type errors. Just put `@ts-ignore` on them if they do, for now. Help wanted!
- `skipLibCheck` currently needs to be set to `true` in `tsconfig.json` to work around a few issues with TypeScript's declaration output (see the [react-typescript](https://github.com/lume/lume/tree/develop/examples/react-typescript) example). Help wanted!

### Example

Take the [react-typescript](https://github.com/lume/lume/tree/develop/examples/react-typescript) example for a spin.
