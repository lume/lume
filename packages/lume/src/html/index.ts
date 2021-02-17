export * from './DeclarativeBase.js'
export * from './HTMLNode.js'
export * from './HTMLScene.js'
// export HTMLPushPaneLayout from './HTMLPushPaneLayout.js'

// TODO replace the non-DRY code here with the same pattern as with the defineElements() call below.
import Scene from '../core/Scene.js'
import Node from '../core/Node.js'
import Mesh from '../core/Mesh.js'
import Box from '../core/Box.js'
import Sphere from '../core/Sphere.js'
import Plane from '../core/Plane.js'
import PointLight from '../core/PointLight.js'
import DOMNode from '../core/DOMNode.js'
import DOMPlane from '../core/DOMPlane.js'
import AmbientLight from '../core/AmbientLight.js'
import PerspectiveCamera from '../core/PerspectiveCamera.js'
import AutoLayoutNode from '../layout/AutoLayoutNode.js'
import ObjModel from '../core/ObjModel.js'
import GltfModel from '../core/GltfModel.js'
import {ColladaModel} from '../core/ColladaModel.js'
// import PushPaneLayout from '../components/PushPaneLayout.js'
import RoundedRectangle from '../core/RoundedRectangle.js'

export * from './behaviors/index.js'

import {defineElements} from '../defineElements.js'

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

	for (const constructor of classes) {
		if (!customElements.get(constructor.defaultElementName)) constructor.define()
	}

	defineElements()
}
