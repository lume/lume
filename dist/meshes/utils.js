import { stringToArray } from '../xyz-values/utils.js';
export function stringToNumberArray(v, prop) {
    if (typeof v === 'string') {
        v = stringToArray(v).map(str => parseFloat(str));
    }
    for (let i = 0, l = v.length; i < l; i += 1) {
        if (isNaN(v[i]))
            throw new TypeError(`Array for property "${prop}" should have numbers only.`);
    }
    return v;
}
//# sourceMappingURL=utils.js.map