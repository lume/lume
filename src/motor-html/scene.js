/* global customElements */

// XXX should we import a polyfill? Or let the end user do that?
import 'document-register-element'

//import 'webcomponents.js-v1/src/CustomElements/v1/native-shim'
//import 'webcomponents.js-v1/src/CustomElements/v1/CustomElements'

import styles from './scene-style'
import Scene from '../motor/Scene'
import MotorHTMLBase, {initMotorHTMLBase} from './base'

initMotorHTMLBase()

let MotorHTMLScene = document.registerElement('motor-scene',
class MotorHTMLScene extends MotorHTMLBase {

    init() {
        super.init() // indirectly triggers this._makeImperativeCounterpart...

        // ... then we can reference it.
        this.imperativeCounterpart.mount(this.parentNode)
    }

    _makeImperativeCounterpart() {
        return new Scene({
            _motorHtmlCounterpart: this
        })
    }

    /** @override */
    getStyles() {
        return styles
    }

    deinit() {
        super.deinit()

        this.imperativeCounterpart.unmount()
    }
})


export {MotorHTMLScene as default}
