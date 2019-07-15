import {CSS3DRendererNested} from '../lib/three/CSS3DRendererNested'
import {Scene} from './Scene'

const sceneStates = new WeakMap()

let instance: CSS3DRendererThree | null = null
let isCreatingSingleton = false

export class CSS3DRendererThree {
    static singleton() {
        if (instance) return instance
        else {
            try {
                isCreatingSingleton = true
                return (instance = new CSS3DRendererThree())
            } catch (e) {
                throw e
            } finally {
                isCreatingSingleton = false
            }
        }
    }

    private constructor() {
        if (!isCreatingSingleton)
            throw new Error('class is a singleton, use the static .singleton() method to get an instance')
    }

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
        scene.on('sizechange', sceneState.sizeChangeHandler)

        // @ts-ignore: access protected property
        scene._cssLayer
            //
            .appendChild(renderer.domElement)
    }

    uninitialize(scene: Scene) {
        const sceneState = sceneStates.get(scene)

        if (!sceneState) return

        scene.off('sizechange', sceneState.sizeChangeHandler)

        // @ts-ignore: access protected property
        scene._cssLayer
            //
            .removeChild(sceneState.renderer.domElement)

        sceneState.renderer = null
        sceneState.sizeChangeHandler = null

        sceneStates.delete(scene)
    }

    drawScene(scene: Scene) {
        const {renderer} = sceneStates.get(scene)

        renderer.render(scene.threeCSS, scene.threeCamera)
    }

    updateResolution(scene: Scene) {
        const state = sceneStates.get(scene)

        // @ts-ignore: call protected method
        scene._updateCameraAspect()
        // @ts-ignore: call protected method
        scene._updateCameraPerspective()
        // @ts-ignore: call protected method
        scene._updateCameraProjection()

        const {x, y} = scene.calculatedSize
        state.renderer.setSize(x, y)

        scene.needsUpdate()
    }

    requestFrame(_scene: Scene, fn: FrameRequestCallback) {
        requestAnimationFrame(fn)
    }
}

export function releaseCSS3DRendererThree() {
    instance = null
}
