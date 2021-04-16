import XYZValues from './XYZValues.js'

export class XYZAnyValues extends XYZValues<any> {
	get default() {
		return {x: undefined, y: undefined, z: undefined}
	}
}

export default XYZAnyValues
