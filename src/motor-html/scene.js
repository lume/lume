import 'document-register-element'
//import 'webcomponents.js-v1/src/CustomElements/v1/native-shim'
//import 'webcomponents.js-v1/src/CustomElements/v1/CustomElements'

import styles from './scene-style'
import Scene from '../motor/Scene'
import MotorHTMLBase from './base'

let MotorHTMLScene = document.registerElement('motor-scene',
class MotorHTMLScene extends MotorHTMLBase {

    createdCallback() {
        super.createdCallback()
    }

    // NOTE This is triggered by the _init() call in WebComponent's
    // attachedCallback, at which point this element has a parentNode.
    _makeImperativeCounterpart() {
        const scene = new Scene({
            _motorHtmlCounterpart: this
        })

        // TODO: needs unmount cleanup (in deinit, which is called in
        // WebComponent's detachedCallback).
        scene.mount(this.parentNode)

        return scene
    }

    /** @override */
    getStyles() {
        return styles
    }

    attachedCallback() {
        super.attachedCallback()
    }

    //deinit() {
        //super.deinit()

        //// TODO: unmount the scene
    //}
})

export {MotorHTMLScene as default}
