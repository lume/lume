import 'element-behaviors'
import {Shape /*, ShapeGeometry*/, ExtrudeGeometry} from 'three'
// import {RoundedRectangle} from '../../components/RoundedRectangle'
import BaseGeometryBehavior from './BaseGeometryBehavior'
import {props, changePropContext} from '../../core/props'
import {Props} from '../WithUpdate'

export class RoundedRectangleGeometryBehavior extends BaseGeometryBehavior {
    static props: Props = {
        cornerRadius: changePropContext(props.number, (self: any) => self.element),
    }

    cornerRadius!: number

    // static get requiredElementType() {
    //     return RoundedRectangle
    // }

    // element!: RoundedRectangle

    updated(modifiedProps: any) {
        super.updated(modifiedProps)

        if (modifiedProps.cornerRadius) {
            // TODO this is extra work if super.updated already called this. See
            // if we can make resetMeshComponent operate only once per microtick
            // (batch them).
            this.resetMeshComponent()
        }
    }

    protected _createComponent() {
        const roundedRectShape = new Shape()

        roundedRect(
            roundedRectShape,
            -this.element.calculatedSize.x / 2,
            -this.element.calculatedSize.y / 2,
            this.element.calculatedSize.x,
            this.element.calculatedSize.y,
            (this.element as any).cornerRadius
        )

        // return new ShapeGeometry(roundedRectShape)
        return new ExtrudeGeometry(roundedRectShape, {
            depth: 8,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 1,
            bevelThickness: 1,
        })
    }
}

elementBehaviors.define('rounded-rectangle-geometry', RoundedRectangleGeometryBehavior)

// from Three.js example: https://github.com/mrdoob/three.js/blob/159a40648ee86755220491d4f0bae202235a341c/examples/webgl_geometry_shapes.html#L237
function roundedRect(shape: Shape, x: number, y: number, width: number, height: number, radius: number) {
    // shape.moveTo(x, y + radius)
    // shape.lineTo(x, y + height - radius)
    // shape.quadraticCurveTo(x, y + height, x + radius, y + height)
    // shape.lineTo(x + width - radius, y + height)
    // shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
    // shape.lineTo(x + width, y + radius)
    // shape.quadraticCurveTo(x + width, y, x + width - radius, y)
    // shape.lineTo(x + radius, y)
    // shape.quadraticCurveTo(x, y, x, y + radius)

    shape.moveTo(x, y + radius)
    shape.lineTo(x, y + height - radius)
    shape.absarc(x + radius, y + height - radius, radius, Math.PI, Math.PI / 2, true)
    shape.lineTo(x + width - radius, y + height)
    shape.absarc(x + width - radius, y + height - radius, radius, Math.PI / 2, 0, true)
    shape.lineTo(x + width, y + radius)
    shape.absarc(x + width - radius, y + radius, radius, 0, -Math.PI / 2, true)
    shape.lineTo(x + radius, y)
    shape.absarc(x + radius, y + radius, radius, -Math.PI / 2, -Math.PI, true)
}
