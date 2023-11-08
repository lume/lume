import { XYZValues } from './XYZValues.js';
export class XYZNumberValues extends XYZValues {
    get default() {
        return { x: 0, y: 0, z: 0 };
    }
    deserializeValue(_prop, value) {
        return Number(value);
    }
    checkValue(prop, value) {
        if (!super.checkValue(prop, value))
            return false;
        if (value === undefined)
            return false;
        if (!(typeof value === 'number') || isNaN(value) || !isFinite(value))
            throw new TypeError(`Expected ${prop} to be a finite number. Received: ${value}`);
        return true;
    }
}
//# sourceMappingURL=XYZNumberValues.js.map