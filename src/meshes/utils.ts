import {stringToArray} from '../xyz-values/utils.js'

export function stringToNumberArray(v: number[] | string, prop: string): number[] {
	if (typeof v === 'string') {
		// Deserialize an attribute string like "12 23 34, 23 34 45, 56 34 12"
		v = stringToArray(v).map(str => parseFloat(str))
	}

	// @prod-prune
	for (let i = 0, l = v.length; i < l; i += 1) {
		if (isNaN(v[i])) throw new TypeError(`Array for property "${prop}" should have numbers only.`)
	}

	return v
}
