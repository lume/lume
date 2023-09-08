import { XYZValues } from './XYZValues.js';
export class XYZStringValues extends XYZValues {
    get default() {
        return { x: '', y: '', z: '' };
    }
    checkValue(prop, value) {
        if (!super.checkValue(prop, value))
            return false;
        if (value === undefined)
            return false;
        if (typeof value !== 'string')
            throw new TypeError(`Expected ${prop} to be a string. Received: ${value}`);
        return true;
    }
}
//# sourceMappingURL=XYZStringValues.js.map