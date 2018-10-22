import Class from 'lowclass'
import BaseMeshBehavior from './BaseMeshBehavior'
import { props } from '../../core/props'

import * as THREE from 'three'
window.THREE = THREE

// base class for geometry behaviors
export default
Class( 'BaseMaterialBehavior' ).extends( BaseMeshBehavior, ({ Super }) => ({

    static: {
        type: 'material',
        props: {
            color: props.THREE.Color,
            opacity: { ...props.number, default: 1 },
        },
    },

    async updated( oldProps, oldState, modifiedProps ) {
        const {color, opacity} = modifiedProps

        // TODO maybe there's a way we can eliminate this async/await behavior,
        // yet still give the user a meaningful error.
        if (! ( await Super( this ).elementIsMesh() ) ) return

        if (color) this.updateMaterial('color')

        if (opacity) {
            this.updateMaterial('opacity')
            this.updateMaterial('transparent')
        }
    },

    get transparent() {
        if ( this.opacity < 1 ) return true
        else return false
    },

    updateMaterial(propName) {
        // if (this.element.tagName === 'I-SPHERE') debugger
        this.element.threeObject3d.material[propName] = this[propName]
        this.element._needsToBeRendered()
    },

}))
