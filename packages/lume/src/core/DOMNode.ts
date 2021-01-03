import Mesh from './Mesh'

/** See DOMNodeGeometryBehavior and DOMNodeMaterialBehavior for available properties. */
export default class DOMNode extends Mesh {
	static defaultElementName = 'lume-dom-node'

	static defaultBehaviors = {
		'domnode-geometry': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
		},
		'domnode-material': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-material'))
		},
	}

	get isDOMNode() {
		return true
	}
}

export {DOMNode}
