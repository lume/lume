import Node from './Node'
import ValueProcessor from './ValueProcessor'

// base class for light elements.
export default
class LightBase extends ValueProcessor( Node ) {

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
            this.processColorValue( newVal )
            this._needsToBeRendered()
        }

        else if ( attr == 'intensity' ) {
            this.processNumberValue( attr, newVal )
            this._needsToBeRendered()
        }
    }
}
