
import Node from './Node'

import { AmbientLight as ThreeAmbientLight, Color } from 'three'

export default
class AmbientLight extends Node {
    static get defaultElementName() { return 'i-ambient-light' }
    static get _Class() { return AmbientLight }

    static get observedAttributes() {
        return super.observedAttributes.concat([
            'color',
            'intensity',
        ])
    }

    construct(options = {}) {
        super.construct(options)
    }

    makeThreeObject3d() {
        const light = new ThreeAmbientLight
        light.intensity = 1 // default
        return light
    }

    attributeChangedCallback( attr, oldVal, newVal ) {
        super.attributeChangedCallback( attr, oldVal, newVal )

        // TODO belongs in Light base class
        if ( attr == 'color' ) {

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

        else if ( attr == 'intensity' ) {
            this.processNumberValue( attr, newVal )
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
