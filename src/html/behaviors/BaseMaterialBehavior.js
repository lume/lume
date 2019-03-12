import Class from 'lowclass'
import BaseMeshBehavior from './BaseMeshBehavior'
import { props } from '../../core/props'

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

    updated( oldProps, modifiedProps ) {
        const {color, opacity} = modifiedProps

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
        this.element.three.material[propName] = this[propName]
        this.element._needsToBeRendered()
    },

}))
