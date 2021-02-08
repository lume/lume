export * from './DeclarativeBase'
export * from './HTMLNode'
export * from './HTMLScene'
// export HTMLPushPaneLayout from './HTMLPushPaneLayout'

import Scene from '../core/Scene'
import Node from '../core/Node'
import Mesh from '../core/Mesh'
import Box from '../core/Box'
import Sphere from '../core/Sphere'
import Plane from '../core/Plane'
import PointLight from '../core/PointLight'
import DOMNode from '../core/DOMNode'
import DOMPlane from '../core/DOMPlane'
import AmbientLight from '../core/AmbientLight'
import PerspectiveCamera from '../core/PerspectiveCamera'
import AutoLayoutNode from '../layout/AutoLayoutNode'
import ObjModel from '../core/ObjModel'
import GltfModel from '../core/GltfModel'
// import PushPaneLayout from '../components/PushPaneLayout'
import RoundedRectangle from '../core/RoundedRectangle'

export * from './behaviors'

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
		// PushPaneLayout,
		RoundedRectangle,
	]

	for (const constructor of classes) {
		if (!customElements.get(constructor.defaultElementName)) constructor.define()
	}
}
