import type { Object3D } from 'three/src/Three';
/**
 * Converts a tree of Three.js objects to a tree of Lume elements.
 *
 * NOTE: Experimental. Not very feature complete yet.
 *
 * Three.js `Object3D` objects get mapped into `<lume-element3d>` elements, with
 * the coordinate system converted into Lume's coordinate system. F.e. +Y values
 * in Three.js are -Y values in Lume, etc.
 *
 * Three.js `Mesh` objects get mapped into `<lume-mesh>` elements, with the same
 * coordinate system mapping for `Object3D`, with the geometry cloned onto
 * element.three.geometry, without a geometry behavior, and with a
 * `projected-material` behavior.
 *
 * In the future, we'll support more types of objects, we'll map properties from
 * the three material to our material behavior, and map the three geometry to a
 * geometry behavior.
 *
 * In practice this currently at least gets us to a state where all the objects
 * in a Three.js tree map to a tree of Lume elements so that each piece can be
 * easily moved around in Lume space or composed with any other Lume elements,
 * but otherwise geometry attributes are not currently available, and material
 * attributes are available but with default values not from the loaded model
 * (TODO).
 */
export declare function threeToLume(three: Object3D): import("../../index.js").Element3D;
//# sourceMappingURL=threeToLume.d.ts.map