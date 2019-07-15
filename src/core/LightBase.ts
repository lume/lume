import {Color, Light} from 'three'
import Node from './Node'
import {props} from './props'
import {mapPropTo} from './props'

// base class for light elements.
export default class LightBase extends Node {
    static props = {
        ...(Node.props || {}),
        color: mapPropTo({...props.THREE.Color, default: new Color('white')}, (self: any) => self.three),
        intensity: mapPropTo({...props.number, default: 1}, (self: any) => self.three),
    }

    color!: Color | string | number
    intensity!: number

    three!: Light

    // TODO we shouldn't need to define passInitialValuesToThree, the default
    // value of the props should automatically be in place.
    passInitialValuesToThree() {
        this.three.color = this.color as Color
        this.three.intensity = this.intensity
    }

    updated(oldProps: any, modifiedProps: any) {
        super.updated(oldProps, modifiedProps)

        if (!this.isConnected) return

        this.needsUpdate()
    }
}

export {LightBase}
