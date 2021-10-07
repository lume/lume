////////////////////////////////
// TODO replace the non-DRY code here with the same pattern as with the defineElements().
import {Scene} from './core/Scene.js'
import {Node} from './core/Node.js'
import {Mesh} from './meshes/Mesh.js'
import {Box} from './meshes/Box.js'
import {Sphere} from './meshes/Sphere.js'
import {Plane} from './meshes/Plane.js'
import {PointLight} from './lights/PointLight.js'
import {DirectionalLight} from './lights/DirectionalLight.js'
import {MixedPlane} from './meshes/MixedPlane.js'
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
		DirectionalLight,
		MixedPlane,
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
}
