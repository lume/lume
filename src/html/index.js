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
import Plane from '../core/Plane'
import PointLight from '../core/PointLight'
import DOMNode from '../core/DOMNode'
import DOMPlane from '../core/DOMPlane'
import AmbientLight from '../core/AmbientLight'
import Camera from '../core/Camera'
import AutoLayoutNode from '../layout/AutoLayoutNode'

function useDefaultNames() {

    const classes = [
        Scene,
        Node,
        Mesh,
        Box,
        Sphere,
        Plane,
        PointLight,
        DOMNode,
        DOMPlane,
        AmbientLight,
        Camera,
        AutoLayoutNode,
        // PushPaneLayout,
    ]

    for (const constructor of classes) {
        if (!customElements.get(constructor.defaultElementName))
            constructor.define()
    }

}

export {
    DeclarativeBase,
    HTMLNode,
    HTMLPushPaneLayout,
    HTMLScene,
    WebComponent,
    useDefaultNames,
}
