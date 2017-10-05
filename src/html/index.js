import DeclarativeBase from './DeclarativeBase'
import HTMLNode from './HTMLNode'
import HTMLPushPaneLayout from './HTMLPushPaneLayout'
import HTMLScene from './HTMLScene'
import WebComponent from './WebComponent'

import 'document-register-element'
function useDefaultNames() {
    HTMLNode.define()
    HTMLScene.define()
    HTMLPushPaneLayout.define()
}

export {
    DeclarativeBase,
    HTMLNode,
    HTMLPushPaneLayout,
    HTMLScene,
    WebComponent,
    useDefaultNames,
}
