import type {Quaternion} from 'three/src/math/Quaternion.js'

export function quaternionApproximateEquals(a: Quaternion, b: Quaternion, epsilon: number) {
	return (
		Math.abs(a.x - b.x) < epsilon &&
		Math.abs(a.y - b.y) < epsilon &&
		Math.abs(a.z - b.z) < epsilon &&
		Math.abs(a.w - b.w) < epsilon
	)
}
