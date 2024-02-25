import { Motor } from './Motor.js';
import { XYZSizeModeValues } from '../xyz-values/XYZSizeModeValues.js';
import { XYZNonNegativeValues } from '../xyz-values/XYZNonNegativeValues.js';
const isInstance = Symbol();
/**
 * @mixin - TODO make this @mixin tag do something in the docs.
 * @class PropertyAnimator - This is a utility mixin class to make some Lume
 * element properties animatable when provided a function. This allows animation
 * of some properties like so:
 *
 * ```js
 * const box = document.querySelector('lume-box')
 * box.rotation = (x, y, z, t, dt) => [x, ++y, z]
 * box.opacity = (opacity, t, dt) => opacity - 0.01
 * ```
 *
 * Currently it is only for any XYZValues properties (for example `position`, `rotation`, etc), or `opacity`.
 *
 * For an `XYZValues` property, the function accepts the current x, y, z, time,
 * and deltaTime values for the current frame, and should return the new desired
 * values.
 *
 * For `opacity` it is similar, but the function accepts a opacity, time, and
 * deltaTime, and should return the new desired opacity.
 */
export function PropertyAnimator(Base = Object) {
    class PropertyAnimator extends Base {
        // @ts-ignore, prevent downstream "has or is using private name" errors.
        [isInstance] = true;
        _setPropertyXYZ(name, xyz, newValue) {
            // @ts-ignore
            if (newValue === xyz)
                return;
            if (isXYZPropertyFunction(newValue)) {
                this.#handleXYZPropertyFunction(newValue, name, xyz);
            }
            else {
                if (!this.#settingValueFromPropFunction)
                    this.#removePropertyFunction(name);
                else
                    this.#settingValueFromPropFunction = false;
                xyz.from(newValue);
            }
        }
        _setPropertySingle(name, setter, newValue) {
            if (isSinglePropertyFunction(newValue)) {
                this.#handleSinglePropertyFunction(newValue, name);
            }
            else {
                if (!this.#settingValueFromPropFunction)
                    this.#removePropertyFunction(name);
                else
                    this.#settingValueFromPropFunction = false;
                setter(newValue); // FIXME no any
            }
        }
        #propertyFunctions = null;
        #settingValueFromPropFunction = false;
        #handleXYZPropertyFunction(fn, name, xyz) {
            if (!this.#propertyFunctions)
                this.#propertyFunctions = new Map();
            const propFunction = this.#propertyFunctions.get(name);
            if (propFunction)
                Motor.removeRenderTask(propFunction);
            this.#propertyFunctions.set(name, Motor.addRenderTask((time, deltaTime) => {
                const result = fn(xyz.x, xyz.y, xyz.z, time, deltaTime);
                if (result === false) {
                    this.#propertyFunctions.delete(name);
                    return false;
                }
                this.#settingValueFromPropFunction = true;
                xyz.from(result);
                return;
            }));
        }
        #handleSinglePropertyFunction(fn, name) {
            if (!this.#propertyFunctions)
                this.#propertyFunctions = new Map();
            const propFunction = this.#propertyFunctions.get(name);
            if (propFunction)
                Motor.removeRenderTask(propFunction);
            this.#propertyFunctions.set(name, Motor.addRenderTask(time => {
                const result = fn(this[name], time);
                if (result === false) {
                    this.#propertyFunctions.delete(name);
                    return false;
                }
                this.#settingValueFromPropFunction = true;
                this[name] = result;
                // TODO The RenderTask return type is `false | void`, so why
                // does the noImplicitReturns TS option require a return
                // here? Open bug on TypeScript.
                return;
            }));
        }
        // remove property function (render task) if any.
        #removePropertyFunction(name) {
            if (!this.#propertyFunctions)
                return;
            const propFunction = this.#propertyFunctions.get(name);
            if (propFunction) {
                Motor.removeRenderTask(propFunction);
                this.#propertyFunctions.delete(name);
                if (!this.#propertyFunctions.size)
                    this.#propertyFunctions = null;
            }
        }
        removeAllPropertyFunctions() {
            console.log('remove all property functions');
            if (this.#propertyFunctions)
                for (const [name] of this.#propertyFunctions)
                    this.#removePropertyFunction(name);
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            this.removeAllPropertyFunctions();
        }
    }
    PropertyAnimator.prototype[isInstance] = true;
    return PropertyAnimator;
}
Object.defineProperty(PropertyAnimator, Symbol.hasInstance, {
    value(obj) {
        if (!obj)
            return false;
        if (obj[isInstance])
            return true;
        return false;
    },
});
// the following type guards are used above just to satisfy the type system,
// though the actual runtime check does not guarantee that the functions are of
// the expected shape.
function isXYZPropertyFunction(f) {
    return typeof f === 'function';
}
function isSinglePropertyFunction(f) {
    return typeof f === 'function';
}
//# sourceMappingURL=PropertyAnimator.js.map