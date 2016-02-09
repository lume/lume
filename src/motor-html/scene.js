import Node from '../motor/Node'
import Scene from '../motor/Scene'

import MotorHTMLNode from './node'

import jss from '../jss'

const sceneList = []
let style = null

/**
 * @class MotorHTMLScene
 * @extends MotorHTMLNode
 */
const MotorHTMLScene = document.registerElement('motor-scene', {
    prototype: Object.assign(Object.create(MotorHTMLNode.prototype), {
        createdCallback() {
            MotorHTMLNode.prototype.createdCallback.call(this)

            sceneList.push(this)

            if (!style) {
                style = jss.createStyleSheet({
                    motorSceneElement: {
                        boxSizing: 'border-box',
                        display:   'block',
                        overflow:  'hidden',
                    },
                })
            }

            style.attach()
            this.classList.add(style.classes.motorSceneElement)
        },

        makeNode() {
            return new Scene(this)
        },

        cleanUp() {
            MotorHTMLNode.prototype.cleanUp.call(this)

            sceneList.pop(this)

            // TODO: unmount the scene

            // dispose of the scene style if we no longer have any scenes
            // attached anywhere.
            // TODO (performance): Would requesting an animation frame when
            // detaching or attaching a stylesheet make things perform
            // better?
            if (sceneList.length == 0) {
                style.detach()
                style = null
            }
        },

        attributeChangedCallback(attribute, oldValue, newValue) {
            MotorHTMLNode.prototype.attributeChangedCallback.call(this)
            this.updateSceneProperty(attribute, oldValue, newValue)
        },

        updateSceneProperty(attribute, oldValue, newValue) {
            // ...
        },
    }),
})

export default MotorHTMLScene
