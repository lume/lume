import Class from 'lowclass'
import {CSS3DRendererNested} from '../lib/three/CSS3DRendererNested'

const sceneStates = new WeakMap

const CSS3DRendererThree = Class('CSS3DRendererThree', { // TODO rename
    initialize(scene) {
        let sceneState = sceneStates.get(scene)

        if (sceneState) return

        sceneStates.set(scene, sceneState = {
            renderer: new CSS3DRendererNested,
        })

        const { renderer } = sceneState

        this.updateResolution(scene)

        sceneState.sizeChangeHandler = () => this.updateResolution(scene)
        scene.on('sizechange', sceneState.sizeChangeHandler)

        scene._cssLayer.appendChild( renderer.domElement )
    },

    uninitialize(scene) {
        const sceneState = sceneStates.get(scene)

        if (!sceneState) return

        scene.off('sizechange', sceneState.sizeChangeHandler)
        scene._cssLayer.removeChild( sceneState.renderer.domElement )
        sceneState.renderer = null
        sceneState.sizeChangeHandler = null

        sceneStates.delete(scene)
    },

    drawScene(scene) {
        const {renderer} = sceneStates.get(scene)

        renderer.render(scene.threeCSS, scene.threeCamera)
    },

    updateResolution(scene) {
        const state = sceneStates.get(scene)

        scene._updateCameraAspect()
        scene._updateCameraPerspective()
        scene._updateCameraProjection()

        const { x, y } = scene.calculatedSize
        state.renderer.setSize( x, y )

        scene._needsToBeRendered()
    },

    requestFrame( scene, fn ) {
        requestAnimationFrame(fn)
    },

})

let instance = null

export
function getCSS3DRendererThree(scene) {
    if (instance) return instance
    else return instance = new CSS3DRendererThree
}

export
function destroyCSS3DRendererThree() {
    instance = null
}
