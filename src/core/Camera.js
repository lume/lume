import Class from 'lowclass'
import Node from './Node'
import Motor from './Motor'

import { PerspectiveCamera as ThreePerspectiveCamera } from 'three'

// TODO: update this to have a CSS3D-perspective-like API like with the Scene's
// default camera.
export default
Class('PerspectiveCamera').extends( Node, ({ Super, Public, Private }) => ({

    static: {
        defaultElementName: 'i-perspective-camera',

        observedAttributes: (Node.observedAttributes || []).concat( [
            'active',
            'fov',
            'near',
            'far',
            'aspect',
            'zoom',
        ].map( a => a.toLowerCase() ) ),
    },

    async construct(options = {}) {
        Super(this).construct(options)

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
    },

    makeThreeObject3d() {
        return new ThreePerspectiveCamera(75, 16/9, 1, 1000)
    },

    mountedCallback() {
        const privateThis = Private(this)

        // default aspect value based on the scene size.
        if ( ! this.hasAttribute( 'aspect' ) ) privateThis._startAutoAspect()

        privateThis._lastKnownScene = this.scene
    },

    // TODO replace with unmountedCallback #150
    deinit() {
        Super(this).deinit()

        // TODO we want to call this in the upcoming
        // unmountedCallback, but for now it's harmless but
        // will run unnecessary logic. #150
        Private(this)._setSceneCamera( 'unset' )
    },

    // TODO, unmountedCallback functionality. issue #150
    unmountedCallback() {},

    attributeChangedCallback( attr, oldVal, newVal ) {
        Super(this).attributeChangedCallback( attr, oldVal, newVal )

        if ( typeof newVal == 'string' ) {
            Private(this)._attributeAddedOrChanged( attr, newVal )
        }
        else {
            Private(this)._attributeRemoved( attr )
        }
    },

    private: {
        _lastKnownScene: null,

        // TODO CAMERA-DEFAULTS, get defaults from somewhere common.
        _attributeRemoved(attr, newVal) {
            const publicThis = Public(this)

            if ( attr == 'fov' ) {
                publicThis.threeObject3d.fov = 75
                publicThis.threeObject3d.updateProjectionMatrix()
            }
            else if ( attr == 'aspect' ) {
                this._startAutoAspect()
                publicThis.threeObject3d.aspect = this._getDefaultAspect()
                publicThis.threeObject3d.updateProjectionMatrix()
            }
            else if ( attr == 'near' ) {
                publicThis.threeObject3d.near = 0.1
                publicThis.threeObject3d.updateProjectionMatrix()
            }
            else if ( attr == 'far' ) {
                publicThis.threeObject3d.far = 1000
                publicThis.threeObject3d.updateProjectionMatrix()
            }
            else if ( attr == 'zoom' ) {
                publicThis.threeObject3d.zoom = 1
                publicThis.threeObject3d.updateProjectionMatrix()
            }
            else if ( attr == 'active' ) {
                this._setSceneCamera( 'unset' )
            }
        },

        _attributeAddedOrChanged(attr, newVal) {
            const publicThis = Public(this)

            if ( attr == 'fov' ) {
                publicThis.threeObject3d.fov = parseFloat(newVal)
                publicThis.threeObject3d.updateProjectionMatrix()
            }
            else if ( attr == 'aspect' ) {
                this._stopAutoAspect()
                publicThis.threeObject3d.aspect = parseFloat(newVal)
                publicThis.threeObject3d.updateProjectionMatrix()
            }
            else if ( attr == 'near' ) {
                publicThis.threeObject3d.near = parseFloat(newVal)
                publicThis.threeObject3d.updateProjectionMatrix()
            }
            else if ( attr == 'far' ) {
                publicThis.threeObject3d.far = parseFloat(newVal)
                publicThis.threeObject3d.updateProjectionMatrix()
            }
            else if ( attr == 'zoom' ) {
                publicThis.threeObject3d.zoom = parseFloat(newVal)
                publicThis.threeObject3d.updateProjectionMatrix()
            }
            else if ( attr == 'active' ) {
                this._setSceneCamera()
            }
        },

        _startAutoAspect() {
            if (!this._startedAutoAspect) {
                this._startedAutoAspect = true
                Public(this).scene.on('sizechange', this._updateAspectOnSceneResize, this)
            }
        },
        _stopAutoAspect() {
            if (this._startedAutoAspect) {
                this._startedAutoAspect = false
                Public(this).scene.off('sizechange', this._updateAspectOnSceneResize)
            }
        },

        _updateAspectOnSceneResize({x, y}) {
            Public(this).threeObject3d.aspect = x / y
        },

        _getDefaultAspect() {
            let result = 0

            const publicThis = Public(this)

            if ( publicThis.scene ) {
                result = publicThis.scene.calculatedSize.x / publicThis.scene.calculatedSize.y
            }

            // in case of a 0 or NaN (0 / 0 == NaN)
            if (!result) result = 16 / 9

            return result
        },

        async _setSceneCamera( unset ) {

            const publicThis = Public(this)

            if ( unset ) {

                // TODO: unset might be triggered before the scene was mounted, so
                // there might not be a last known scene. We won't need this check
                // when we add unmountedCallback. #150
                if ( this._lastKnownScene )
                    this._lastKnownScene._removeCamera( publicThis )
            }
            else {

                // wait to be mounted, because otherwise there isn't a scene to
                // set the active camera on.
                // TODO: needs to be cancellable. #150
                if (! publicThis._mounted ) await publicThis.mountPromise

                publicThis.scene._addCamera( publicThis )
            }
        },
    },
}))
