export * from './observeChildren.js'

export function epsilon(value: any) {
	return Math.abs(value) < 0.000001 ? 0 : value
}

export function toRadians(degrees: number): number {
	return (degrees / 180) * Math.PI
}

export function toDegrees(radians: number): number {
	return (radians / Math.PI) * 180
}
