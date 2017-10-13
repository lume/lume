import DeclarativeBase from './DeclarativeBase'
import HTMLNode from './HTMLNode'
import HTMLPushPaneLayout from './HTMLPushPaneLayout'
import HTMLScene from './HTMLScene'
import Scene from '../core/Scene'
import Node from '../core/Node'
import Mesh from '../core/Mesh'
import PushPaneLayout from '../components/PushPaneLayout'
import WebComponent from './WebComponent'

function useDefaultNames() {
    if (!customElements.get(Scene.defaultElementName)) Scene.define()
    if (!customElements.get(Node.defaultElementName)) Node.define()
    if (!customElements.get(Mesh.defaultElementName)) Mesh.define()
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
