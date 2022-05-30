CONTINUE there's a bug that breaks fitment

/**
 * Returns the scale to apply to an object so that it fits within a container
 * (based on the provided size of the object and the container) according to the
 * desired fitment, the same as CSS object-fit.
 */
export function getFitmentScale(
	fitment: Fitment,
	shapeSize: XYValues,
	containerSize: XYValues,
	scale: XYValues = {x: 0, y: 0},
) {
	scale.x = shapeSize.x / containerSize.x
	scale.y = shapeSize.y / containerSize.y

	if (fitment === 'fill') {
		scale.x = 1 / scale.x
		scale.y = 1 / scale.y
		return scale
	}

	const shapeAspect = shapeSize.x / shapeSize.y
	const sizeAspect = containerSize.x / containerSize.y

	if (fitment === 'contain') {
		// tall
		if (shapeAspect < sizeAspect) {
			scale.x = 1 / scale.y
			scale.y = 1 / scale.y
		}
		// wide (or equal)
		else {
			scale.x = 1 / scale.x
			scale.y = 1 / scale.x
		}
	} else if (fitment === 'cover') {
		// tall
		if (shapeAspect < sizeAspect) {
			scale.x = 1 / scale.x
			scale.y = 1 / scale.x
		}
		// wide (or equal)
		else {
			scale.x = 1 / scale.y
			scale.y = 1 / scale.y
		}
	} else if (fitment === 'scale-down') {
		if (shapeSize.x > containerSize.x || shapeSize.y > containerSize.y) {
			// tall
			if (shapeAspect < sizeAspect) {
				scale.x = 1 / scale.y
				scale.y = 1 / scale.y
			}
			// wide (or equal)
			else {
				scale.x = 1 / scale.x
				scale.y = 1 / scale.x
			}
		} else {
			scale.x = 1
			scale.y = 1
		}
	}

	return scale
}

export type Fitment = 'fill' | 'contain' | 'cover' | 'scale-down'

export interface XYValues {
	x: number
	y: number
}
