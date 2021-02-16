import Mesh from './Mesh.js'

export default class Plane extends Mesh {
	static defaultElementName = 'lume-plane'

	static defaultBehaviors = {
		'plane-geometry': (initialBehaviors: string[]) => {
			return !initialBehaviors.some(b => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: string[]) => {
			return !initialBehaviors.some(b => b.endsWith('-material'))
		},
	}
}

export {Plane}
