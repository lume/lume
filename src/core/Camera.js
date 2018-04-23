import Node from './Node'
import Motor from './Motor'

import { PerspectiveCamera as ThreePerspectiveCamera } from 'three'

// TODO: update this to have a CSS3D-perspective-like API like with the Scene's
// default camera.
export default
class PerspectiveCamera extends Node {
    static get defaultElementName() { return 'i-perspective-camera' }

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
        if ( ! this.hasAttribute( 'aspect' ) ) this._startAutoAspect()

        this._lastKnownScene = this.scene
    }

    _startAutoAspect() {
        this.scene.on('sizechange', this._updateAspectOnSceneResize, this)
    }
    _stopAutoAspect() {
        this.scene.off('sizechange', this._updateAspectOnSceneResize)
    }

    _updateAspectOnSceneResize({x, y}) {
        this.threeObject3d.aspect = x / y
    }

    // TODO replace with unmountedCallback #150
    deinit() {
        super.deinit()

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
            this._stopAutoAspect()
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
            this._startAutoAspect()
            this.threeObject3d.aspect = this._getDefaultAspect()
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

    _getDefaultAspect() {
        let result = 0

        if ( this.scene ) {
            result = this.scene.calculatedSize.x / this.scene.calculatedSize.y
        }

        // in case of a 0 or NaN (0 / 0 == NaN)
        if (!result) result = 16 / 9

        return result
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
