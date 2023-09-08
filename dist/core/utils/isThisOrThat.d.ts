import type { Element3D } from '../Element3D';
import type { Scene } from '../Scene';
export declare const isScene: (el: Node & {
    isScene?: boolean;
}) => el is Scene;
export declare const isElement3D: (el: Node & {
    isElement3D?: boolean;
}) => el is Element3D;
export declare const isDomEnvironment: () => boolean;
//# sourceMappingURL=isThisOrThat.d.ts.map