import WEBVR from '../lib/three/WebVR.js'
import {
    //PerspectiveCamera,
    WebGLRenderer,
    BasicShadowMap,
    PCFSoftShadowMap,
    PCFShadowMap,
} from 'three'
import Class from 'lowclass'
import {CSS3DRendererNested} from '../lib/three/CSS3DRendererNested'
import {getSceneProtectedHelper} from './Scene'

const SceneProtected = getSceneProtectedHelper()

const sceneStates = new WeakMap

// A singleton responsible for setting up and drawing a WebGL scene for a given
// infamous/core/Scene using Three.js
const WebGLRendererThree = Class('WebGLRendererThree', { // TODO rename
    initialize(scene) {
        let sceneState = sceneStates.get(scene)

        if (sceneState) return

        sceneStates.set(scene, sceneState = {
            // TODO: get the active camera from the scene
            //camera: new PerspectiveCamera( 75, 16/9, 0.1, 1000 ),

            // TODO: options controlled by HTML attributes on scene elements.
            renderer: new WebGLRenderer( {
                // TODO: how do we change alpha:true to alpha:false after the
                // fact?
                alpha: true,

                antialias: true,
            } ),

            sizeChangeHandler: null,
        })

        const { renderer } = sceneState

        // TODO: make configurable by property/attribute
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = PCFSoftShadowMap; // default PCFShadowMap

        this.updateResolution(scene)

        sceneState.sizeChangeHandler = () => this.updateResolution(scene)
        scene.on('sizechange', sceneState.sizeChangeHandler)

        // TODO? Maybe the html/scene.js element should be responsible for
        // making this, so that DOM logic is encapsulated there?
        SceneProtected()(scene)._glLayer.appendChild( renderer.domElement )
    },

    uninitialize(scene) {
        const sceneState = sceneStates.get(scene)

        if (!sceneState) return

        scene.off('sizechange', sceneState.sizeChangeHandler)
        SceneProtected()(scene)._glLayer.removeChild( sceneState.renderer.domElement )
        sceneState.renderer.dispose()
        sceneState.renderer = null
        sceneState.sizeChangeHandler = null

        sceneStates.delete(scene)
    },

    drawScene(scene) {
        const {renderer} = sceneStates.get(scene)

        renderer.render(scene.three, scene.threeCamera)
    },

    // TODO FIXME This is tied to the `sizechange` event of Scene, which means
    // camera and renderer resize happens outside of the animation loop, but as
    // with _calcSize, we want to see if we can put this in the animation loop
    // as well. Putting this logic in the loop depends on putting _calcSize in
    // the loop. #66
    updateResolution(scene) {
        const state = sceneStates.get(scene)

        SceneProtected()(scene)._updateCameraAspect()
        SceneProtected()(scene)._updateCameraPerspective()
        SceneProtected()(scene)._updateCameraProjection()

        const { x, y } = scene.calculatedSize
        state.renderer.setSize( x, y )

        scene.needsUpdate()
    },

    setClearColor( scene, color, opacity ) {
        sceneStates.get( scene ).renderer.setClearColor( color, opacity )
    },

    setClearAlpha( scene, opacity ) {
        sceneStates.get( scene ).renderer.setClearAlpha( opacity )
    },

    setShadowMapType(scene, type) {
        type = type.toLowerCase()

        if ( type == 'pcf' ) {
            sceneStates.get( scene ).renderer.shadowMap.type = PCFShadowMap
        }
        else if ( type == 'pcfsoft' ) {
            sceneStates.get( scene ).renderer.shadowMap.type = PCFSoftShadowMap
        }
        else if ( type == 'basic' ) {
            sceneStates.get( scene ).renderer.shadowMap.type = BasicShadowMap
        }
        else { // default
            sceneStates.get( scene ).renderer.shadowMap.type = PCFShadowMap
        }
    },

    requestFrame( scene, fn ) {
        const renderer = sceneStates.get( scene ).renderer

        if ( renderer.animate ) // < r94
            renderer.animate( fn )
        else if ( renderer.setAnimationLoop ) // >= r94
            renderer.setAnimationLoop( fn )
    },

    // TODO: at the moment this has only been tested toggling it on
    // once. Should we be able to turn it off too (f.e. the vr attribute is removed)?
    enableVR( scene, enable ) {
        const renderer = sceneStates.get( scene ).renderer
        renderer.vr.enabled = enable
    },

    // TODO the UI here should be configurable via HTML
    createDefaultWebVREntryUI( scene ) {

        const renderer = sceneStates.get( scene ).renderer

        window.addEventListener( 'vrdisplaypointerrestricted', onPointerRestricted, false );
        window.addEventListener( 'vrdisplaypointerunrestricted', onPointerUnrestricted, false );

        function onPointerRestricted() {
            var pointerLockElement = renderer.domElement;
            if ( pointerLockElement && typeof(pointerLockElement.requestPointerLock) === 'function' ) {
                pointerLockElement.requestPointerLock();
            }
        }

        function onPointerUnrestricted() {
            var currentPointerLockElement = document.pointerLockElement;
            var expectedPointerLockElement = renderer.domElement;
            if ( currentPointerLockElement && currentPointerLockElement === expectedPointerLockElement && typeof(document.exitPointerLock) === 'function' ) {
                document.exitPointerLock();
            }
        }

        const button = WEBVR.createButton( renderer )

        button.setAttribute( 'id', 'vrButton' )
        button.style.color = 'black'
        button.style['border-color'] = 'black'

        button.setAttribute( 'slot', 'misc' )
        scene.appendChild( button )

        return button
    },

})

let instance = null

export
function getWebGLRendererThree(scene) {
    if (instance) return instance
    else return instance = new WebGLRendererThree
}

export
function destroyWebGLRendererThree() {
    instance = null
}
