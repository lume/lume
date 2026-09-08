import { AnyConstructor } from 'lowclass/dist/Constructor.js';
import type { TColor } from '../utils/three.js';
interface ColorfulOptions {
    path?: string | string[];
    failOnNonObject?: boolean;
}
/**
 * @class Colorful - This mixin class provides a `color` attribute and JS
 * property that maps to a Three.js sub-object with a color. This allow re-use
 * of a color attribute implementation and reactivity to avoid repetition.
 *
 * The Base class passed in must extend (i.e. this mixin is for use only on
 * classes that extend) from @lume/element's Element base class (the default if
 * no Base is specified), as this mixin relies on features for implementation.
 */
export declare function Colorful<T extends AnyConstructor>(Base?: T, { path, failOnNonObject }?: ColorfulOptions): {
    new (...a: any[]): {
        /**
         * @property {string | number | THREE.Color | [number, number, number]} color -
         *
         * `attribute`
         *
         * Default: `"white"`
         *
         * The color this element has.
         *
         * A string value can be any valid CSS color string, f.e. `"#ff6600"` or
         * `"rgb(10,20,30)"`.
         *
         * A number value should represent a hex color value, f.e. `0xff6600`.
         *
         * A tuple of three numbers represents a color as RGB with each value
         * between 0 and 1.
         *
         * A `THREE.Color` instance can be assigned, and it will replace any
         * pre-existing Color value upon assignment. Mutating the assigned
         * `THREE.Color` after assignment is non-reactive and will not update
         * rendering; assign the same value again to trigger reactivity to
         * update rendering, like so:
         *
         * ```js
         * el.color.set('blue') // not reactive, does not update rendering
         * el.color = el.color // trigger update to re-render
         * ```
         *
         * Setting a value other than a `THREE.Color` will update any underlying
         * `THREE.Color` object without re-creating it (only creating it
         * initially if it doesn't exist).
         */
        color: TColor;
        colorEffect(): void;
    };
} & T;
export {};
//# sourceMappingURL=Colorful.d.ts.map