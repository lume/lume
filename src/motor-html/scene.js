import 'document-register-element'
import jss from '../jss'
import styles from './scene-style'
import Scene from '../motor/Scene'
import MotorHTMLNode from './node'

export default
document.registerElement('motor-scene', 
class MotorHTMLScene extends MotorHTMLNode {
    _makeImperativeNode() {
        let scene = new Scene(this)
        scene.mount(this.parentNode)
        return scene
    }

    attachedCallback() {
        super.attachedCallback()
    }

    _getStyles() {
        return styles
    }

    _cleanUp() {
        super._cleanUp()

        // TODO: unmount the scene
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        super.attributeChangedCallback(attribute, oldValue, newValue)
        this._updateSceneProperty(attribute, oldValue, newValue)
    }

    _updateSceneProperty(attribute, oldValue, newValue) {
        // ...
    }
})
