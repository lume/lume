import Class from 'lowclass'
import LightBase from './LightBase'
import { AmbientLight as ThreeAmbientLight } from 'three'

export default
Class('AmbientLight').extends( LightBase, ({ Super }) => ({
    static: {
        defaultElementName: 'i-ambient-light',
    },

    makeThreeObject3d() {
        const light = new ThreeAmbientLight
        light.intensity = 1 // default
        return light
    },
}))
