import Node from './Node'
import Motor from './Motor'

import { PerspectiveCamera as ThreePerspectiveCamera } from 'three'

export default
class Camera extends Node {
    static get defaultElementName() { return 'i-camera' }
    static get _Class() { return Camera }

    async construct(options = {}) {
        super.construct(options)

        this._lastKnownScene = null

        // TODO TODO: abstract away having to use mountPromise with a
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

        this._lastKnownScene = this.scene
    }

    // TODO replace with unmountedCallback #150
    deinit() {
        super.deinit()
        console.log('deinit', this.scene)

        // TODO we want to call this in the upcoming
        // unmountedCallback, but for now it's harmless but
        // will run unnecessary logic. #150
        this._setSceneCamera( 'unset' )
    }

    // TODO, unmountedCallback functionality. issue #150
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
            this._setSceneCamera()
        }
    }

    // TODO CAMERA-DEFAULTS, get defaults from somewhere common.
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
            this._setSceneCamera( 'unset' )
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

    async _setSceneCamera( unset ) {

        if ( unset ) {

            // TODO: unset might be triggered before the scene was mounted, so
            // there might not be a last known scene. We won't need this check
            // when we add unmountedCallback. #150
            if ( this._lastKnownScene )
                this._lastKnownScene._removeCamera( this )
        }
        else {

            // wait to be mounted, because otherwise there isn't a scene to
            // set the active camera on.
            // TODO: needs to be cancellable. #150
            if (! this._mounted ) await this.mountPromise

            this.scene._addCamera( this )
        }
    }
}
