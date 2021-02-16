import Mesh from './Mesh.js'

export default class Box extends Mesh {
	static defaultElementName = 'lume-box'

	static defaultBehaviors = {
		'box-geometry': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-material'))
		},
	}
}

export {Box}
