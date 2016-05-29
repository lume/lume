import 'document-register-element'
import styles from './scene-style'
import Scene from '../motor/Scene'
import MotorHTMLNode from './node'

export default
document.registerElement('motor-scene',
class MotorHTMLScene extends MotorHTMLNode {

    // this is called in attachedCallback, at which point this element hasa
    // parentNode.
    _makeImperativeNode() {
        let scene = new Scene(this)
        console.log('motor-scene parentNode', this.id, this.parentNode)
        scene.mount(this.parentNode)
        return scene
    }

    getStyles() {
        return styles
    }

    //_deinit() {
        //super._deinit()

        //// TODO: unmount the scene
    //}
})
