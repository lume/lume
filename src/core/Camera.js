import Node from './Node'

import { PerspectiveCamera as ThreePerspectiveCamera } from 'three'

export default
class Camera extends Node {
    static get defaultElementName() { return 'i-camera' }
    static get _Class() { return Camera }

    async construct(options = {}) {
        super.construct(options)

        // TODO: abstract away having to use mountPromise with a
        // mountedCallback that is called everytime a node is added to a scene.
        // Right now, this will only be called the first time a node is added
        // to a scene, but not to any subsequent scenes.
        // We can't just rely on connectedCallback because that can be called
        // if the node is added to any element. See how mountPromise logic is
        // canceled in Node to get more ideas on how we can do this and not
        // replicate that canceling logic here.
        // Maybe we write it on top of init/deinit functionality?
        await this.mountPromise
        this.mountedCallback()
    }

    makeThreeObject3d() {
        return new ThreePerspectiveCamera(75, 16/9, 1, 1000)
    }

    mountedCallback() {

        // default aspect value based on the scene size.
        if ( ! this.hasAttribute( 'aspect' ) ) {
            const { x:width, y:height } = this.scene.calculatedSize
            this.threeObject3d.aspect = width / height
        }

    }

    // TODO, unmountedCallback functionality.
    unmountedCallback() {}

    static get observedAttributes() {
        const superAttrs = super.observedAttributes || []
        return superAttrs.concat( [
            'active',
            'fov',
            'near',
            'far',
            'aspect',
            'zoom',
        ].map( a => a.toLowerCase() ) )
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        super.attributeChangedCallback(attr, oldVal, newVal)

        if ( attr == 'fov' ) {
            console.log('camera attr changed, ', attr)
            this.threeObject3d.fov = parseFloat(newVal)
            this.threeObject3d.updateProjectionMatrix()
        }
        else if ( attr == 'aspect' ) {
            console.log('camera attr changed, ', attr)
            this.threeObject3d.aspect = parseFloat(newVal)
            this.threeObject3d.updateProjectionMatrix()
        }
        else if ( attr == 'near' ) {
            console.log('camera attr changed, ', attr)
            this.threeObject3d.near = parseFloat(newVal)
            this.threeObject3d.updateProjectionMatrix()
        }
        else if ( attr == 'far' ) {
            console.log('camera attr changed, ', attr)
            this.threeObject3d.far = parseFloat(newVal)
            this.threeObject3d.updateProjectionMatrix()
        }
        else if ( attr == 'zoom' ) {
            console.log('camera attr changed, ', attr)
            this.threeObject3d.zoom = parseFloat(newVal)
            //this.threeObject3d.updateProjectionMatrix()?
        }
        else if ( attr == 'active' && typeof newVal == 'string' ) {
            console.log('camera attr changed, ', attr)
            this.setActiveCamera()
        }
    }

    updateCamera() {
        this.threeObject3d.matrixWorldInverse.getInverse( this.threeObject3d.matrixWorld );
    }

    async setActiveCamera() {
        await this.mountPromise
        console.log('Set active camera')
        this.scene.threeCamera = this.threeObject3d
        this.scene._needsToBeRendered()
    }
}
