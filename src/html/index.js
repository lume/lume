import DeclarativeBase from './DeclarativeBase'
import HTMLNode from './HTMLNode'
import HTMLPushPaneLayout from './HTMLPushPaneLayout'
import HTMLScene from './HTMLScene'
import PushPaneLayout from '../components/PushPaneLayout'
import WebComponent from './WebComponent'

import Scene from '../core/Scene'
import Node from '../core/Node'
import Mesh from '../core/Mesh'
import PointLight from '../core/PointLight'

function useDefaultNames() {
    // TODO replace with a loop
    if (!customElements.get(Scene.defaultElementName)) Scene.define()
    if (!customElements.get(Node.defaultElementName)) Node.define()
    if (!customElements.get(Mesh.defaultElementName)) Mesh.define()
    if (!customElements.get(PointLight.defaultElementName)) PointLight.define()
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
