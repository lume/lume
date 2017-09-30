import {
    Scene as ThreeScene, // so as not to confuse with Infamous Scene.
    PerspectiveCamera,
    WebGLRenderer,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
} from 'three'

const sceneStates = new WeakMap

// A singleton responsible for setting up and drawing a WebGL scene for a given
// infamous/core/Scene using Three.js
class WebGLRendererThree {
    initGl(scene) {
        let sceneState = sceneStates.has(scene)

        if (sceneState) sceneState = sceneStates.get(scene)
        else sceneStates.set(scene, sceneState = {
            scene: new ThreeScene,

            // TODO: camera needs to be updated in updateResolution method.
            // Full window scene only for now.
            // TODO camera will be positioned relative to a Node.
            camera: new PerspectiveCamera( 75, 16/9, 0.1, 1000 ),

            renderer: new WebGLRenderer,
        })

        // TODO: update this on scene's sizechange event instead.
        this.updateResolution(scene)
        scene.on('sizechange', () => this.updateResolution(scene))

        // TODO? this needs to be managed better. Maybe the html/scene.js
        // element should be responsible for making this, so that DOM logic is
        // encapsulated there?
        scene.element.appendChild( sceneState.renderer.domElement )

        var geometry = new BoxGeometry( 1, 1, 1 )
        var material = new MeshBasicMaterial( { color: 0x00ff00 } )
        var cube = new Mesh( geometry, material )
        sceneState.scene.add( cube )
        sceneState.camera.position.z = 5
    }

    drawScene(scene) {
        const {renderer, scene: threeScene, camera} = sceneStates.get(scene)
        renderer.render(threeScene, camera)
    }

    // FIXME This is tied to the `sizechange` event of Scene, which means
    // camera and renderer resize happens outside of the animation loop, but as
    // with _calcSize, we want to see if we can put this in the nimation loop
    // as well. Putting this logic in the loop depends on putting _calcSize in
    // the loop.
    updateResolution(scene) {
        const state = sceneStates.get(scene)

        state.camera.aspect = scene._calculatedSize.x / scene._calculatedSize.y
        state.camera.updateProjectionMatrix()

        // TODO does Three handle window.devicePixelRatio?
        state.renderer.setSize( scene._calculatedSize.x, scene._calculatedSize.y )

        // Indirectly causes Motor to call this.drawScene(). It's important to
        // call this rather than just this.drawScene() directly because Motor
        // will make sure it runs in an animation frame.
        scene._needsToBeRendered()
    }
}

let instance = null

export
function getWebGLRendererThree() {
    if (instance) return instance
    else return instance = new WebGLRendererThree
}

export
function destroyWebGLRendererThree() {
    instance = null
}
