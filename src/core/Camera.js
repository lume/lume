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

    attributeAddedOrChanged(attr, newVal) {
        if ( attr == 'fov' ) {
            this.threeObject3d.fov = parseFloat(newVal)
            this.threeObject3d.updateProjectionMatrix()
        }
        else if ( attr == 'aspect' ) {
            this.threeObject3d.aspect = parseFloat(newVal)
            this.threeObject3d.updateProjectionMatrix()
        }
        else if ( attr == 'near' ) {
            this.threeObject3d.near = parseFloat(newVal)
            this.threeObject3d.updateProjectionMatrix()
        }
        else if ( attr == 'far' ) {
            this.threeObject3d.far = parseFloat(newVal)
            this.threeObject3d.updateProjectionMatrix()
        }
        else if ( attr == 'zoom' ) {
            this.threeObject3d.zoom = parseFloat(newVal)
            this.threeObject3d.updateProjectionMatrix()
        }
        else if ( attr == 'active' ) {
            console.log('camera attr changed, ', attr)
            this.setActiveCamera()
        }
    }

    // TODO: get default values from somewhere because we use them in other
    // places too.
    attributeRemoved(attr, newVal) {
        if ( attr == 'fov' ) {
            this.threeObject3d.fov = 75
            this.threeObject3d.updateProjectionMatrix()
        }
        else if ( attr == 'aspect' ) {
            this.threeObject3d.aspect = this.getDefaultAspect()
            this.threeObject3d.updateProjectionMatrix()
        }
        else if ( attr == 'near' ) {
            this.threeObject3d.near = 0.1
            this.threeObject3d.updateProjectionMatrix()
        }
        else if ( attr == 'far' ) {
            this.threeObject3d.far = 1000
            this.threeObject3d.updateProjectionMatrix()
        }
        else if ( attr == 'zoom' ) {
            this.threeObject3d.zoom = 1
            this.threeObject3d.updateProjectionMatrix()
        }
        else if ( attr == 'active' ) {
            this.setActiveCamera( 'unset' )
        }
    }

    getDefaultAspect() {
        if ( this.scene )
            return this.scene.calculatedSize.x / this.scene.calculatedSize.y
        else return 16/9
    }

    attributeChangedCallback( attr, oldVal, newVal ) {
        super.attributeChangedCallback( attr, oldVal, newVal )

        if ( typeof newVal == 'string' ) {
            this.attributeAddedOrChanged( attr, newVal )
        }
        else {
            this.attributeRemoved( attr )
        }
    }

    updateCamera() {
        this.threeObject3d.matrixWorldInverse.getInverse( this.threeObject3d.matrixWorld );
    }

    async setActiveCamera( unset ) {
        await this.mountPromise

        // TODO
        //if ( unset ) {
        //    set a default camera if the scene has no more cameras, or
        //    possibly if it has no active cameras deterministically determine
        //    a default camera from the available cameras.
        //}

        console.log('Set active camera')
        this.scene.threeCamera = this.threeObject3d
        this.scene._needsToBeRendered()
    }
}
