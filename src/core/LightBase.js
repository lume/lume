import Class from 'lowclass'
import {Color} from 'three'
import Node from './Node'
import { props } from './props'
import { mapPropTo } from './Utility'

// base class for light elements.
export default
Class('LightBase').extends( Node, ({ Super }) => ({

    static: {
        props: {
            ...Node.props,
            color: mapPropTo({ ...props.THREE.Color, default: new Color('white') }, 'threeObject3d'),
            intensity: mapPropTo({ ...props.number, default: 1 }, 'threeObject3d'),
        },
    },

    // TODO we shouldn't need to define passInitialValuesToThree, the default
    // value of the props should automatically be in place.
    passInitialValuesToThree() {
        this.threeObject3d.color = this.color
        this.threeObject3d.intensity = this.intensity
    },

    updated(oldProps, oldState, modifiedProps) {
        Super(this).updated(oldProps, oldState, modifiedProps)
        this._needsToBeRendered()
    },

}))
