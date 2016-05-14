import 'document-register-element'
import Scene from '../motor/Scene'
import MotorHTMLNode from './node'
import stylesheet from './scene-style'

let attachedSceneCount = 0

class MotorHTMLScene extends MotorHTMLNode {
    makeImperativeNode() {
        return new Scene(this.parentNode, this)
    }

    attachedCallback() {
        super.attachedCallback()
        console.log('attached scene:', this.id)

        attachedSceneCount += 1
        if (!attachedSceneCount === 1) this.attachStyle()
        this.classList.add(stylesheet.classes.motorSceneElement)
    }

    attachStyle() {
        super.attachStyle() // attach node style first.

        // XXX create stylesheet inside animation frame?
        console.log('attaching scene style')
        stylesheet.attach()
    }

    cleanUp() {
        super.cleanUp()

        // TODO: unmount the scene

        attachedSceneCount -= 1
        if (attachedSceneCount === 0) {
            stylesheet.detach()
        }
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        super.attributeChangedCallback(attribute, oldValue, newValue)
        this.updateSceneProperty(attribute, oldValue, newValue)
    }

    updateSceneProperty(attribute, oldValue, newValue) {
        // ...
    }
}
MotorHTMLScene = document.registerElement('motor-scene', MotorHTMLScene)

export default MotorHTMLScene
