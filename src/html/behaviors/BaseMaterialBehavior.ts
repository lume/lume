import BaseMeshBehavior, {MeshComponentType} from './BaseMeshBehavior'
import {props} from '../../core/props'
import {Color, MeshPhongMaterial} from 'three'

// base class for geometry behaviors
export default class BaseMaterialBehavior extends BaseMeshBehavior {
    type: MeshComponentType = 'material'

    static props = {
        color: props.THREE.Color,
        opacity: {...props.number, default: 1},
    }

    color!: Color | string | number
    opacity!: number

    updated(_oldProps: any, modifiedProps: any) {
        const {color, opacity} = modifiedProps

        if (color) this.updateMaterial('color')

        if (opacity) {
            this.updateMaterial('opacity')
            this.updateMaterial('transparent')
        }
    }

    get transparent(): boolean {
        if (this.opacity < 1) return true
        else return false
    }

    updateMaterial(propName: 'color' | 'opacity' | 'transparent') {
        // The following type casting isn't type safe, but we can't type
        // everything we can do in JavaScript. It at leat shows our intent, but
        // swap "color" with "opacity", "transparent", etc.
        // TODO support Material[]
        ;(this.element.three.material as MeshPhongMaterial)[propName as 'color'] = this[
            propName
        ] as MeshPhongMaterial['color']

        this.element.needsUpdate()
    }
}

export {BaseMaterialBehavior}
