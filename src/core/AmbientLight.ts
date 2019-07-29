import LightBase from './LightBase'
import {AmbientLight as ThreeAmbientLight} from 'three'

export default class AmbientLight extends LightBase {
    static defaultElementName = 'i-ambient-light'

    protected _makeThreeObject3d() {
        const light = new ThreeAmbientLight()
        light.intensity = 1 // default
        return light
    }

    getStyles() {
        return {
            ...super.getStyles(),

            // ambient light is not a physical object in the world, we don't want
            // the mouse to interact with it in CSS rendering.
            pointerEvents: 'none',
        }
    }
}

export {AmbientLight}
