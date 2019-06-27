import {CSS3DRendererNested} from '../lib/three/CSS3DRendererNested'
type Scene = typeof import('./Scene').default

const sceneStates = new WeakMap()

class CSS3DRendererThree {
    // TODO rename
    initialize(scene: Scene) {
        let sceneState = sceneStates.get(scene)

        if (sceneState) return

        sceneStates.set(
            scene,
            (sceneState = {
                renderer: new CSS3DRendererNested(),
            })
        )

        const {renderer} = sceneState

        this.updateResolution(scene)

        sceneState.sizeChangeHandler = () => this.updateResolution(scene)
        ;(scene as any).on('sizechange', sceneState.sizeChangeHandler)
        ;(scene as any)._cssLayer.appendChild(renderer.domElement)
    }

    uninitialize(scene: Scene) {
        const sceneState = sceneStates.get(scene)

        if (!sceneState) return
        ;(scene as any).off('sizechange', sceneState.sizeChangeHandler)
        ;(scene as any)._cssLayer.removeChild(sceneState.renderer.domElement)
        sceneState.renderer = null
        sceneState.sizeChangeHandler = null

        sceneStates.delete(scene)
    }

    drawScene(scene: Scene) {
        const {renderer} = sceneStates.get(scene)

        renderer.render((scene as any).threeCSS, (scene as any).threeCamera)
    }

    updateResolution(scene: any /*TODO no any*/) {
        const state = sceneStates.get(scene)

        scene._updateCameraAspect()
        scene._updateCameraPerspective()
        scene._updateCameraProjection()

        const {x, y} = scene.calculatedSize
        state.renderer.setSize(x, y)

        scene.needsUpdate()
    }

    requestFrame(_scene: Scene, fn: FrameRequestCallback) {
        requestAnimationFrame(fn)
    }
}

let instance: CSS3DRendererThree | null = null

export function getCSS3DRendererThree(_scene: Scene) {
    if (instance) return instance
    else return (instance = new CSS3DRendererThree())
}

export function destroyCSS3DRendererThree() {
    instance = null
}
