import * as elementClasses from './index.js'

import type {Element} from '@lume/element'

export function defineElements() {
	for (const key in elementClasses) {
		const ElementClass = (elementClasses as any)[key] as typeof Element | undefined
		if (ElementClass?.elementName) ElementClass?.defineElement?.()
	}
}

////////////////////////////////
// TODO replace the non-DRY code here with the same pattern as with the defineElements() call below.
import {Scene} from './core/Scene.js'
import {Node} from './core/Node.js'
import {Mesh} from './meshes/Mesh.js'
import {Box} from './meshes/Box.js'
import {Sphere} from './meshes/Sphere.js'
import {Plane} from './meshes/Plane.js'
import {PointLight} from './lights/PointLight.js'
import {DOMNode} from './meshes/DOMNode.js'
import {DOMPlane} from './meshes/DOMPlane.js'
import {AmbientLight} from './lights/AmbientLight.js'
import {PerspectiveCamera} from './cameras/PerspectiveCamera.js'
import {AutoLayoutNode} from './layouts/AutoLayoutNode.js'
import {ObjModel} from './models/ObjModel.js'
import {GltfModel} from './models/GltfModel.js'
import {ColladaModel} from './models/ColladaModel.js'
// import {PushPaneLayout} from './components/PushPaneLayout.js'
import {RoundedRectangle} from './meshes/RoundedRectangle.js'

export function useDefaultNames() {
	const classes = [
		Scene,
		Node,
		Mesh,
		Box,
		Sphere,
		Plane,
		PointLight,
		DOMNode,
		DOMPlane,
		AmbientLight,
		PerspectiveCamera,
		AutoLayoutNode,
		ObjModel,
		GltfModel,
		ColladaModel,
		// PushPaneLayout,
		RoundedRectangle,
	]

	// The old way.
	for (const constructor of classes) {
		if (!customElements.get(constructor.defaultElementName)) constructor.define()
	}

	// The new way.
	defineElements()

	// TODO convert everything to the new way.
}
