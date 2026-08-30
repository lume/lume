import type { Element3D } from '../Element3D';
import type { Scene } from '../Scene';
import type { Sizeable } from '../Sizeable';
export declare const isScene: (el: (Node & {
    isScene?: boolean;
}) | null) => el is Scene;
export declare const isElement3D: (el: (Node & {
    isElement3D?: boolean;
}) | null) => el is Element3D;
export declare const isSizeable: (el: (Node & {
    isSizeable?: boolean;
}) | null) => el is Sizeable;
export declare const isDomEnvironment: () => boolean;
//# sourceMappingURL=isThisOrThat.d.ts.map