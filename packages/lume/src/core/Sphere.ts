import Mesh from './Mesh.js'

export default class Sphere extends Mesh {
	static defaultElementName = 'lume-sphere'

	static defaultBehaviors = {
		'sphere-geometry': (initialBehaviors: string[]) => {
			return !initialBehaviors.some(b => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: string[]) => {
			return !initialBehaviors.some(b => b.endsWith('-material'))
		},
	}
}

export {Sphere}
