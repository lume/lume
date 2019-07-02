import BaseMeshBehavior from './BaseMeshBehavior'
import {props} from '../../core/props'
import {Color} from 'three'

// base class for geometry behaviors
export default class BaseMaterialBehavior extends BaseMeshBehavior {
    static type = 'material'

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

    get transparent() {
        if (this.opacity < 1) return true
        else return false
    }

    updateMaterial(propName: string) {
        ;(this.element.three.material as any)[propName] = (this as any)[propName]
        this.element.needsUpdate()
    }
}

export {BaseMaterialBehavior}
