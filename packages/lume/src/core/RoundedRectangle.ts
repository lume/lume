import {Mesh} from './Mesh'

export default class RoundedRectangle extends Mesh {
	static defaultElementName = 'i-rounded-rectangle'

	static defaultBehaviors = {
		'rounded-rectangle-geometry': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-material'))
		},
	}
}

export {RoundedRectangle}
