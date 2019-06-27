import XYZValues from './XYZValues'

export class XYZAnyValues extends XYZValues<any> {
    protected get default() {
        return {x: undefined, y: undefined, z: undefined}
    }
}

export default XYZAnyValues
