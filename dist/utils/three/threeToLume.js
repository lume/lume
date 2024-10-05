import { Vector3 } from 'three/src/math/Vector3.js';
import { radToDeg } from 'three/src/math/MathUtils.js';
import { isMesh } from './is.js';
import { setBehaviors } from '../../behaviors/InitialBehaviors.js';
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
export function threeToLume(three) {
    /** @type {HTMLElement} */
    let el;
    if (isMesh(three)) {
        el = document.createElement('lume-mesh');
        const newGeometry = three.geometry.clone();
        // move geometry center to local origin
        newGeometry.computeBoundingBox();
        const box = newGeometry.boundingBox;
        const center = new Vector3();
        box.getCenter(center);
        newGeometry.center();
        // move lume element to the previous geometry center instead (Y is down in Lume)
        el.position.set(center.x, -center.y, center.z);
        el.mountPoint.set(0.5, 0.5, 0.5);
        // give the Lume element the same size as the geometry
        // box, useful for seeing the hover reticle in devtools
        // element inspector
        const size = new Vector3();
        box.getSize(size);
        el.size.set(size.x, size.y, size.z);
        // TODO set behaviors and copy properties over, instead
        // of setting geometry/material directly on three,
        // because then these are out of the control of the
        // behaviors.
        el.three.geometry = newGeometry;
        setBehaviors(el, { material: 'projected' });
        // TODO copy properties from three.material
        el.needsUpdate();
    }
    else {
        // For now all other objects are converted to Element3D. TODO support more Three objects.
        el = document.createElement('lume-element3d');
        el.three.add(three.clone(false));
    }
    if (three.name)
        el.id = three.name;
    el.rotation.set(-radToDeg(three.rotation.x), radToDeg(three.rotation.y), -radToDeg(three.rotation.z));
    for (const childThree of three.children)
        el.append(threeToLume(childThree));
    return el;
}
//# sourceMappingURL=threeToLume.js.map