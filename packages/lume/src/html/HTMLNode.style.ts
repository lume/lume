export default {
	// All items of the scene graph are hidden until they are mounted in a scene
	// (this changes to `display:block`).
	// This gets toggled between "none" and "block" by ImperativeBase depending
	// on if CSS rendering is enabled.
	display: 'none',

	boxSizing: 'border-box',
	position: 'absolute',
	top: 0,
	left: 0,

	// Defaults to [0.5,0.5,0.5] (the Z axis doesn't apply for DOM elements,
	// but will for 3D objects in WebGL.)
	transformOrigin: '50% 50% 0', // default

	transformStyle: 'preserve-3d',
}
