
import LightBase from './LightBase'

import { PointLight as ThreePointLight } from 'three'

export default
class PointLight extends LightBase {
    static get defaultElementName() { return 'i-point-light' }
    static get _Class() { return PointLight }

    static get observedAttributes() {
        return super.observedAttributes.concat([
            'distance',
            'decay',
            'castshadow',
            'cast-shadow',
        ])
    }

    construct(options = {}) {
        super.construct(options)
    }

    makeThreeObject3d() {
        const light = new ThreePointLight
        light.intensity = 1 // default 1
        light.distance = 0 // default 0
        light.castShadow = true // default false
        light.shadow.mapSize.width = 512 // default 512
        light.shadow.mapSize.height = 512 // default 512
        light.shadow.radius = 3 // default 1
        light.shadow.bias = 0 // default 0
        // TODO: auto-adjust near and far planes like we will with Camera,
        // unless the user supplies a manual value.
        light.shadow.camera.near = 1 // default 1
        light.shadow.camera.far = 2000 // default 2000

        return light
    }

    // TODO: make way to map attributes to properties.
    attributeChangedCallback( attr, oldVal, newVal ) {
        super.attributeChangedCallback( attr, oldVal, newVal )

        if (
            attr == 'distance' ||
            attr == 'decay'
        ) {
            this.processNumberValue( attr, newVal )
            this._needsToBeRendered()
        }

        else if ( attr == 'castshadow' || attr == 'cast-shadow' ) {

            if ( newVal == 'false' || newVal == null )
                this.threeObject3d.castShadow = false
            else
                this.threeObject3d.castShadow = true

            this._needsToBeRendered()

        }
    }
}
