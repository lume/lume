import LightBase from './LightBase'
import { AmbientLight as ThreeAmbientLight } from 'three'

export default
class AmbientLight extends LightBase {
    static get defaultElementName() { return 'i-ambient-light' }
    static get _Class() { return AmbientLight }

    construct(options = {}) {
        super.construct(options)
    }

    makeThreeObject3d() {
        const light = new ThreeAmbientLight
        light.intensity = 1 // default
        return light
    }
}
