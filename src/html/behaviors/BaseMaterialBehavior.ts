import BaseMeshBehavior, {MeshComponentType} from './BaseMeshBehavior'
// import {props} from '../../core/props'
import {Color, MeshPhongMaterial} from 'three'
import {reactive, attribute, autorun} from '../../core/Component'

// base class for geometry behaviors
export default class BaseMaterialBehavior extends BaseMeshBehavior {
    type: MeshComponentType = 'material'

    // static props = {
    //     color: props.THREE.Color,
    //     opacity: {...props.number, default: 1},
    // }
    // color!: Color | string | number
    // opacity!: number

    __color = new Color('deeppink')
    @reactive
    @attribute
    get color(): string | number | Color {
        return this.__color
    }
    set color(val: string | number | Color) {
        if (typeof val === 'string' || typeof val === 'number') this.__color = new Color(val)
        else this.__color = val
    }
    @reactive
    @attribute
    opacity = 1
    static tmp_props = {color: true, opacity: true}
    // TODO material-texture example breaks without this
    // static get observedAttributes() {
    //     return ['opacity', 'color', ...super.observedAttributes]
    // }
    loadGL() {
        if (!super.loadGL()) return false
        autorun(() => {
            this.updateMaterial('color')
        })
        autorun(() => {
            this.updateMaterial('opacity')
            this.updateMaterial('transparent')
        })
        return true
    }
    // TODO replace this attributeChangedCallback with the one from Component.ts
    // (generify Component to work with or without Custom Elements)
    async attributeChangedCallback(attr: string, oldVal: string | null, newVal: string | null) {
        super.attributeChangedCallback(attr, oldVal, newVal)
        if (attr === 'opacity' || attr === 'color') {
            this[attr] = newVal as any
        }
    }

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
