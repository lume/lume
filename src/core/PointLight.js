
import Node from './Node'

import { PointLight as ThreePointLight, Color } from 'three'

export default
class PointLight extends Node {
    static get defaultElementName() { return 'i-point-light' }
    static get _Class() { return PointLight }

    static get observedAttributes() {
        return super.observedAttributes.concat([
            'color',
            'intensity',
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
        light.intensity = 1 // default
        light.castShadow = true // default false
        light.shadow.mapSize.width = 512 // default
        light.shadow.mapSize.height = 512 // default
        light.shadow.camera.near = 1 // default
        // TODO: auto-adjust far like we will with Camera, unless the user
        // supplies a manual value.
        light.shadow.camera.far = 10000 // default 2000

        return light
    }

    // TODO: common way to map attributes to properties.
    attributeChangedCallback( attr, oldVal, newVal ) {
        super.attributeChangedCallback( attr, oldVal, newVal )

        // TODO belongs in Light base class
        if ( attr == 'color' ) {

            // TODO: generic type system for attributes. It will eliminate
            // duplication here.

            // if a triplet space-separated of RGB numbers
            if ( newVal.match( /^\s*\d+\s+\d+\s+\d+\s*$/ ) ) {
                newVal = newVal.trim().split( /\s+/ ).map( n => parseFloat(n)/255 )
                this.threeObject3d.color = new Color( ...newVal )
            }
            // otherwise a CSS-style color string
            else {
                this.threeObject3d.color = new Color( newVal )
            }

            this._needsToBeRendered()

        }

        else if (
            attr == 'intensity' ||
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

    processNumberValue( attr, value ) {
        const number = parseFloat( value )

        // TODO PERFORMANCE this check might be too heavy (users will hit this
        // every frame).
        if ( ! value.match( /^\s*(\d+|\d*(.\d+)|(\d+.)\d*)\s*$/ ) ) {

            console.warn( (
                `The value for the "${ attr }" attribute should be a
                number. It will be passed to window.parseFloat. Your value
                ("${ value }") will be converted to the number ${ number }.`
            ).replace( /\s+/g, ' ' ) )

        }

        this.threeObject3d[ attr ] = number
    }
}
