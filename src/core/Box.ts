import Mesh from './Mesh'

export default class Box extends Mesh {
	static defaultElementName = 'i-box'

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
