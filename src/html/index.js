import DeclarativeBase from './DeclarativeBase'
import HTMLNode from './HTMLNode'
import HTMLPushPaneLayout from './HTMLPushPaneLayout'
import HTMLScene from './HTMLScene'
import PushPaneLayout from '../components/PushPaneLayout'
import WebComponent from './WebComponent'

import Scene from '../core/Scene'
import Node from '../core/Node'
import Mesh from '../core/Mesh'
import Box from '../core/Box'
import Sphere from '../core/Sphere'
import PointLight from '../core/PointLight'
import AmbientLight from '../core/AmbientLight'
import Camera from '../core/Camera'

function useDefaultNames() {
    // TODO replace with a loop
    if (!customElements.get(Scene.defaultElementName)) Scene.define()
    if (!customElements.get(Node.defaultElementName)) Node.define()
    if (!customElements.get(Mesh.defaultElementName)) Mesh.define()
    if (!customElements.get(Box.defaultElementName)) Box.define()
    if (!customElements.get(Sphere.defaultElementName)) Sphere.define()
    if (!customElements.get(PointLight.defaultElementName)) PointLight.define()
    if (!customElements.get(AmbientLight.defaultElementName)) AmbientLight.define()
    if (!customElements.get(Camera.defaultElementName)) Camera.define()
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
