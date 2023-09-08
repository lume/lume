import { XYZStringValues } from './XYZStringValues.js';
export class XYZSizeModeValues extends XYZStringValues {
    get default() {
        return { x: 'literal', y: 'literal', z: 'literal' };
    }
    get allowedValues() {
        return ['literal', 'l', 'proportional', 'p'];
    }
    checkValue(prop, value) {
        if (!super.checkValue(prop, value))
            return false;
        if (!this.allowedValues.includes(value))
            throw new TypeError(`Expected ${prop} to be one of 'literal' ('l' for short) or 'proportional' ('p' for short). Received: '${value}'`);
        return true;
    }
}
//# sourceMappingURL=XYZSizeModeValues.js.map