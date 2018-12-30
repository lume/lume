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

const sceneStates = new WeakMap

// A singleton responsible for setting up and drawing a WebGL scene for a given
// infamous/core/Scene using Three.js
const WebGLRendererThree = Class('WebGLRendererThree', { // TODO rename
    initGl(scene) {
        let sceneState = sceneStates.has(scene)

        if (sceneState) sceneState = sceneStates.get(scene)
        else sceneStates.set(scene, sceneState = {
            // TODO: get the active camera from the scene
            //camera: new PerspectiveCamera( 75, 16/9, 0.1, 1000 ),

            // TODO: options controlled by HTML attributes on scene elements.
            renderer: new WebGLRenderer( {
                // TODO: how do we change alpha:true to alpha:false after the
                // fact?
                alpha: true,

                antialias: true,
            } ),

            cssRenderer: new CSS3DRendererNested,
        })

        const { renderer, cssRenderer } = sceneState

        // TODO: make configurable by property/attribute
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = PCFSoftShadowMap; // default PCFShadowMap

        this.updateResolution(scene)
        scene.on('sizechange', () => this.updateResolution(scene))

        // TODO? Maybe the html/scene.js element should be responsible for
        // making this, so that DOM logic is encapsulated there?
        scene._glLayer.appendChild( renderer.domElement )
        scene._cssLayer.appendChild( cssRenderer.domElement )
    },

    drawScene(scene) {
        const {renderer, cssRenderer} = sceneStates.get(scene)

        renderer.render(scene.three, scene.threeCamera)
        cssRenderer.render(scene.threeCSS3DObject, scene.threeCamera)
    },

    // TODO FIXME This is tied to the `sizechange` event of Scene, which means
    // camera and renderer resize happens outside of the animation loop, but as
    // with _calcSize, we want to see if we can put this in the nimation loop
    // as well. Putting this logic in the loop depends on putting _calcSize in
    // the loop. #66
    updateResolution(scene) {
        const state = sceneStates.get(scene)

        scene._updateCameraAspect()
        scene._updateCameraPerspective()
        scene._updateCameraProjection()

        state.renderer.setSize( scene._calculatedSize.x, scene._calculatedSize.y )
        state.cssRenderer.setSize( scene._calculatedSize.x, scene._calculatedSize.y )

        // Indirectly causes Motor to call this.drawScene(). It's important to
        // call this rather than just this.drawScene() directly because Motor
        // will make sure it runs in an animation frame.
        scene._needsToBeRendered()
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
