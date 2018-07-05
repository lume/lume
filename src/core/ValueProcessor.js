import { Color } from 'three'
import Class from 'lowclass'
import Mixin from './Mixin'
import { native } from 'lowclass/native'

const twoOrMoreSpaces = /\s\s+/g

export default
Mixin(Base =>

    Class( 'ValueProcessor' ).extends( Base, {

        processColorValue( value, context, prop ) {
            context = context || this
            prop = prop || 'color'
            context[ prop ] = new Color( value )
        },

        processNumberValue( prop, value, context ) {
            context = context || this
            const number = parseFloat( value )

            if ( isNaN( number ) ) {

                console.warn( (
                    `The value for the "${ prop }" attribute should be a number. It
                    is passed to window.parseFloat. Your value ("${ value }")
                    cannot be parsed into a number (it becomes NaN).`
                ).replace( twoOrMoreSpaces, ' ' ) )

            }

            context[ prop ] = number
        },

    })

)
