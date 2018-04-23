
import Class from 'lowclass'
import {native} from 'lowclass/native'
import LightBase from './LightBase'
import { PointLight as ThreePointLight } from 'three'

export default
Class('PointLight').extends( native(LightBase), ({ Super }) => ({
    static: {
        defaultElementName: 'i-point-light',

        observedAttributes: LightBase.observedAttributes.concat([
            'distance',
            'decay',
            'castshadow',
            'cast-shadow',
            'shadowmapwidth',
            'shadow-map-width',
            'shadowmapheight',
            'shadow-map-height',
            'shadowradius',
            'shadow-radius',
            'shadowbias',
            'shadow-bias',
            'shadowcameranear',
            'shadow-camera-near',
            'shadowcamerafar',
            'shadow-camera-far',
        ]),
    },

    construct(options = {}) {
        Super(this).construct(options)
    },

    makeThreeObject3d() {
        const light = new ThreePointLight
        light.intensity = 1 // default 1
        light.distance = 0 // default 0
        light.decay = 1 // default 1
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
    },

    // TODO: make way to map attributes to properties.
    attributeChangedCallback( attr, oldVal, newVal ) {
        Super(this).attributeChangedCallback( attr, oldVal, newVal )

        if (
            attr == 'distance' ||
            attr == 'decay'
        ) {
            this.processNumberValue( attr, newVal )
            this._needsToBeRendered()
        }

        else if ( attr == 'castshadow' || attr == 'cast-shadow' ) {

            // TODO: generic function to handle boolean attributes
            if ( newVal == 'false' || newVal == null )
                this.threeObject3d.castShadow = false
            else
                this.threeObject3d.castShadow = true

            this._needsToBeRendered()

        }

        else if ( attr == 'shadowmapwidth' || attr == 'shadow-map-width' ) {
            this.processNumberValue( 'width', newVal, this.threeObject3d.shadow.mapSize )
            this._needsToBeRendered()
        }

        else if ( attr == 'shadowmapheight' || attr == 'shadow-map-height' ) {
            this.processNumberValue( 'height', newVal, this.threeObject3d.shadow.mapSize )
            this._needsToBeRendered()
        }

        else if ( attr == 'shadowradius' || attr == 'shadow-radius' ) {
            this.processNumberValue( 'radius', newVal, this.threeObject3d.shadow )
            this._needsToBeRendered()
        }

        else if ( attr == 'shadowbias' || attr == 'shadow-bias' ) {
            this.processNumberValue( 'bias', newVal, this.threeObject3d.shadow )
            this._needsToBeRendered()
        }

        else if ( attr == 'shadowcameranear' || attr == 'shadow-camera-near' ) {
            this.processNumberValue( 'near', newVal, this.threeObject3d.shadow.camera )
            this._needsToBeRendered()
        }

        else if ( attr == 'shadowcamerafar' || attr == 'shadow-camera-far' ) {
            this.processNumberValue( 'far', newVal, this.threeObject3d.shadow.camera )
            this._needsToBeRendered()
        }
    },
}))
