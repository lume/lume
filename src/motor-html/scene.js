import 'document-register-element'
import Scene from '../motor/Scene'
import MotorHTMLNode from './node'
import stylesheet from './scene-style'

let attachedSceneCount = 0

class MotorHTMLScene extends MotorHTMLNode {
    _makeImperativeNode() {
        let scene = new Scene(this)
        scene.mount(this.parentNode)
        return scene
    }

    attachedCallback() {
        super.attachedCallback()

        attachedSceneCount += 1
        if (!attachedSceneCount === 1) this._attachStyle()
        this.classList.add(stylesheet.classes.motorSceneElement)
    }

    _attachStyle() {
        super._attachStyle() // attach node style first.

        // XXX create stylesheet inside animation frame?
        stylesheet.attach()
    }

    _cleanUp() {
        super._cleanUp()

        // TODO: unmount the scene

        attachedSceneCount -= 1
        if (attachedSceneCount === 0) {
            stylesheet.detach()
        }
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        super.attributeChangedCallback(attribute, oldValue, newValue)
        this._updateSceneProperty(attribute, oldValue, newValue)
    }

    _updateSceneProperty(attribute, oldValue, newValue) {
        // ...
    }
}
MotorHTMLScene = document.registerElement('motor-scene', MotorHTMLScene)

export default MotorHTMLScene
