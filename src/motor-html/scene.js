import 'document-register-element'

import Scene from '../motor/Scene'

import MotorHTMLNode from './node'

import jss from '../jss'

const sceneList = []
let stylesheet = null

const style = {
    motorSceneElement: {
        //display:   'block',
        //boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        width:    '100%',
        height:   '100%',

        // Constant perspective for now.
        // TODO: make settable.
        //
        // XXX: Maybe enable a feature where perspective adapts based on
        // viewport size and aspect ratio, and the user can turn it off. This
        // would cover most use cases so the user doesn't have to worry about
        // it.
        perspective: '1000px',

        // XXX: Do we need this? Make it configurable?
        //perspectiveOrigin: '25%',
    },
}

class MotorHTMLScene extends MotorHTMLNode {
    createdCallback() {
        super.createdCallback()
        //console.log('<motor-scene> createdCallback()', this.id)

        sceneList.push(this)
        if (!stylesheet) {
            //console.log('Creating Scene style.')
            // XXX create stylesheet inside animation frame?
            stylesheet = jss.createStyleSheet(style).attach()
        }
        this.classList.add(stylesheet.classes.motorSceneElement)
    }

    makeImperativeNode() {
        return new Scene(this.parentNode, this)
    }

    cleanUp() {
        super.cleanUp()

        // TODO: unmount the scene

        sceneList.pop(this)
        if (sceneList.length == 0) {
            stylesheet.detach()
            stylesheet = null
        }
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        super.attributeChangedCallback(attribute, oldValue, newValue)
        //console.log('<motor-scene> attributeChangedCallback', this.id, attribute, this.node)
        this.updateSceneProperty(attribute, oldValue, newValue)
    }

    updateSceneProperty(attribute, oldValue, newValue) {
        // ...
    }
}
MotorHTMLScene = document.registerElement('motor-scene', MotorHTMLScene)

export default MotorHTMLScene
