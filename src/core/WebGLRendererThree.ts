import WEBVR from '../lib/three/WebVR.js'
import {
    //PerspectiveCamera,
    WebGLRenderer,
    BasicShadowMap,
    PCFSoftShadowMap,
    PCFShadowMap,
} from 'three'
type Scene = typeof import('./Scene').default

const sceneStates = new WeakMap()

// A singleton responsible for setting up and drawing a WebGL scene for a given
// infamous/core/Scene using Three.js
class WebGLRendererThree {
    initialize(scene: Scene) {
        let sceneState = sceneStates.get(scene)

        if (sceneState) return

        sceneStates.set(
            scene,
            (sceneState = {
                // TODO: get the active camera from the scene
                //camera: new PerspectiveCamera( 75, 16/9, 0.1, 1000 ),

                // TODO: options controlled by HTML attributes on scene elements.
                renderer: new WebGLRenderer({
                    // TODO: how do we change alpha:true to alpha:false after the
                    // fact?
                    alpha: true,

                    antialias: true,
                }),

                sizeChangeHandler: null,
            })
        )

        const {renderer} = sceneState

        // TODO: make configurable by property/attribute
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = PCFSoftShadowMap // default PCFShadowMap
        ;(window as any).renderer = renderer

        this.updateResolution(scene)

        sceneState.sizeChangeHandler = () => this.updateResolution(scene)
        ;(scene as any).on('sizechange', sceneState.sizeChangeHandler)

        // TODO? Maybe the html/scene.js element should be responsible for
        // making this, so that DOM logic is encapsulated there?
        ;(scene as any)._glLayer.appendChild(renderer.domElement)
    }

    uninitialize(scene: Scene) {
        const sceneState = sceneStates.get(scene)

        if (!sceneState) return
        ;(scene as any).off('sizechange', sceneState.sizeChangeHandler)
        ;(scene as any)._glLayer.removeChild(sceneState.renderer.domElement)
        sceneState.renderer.dispose()
        sceneState.renderer = null
        sceneState.sizeChangeHandler = null

        sceneStates.delete(scene)
    }

    drawScene(scene: Scene) {
        const {renderer} = sceneStates.get(scene)

        renderer.render((scene as any).three, (scene as any).threeCamera)
    }

    // TODO FIXME This is tied to the `sizechange` event of Scene, which means
    // camera and renderer resize happens outside of the animation loop, but as
    // with _calcSize, we want to see if we can put this in the animation loop
    // as well. Putting this logic in the loop depends on putting _calcSize in
    // the loop. #66
    updateResolution(scene: Scene) {
        const state = sceneStates.get(scene)
        ;(scene as any)._updateCameraAspect()
        ;(scene as any)._updateCameraPerspective()
        ;(scene as any)._updateCameraProjection()

        const {x, y} = (scene as any).calculatedSize
        state.renderer.setSize(x, y)
        ;(scene as any).needsUpdate()
    }

    setClearColor(scene: Scene, color: any, opacity: number) {
        sceneStates.get(scene).renderer.setClearColor(color, opacity)
    }

    setClearAlpha(scene: Scene, opacity: number) {
        sceneStates.get(scene).renderer.setClearAlpha(opacity)
    }

    setShadowMapType(scene: Scene, type: 'pcf' | 'pcfsoft' | 'basic') {
        // TODO shouldn't need a cast here. Bug on TypeScript: https://github.com/microsoft/TypeScript/issues/32054
        type = type.toLowerCase() as 'pcf' | 'pcfsoft' | 'basic'

        if (type == 'pcf') {
            sceneStates.get(scene).renderer.shadowMap.type = PCFShadowMap
        } else if (type == 'pcfsoft') {
            sceneStates.get(scene).renderer.shadowMap.type = PCFSoftShadowMap
        } else if (type == 'basic') {
            sceneStates.get(scene).renderer.shadowMap.type = BasicShadowMap
        } else {
            // default
            sceneStates.get(scene).renderer.shadowMap.type = PCFShadowMap
        }
    }

    requestFrame(scene: Scene, fn: FrameRequestCallback) {
        const renderer = sceneStates.get(scene).renderer

        if (renderer.animate)
            // < r94
            renderer.animate(fn)
        else if (renderer.setAnimationLoop)
            // >= r94
            renderer.setAnimationLoop(fn)
    }

    // TODO: at the moment this has only been tested toggling it on
    // once. Should we be able to turn it off too (f.e. the vr attribute is removed)?
    enableVR(scene: Scene, enable: boolean) {
        const renderer = sceneStates.get(scene).renderer
        renderer.vr.enabled = enable
    }

    // TODO the UI here should be configurable via HTML
    createDefaultWebVREntryUI(scene: Scene) {
        const renderer = sceneStates.get(scene).renderer

        window.addEventListener('vrdisplaypointerrestricted', onPointerRestricted, false)
        window.addEventListener('vrdisplaypointerunrestricted', onPointerUnrestricted, false)

        function onPointerRestricted() {
            var pointerLockElement = renderer.domElement
            if (pointerLockElement && typeof pointerLockElement.requestPointerLock === 'function') {
                pointerLockElement.requestPointerLock()
            }
        }

        function onPointerUnrestricted() {
            var currentPointerLockElement = document.pointerLockElement
            var expectedPointerLockElement = renderer.domElement
            if (
                currentPointerLockElement &&
                currentPointerLockElement === expectedPointerLockElement &&
                typeof document.exitPointerLock === 'function'
            ) {
                document.exitPointerLock()
            }
        }

        const button = WEBVR.createButton(renderer)

        button.setAttribute('id', 'vrButton')
        button.style.color = 'black'
        button.style.setProperty('border-color', 'black')

        button.setAttribute('slot', 'misc')
        ;(scene as any).appendChild(button)

        return button
    }
}

let instance: WebGLRendererThree | null = null

export function getWebGLRendererThree(_scene: Scene) {
    if (instance) return instance
    else return (instance = new WebGLRendererThree())
}

export function destroyWebGLRendererThree() {
    instance = null
}
