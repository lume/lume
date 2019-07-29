import Mesh from '../core/Mesh'
import {props} from '../core/props'
import {DoubleSide} from 'three'

export class RoundedRectangle extends Mesh {
    static defaultElementName = 'i-rounded-rectangle'

    static defaultBehaviors = {
        'rounded-rectangle-geometry': (initialBehaviors: any) => {
            return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
        },
        'phong-material': (initialBehaviors: any) => {
            return !initialBehaviors.some((b: any) => b.endsWith('-material'))
        },
    }

    static props = {
        ...Mesh.props,
        cornerRadius: {...props.number, default: 0},
    }

    cornerRadius!: number

    // inherited
    castShadow = false
    side = DoubleSide
}
