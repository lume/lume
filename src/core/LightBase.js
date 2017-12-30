import Node from './Node'
import { Color } from 'three'

const twoOrMoreSpaces = /\s\s+/g

// base class for light elements.
export default
class LightBase extends Node {

    static get observedAttributes() {
        return super.observedAttributes.concat([
            'color',
            'intensity',
        ])
    }

    construct(options = {}) {
        super.construct(options)
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

    processNumberValue( attr, value, context ) {
        context = context || this.threeObject3d
        const number = parseFloat( value )

        if ( isNaN( number ) ) {

            console.warn( (
                `The value for the "${ attr }" attribute should be a number. It
                is passed to window.parseFloat. Your value ("${ value }")
                cannot be parsed into a number (it becomes NaN).`
            ).replace( twoOrMoreSpaces, ' ' ) )

        }

        context[ attr ] = number
    }
}
