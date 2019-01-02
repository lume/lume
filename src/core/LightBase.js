import Class from 'lowclass'
import {Color} from 'three'
import Node from './Node'
import { props } from './props'
import { mapPropTo } from './props'

// base class for light elements.
export default
Class('LightBase').extends( Node, ({ Super }) => ({

    static: {
        props: {
            ...Node.props,
            color: mapPropTo({ ...props.THREE.Color, default: new Color('white') }, 'three'),
            intensity: mapPropTo({ ...props.number, default: 1 }, 'three'),
        },
    },

    // TODO we shouldn't need to define passInitialValuesToThree, the default
    // value of the props should automatically be in place.
    passInitialValuesToThree() {
        this.three.color = this.color
        this.three.intensity = this.intensity
    },

    updated(oldProps, oldState, modifiedProps) {
        Super(this).updated(oldProps, oldState, modifiedProps)

        if (!this.isConnected) return

        this._needsToBeRendered()
    },

}))
