
import Node from './Node'

import { PointLight as ThreePointLight } from 'three'

export default
class PointLight extends Node {
    static get defaultElementName() { return 'i-point-light' }
    static get _Class() { return PointLight }

    construct(options = {}) {
        super.construct(options)
        console.log(' @@@ PointLight construct')
    }

    makeThreeObject3d() {
        return new ThreePointLight
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
                newVal = newVal.trim().split( /\s+/ ).map( n => parseInt(n) )
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
            this.processNumberValue( attr, value )
            this._needsToBeRendered()
        }
    }

    processNumberValue( attr, value ) {
        const number = parseFloat( value )

        if ( ! value.match( /^\s*(\d+|\d*(.\d+)|(\d+.)\d*)\s*$/ ) ) {

            console.warn( (
                `The value for the "${ attr }" attribute should be a
                number. It will be passed to window.parseInt. Your value
                ("${ value }") will be converted to the number ${ number }.`
            ).replace( /\s+/g, ' ' ) )

        }

        this.threeObject3d[ attr ] = number
    }
}
