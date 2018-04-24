import Class from 'lowclass'
import Node from './Node'
import ValueProcessor from './ValueProcessor'

// base class for light elements.
export default
Class('LightBase').extends( ValueProcessor( Node ), ({ Super }) => ({

    static: {
        // TODO calling super.observedAttributes doesn't work because
        // ValueProcessor mixin doesn't do static extension. Abstract away the
        // mixin pattern, and have it include static inheritance.
        //observedAttributes: ValueProcessor.observedAttributes.concat([
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
            this.processColorValue( newVal )
            this._needsToBeRendered()
        }

        else if ( attr == 'intensity' ) {
            this.processNumberValue( attr, newVal )
            this._needsToBeRendered()
        }
    },
}))
