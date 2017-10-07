import DeclarativeBase from './DeclarativeBase'
import HTMLNode from './HTMLNode'
import HTMLPushPaneLayout from './HTMLPushPaneLayout'
import HTMLScene from './HTMLScene'
import Node from '../core/Node'
import Scene from '../core/Scene'
import PushPaneLayout from '../components/PushPaneLayout'
import WebComponent from './WebComponent'

function useDefaultNames() {
    if (!customElements.get('i-node')) Node.define()
    if (!customElements.get('i-scene')) Scene.define()
    //PushPaneLayout.define()
}

export {
    DeclarativeBase,
    HTMLNode,
    HTMLPushPaneLayout,
    HTMLScene,
    WebComponent,
    useDefaultNames,
}
