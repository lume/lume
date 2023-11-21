import { XYZValues } from './XYZValues.js';
export class XYZStringValues extends XYZValues {
    get default() {
        return { x: '', y: '', z: '' };
    }
    checkValue(prop, value) {
        if (!super.checkValue(prop, value))
            return false;
        // this allows undefined values to be ignored. So we can for example do
        // things like v.fromObject({z: 123}) to set only z
        if (value === undefined)
            return false;
        if (typeof value !== 'string')
            throw new TypeError(`Expected ${prop} to be a string. Received: ${value}`);
        return true;
    }
}
//# sourceMappingURL=XYZStringValues.js.map