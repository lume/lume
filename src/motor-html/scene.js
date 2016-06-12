import 'document-register-element'
//import 'webcomponents.js-v1/src/CustomElements/v1/native-shim'
//import 'webcomponents.js-v1/src/CustomElements/v1/CustomElements'

import styles from './scene-style'
import Scene from '../motor/Scene'
import MotorHTMLNode from './node'

export default
document.registerElement('motor-scene',
class MotorHTMLScene extends MotorHTMLNode {

    // this is called in attachedCallback, at which point this element has a
    // parentNode.
    _makeImperativeNode() {
        let scene = new Scene(this)
        scene.mount(this.parentNode)
        return scene
    }

    getStyles() {
        return styles
    }

    //deinit() {
        //super.deinit()

        //// TODO: unmount the scene
    //}
})
