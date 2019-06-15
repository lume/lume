import Class from 'lowclass'
import {PointLight as ThreePointLight} from 'three'
import LightBase from './LightBase'
import {props} from './props'
import {mapPropTo} from './props'

export default Class('PointLight').extends(LightBase, ({Super}) => ({
    static: {
        defaultElementName: 'i-point-light',

        props: {
            ...LightBase.props,
            distance: mapPropTo({...props.number, default: 0}, self => self.three),
            decay: mapPropTo({...props.number, default: 1}, self => self.three),
            castShadow: mapPropTo({...props.boolean, default: true}, self => self.three),
            shadowMapWidth: {...props.number, default: 512},
            shadowMapHeight: {...props.number, default: 512},
            shadowRadius: {...props.number, default: 3},
            shadowBias: {...props.number, default: 0},
            shadowCameraNear: {...props.number, default: 1},
            shadowCameraFar: {...props.number, default: 2000},
        },
    },

    passInitialValuesToThree() {
        Super(this).passInitialValuesToThree()

        const light = this.three

        light.distance = this.distance
        light.decay = this.decay
        light.castShadow = this.castShadow

        const shadow = light.shadow

        shadow.mapSize.width = this.shadowMapWidth
        shadow.mapSize.height = this.shadowMapHeight
        shadow.radius = this.shadowRadius
        shadow.bias = this.shadowBias

        // TODO: auto-adjust near and far planes like we will with Camera,
        // unless the user supplies a manual value.
        shadow.camera.near = this.shadowCameraNear
        shadow.camera.far = this.shadowCameraFar
    },

    updated(oldProps, modifiedProps) {
        Super(this).updated(oldProps, modifiedProps)

        if (!this.isConnected) return

        const shadow = this.three.shadow

        if (modifiedProps.shadowMapWidth) shadow.mapSize.width = this.shadowMapWidth
        if (modifiedProps.shadowMapHeight) shadow.mapSize.height = this.shadowMapHeight
        if (modifiedProps.shadowRadius) shadow.radius = this.shadowRadius
        if (modifiedProps.shadowBias) shadow.bias = this.shadowBias
        if (modifiedProps.shadowCameraNear) shadow.camera.near = this.shadowCameraNear
        if (modifiedProps.shadowCameraFar) shadow.camera.far = this.shadowCameraFar
    },

    protected: {
        _makeThreeObject3d() {
            return new ThreePointLight()
        },
    },
}))
