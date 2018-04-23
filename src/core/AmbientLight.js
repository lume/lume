import Class from 'lowclass'
import LightBase from './LightBase'
import { AmbientLight as ThreeAmbientLight } from 'three'

export default
Class('AmbientLight').extends( LightBase, {
    static: {
        defaultElementName: 'i-ambient-light',
    },

    construct(options = {}) {
        super.construct(options)
    },

    makeThreeObject3d() {
        const light = new ThreeAmbientLight
        light.intensity = 1 // default
        return light
    },
})
