import { XYZNumberValues } from './XYZNumberValues.js';
export class XYZNonNegativeValues extends XYZNumberValues {
    checkValue(prop, value) {
        if (!super.checkValue(prop, value))
            return false;
        if (value < 0)
            throw new TypeError(`Expected ${prop} not to be negative. Received: ${value}`);
        return true;
    }
}
//# sourceMappingURL=XYZNonNegativeValues.js.map