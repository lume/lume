import Class from 'lowclass'
import Node from './Node'

// base class for light elements.
export default
Class('LightBase').extends( Node, ({ Super }) => ({

    static: {
        observedAttributes: Node.observedAttributes.concat([
            'color',
            'intensity',
        ]),
    },

    construct(options = {}) {
        Super(this).construct(options)
    },

    attributeChangedCallback( attr, oldVal, newVal ) {
        Super(this).attributeChangedCallback( attr, oldVal, newVal )

        if ( attr == 'color' ) {
            this.processColorValue( newVal, this.threeObject3d )
            this._needsToBeRendered()
        }

        else if ( attr == 'intensity' ) {
            this.processNumberValue( attr, newVal, this.threeObject3d )
            this._needsToBeRendered()
        }
    },
}))
