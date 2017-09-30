import DeclarativeBase from './DeclarativeBase'
import HTMLNode from './HTMLNode'
import HTMLPushPaneLayout from './HTMLPushPaneLayout'
import HTMLScene from './HTMLScene'
import WebComponent from './WebComponent'

import 'document-register-element'
function useDefaultNames() {
    document.registerElement('i-node', HTMLNode)
    document.registerElement('i-scene', HTMLScene)
}

export {
    DeclarativeBase,
    HTMLNode,
    HTMLPushPaneLayout,
    HTMLScene,
    WebComponent,
    useDefaultNames,
}
