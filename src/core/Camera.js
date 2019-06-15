import Class from 'lowclass'
import {PerspectiveCamera as ThreePerspectiveCamera} from 'three'
import Motor from './Motor'
import {props} from './props'
import {getSceneProtectedHelper} from './Scene'
import Node from './Node'

const SceneProtected = getSceneProtectedHelper()

// TODO: update this to have a CSS3D-perspective-like API like with the Scene's
// default camera.
export default Class('PerspectiveCamera').extends(Node, ({Super, Public, Private}) => ({
    static: {
        defaultElementName: 'i-perspective-camera',

        // TODO remove attributeChangedCallback, replace with updated based on these props
        props: {
            ...Node.props,
            fov: {...props.number, default: 75},
            aspect: {
                ...props.number,
                default() {
                    return this._getDefaultAspect()
                },
                deserialize(val) {
                    val == null ? this.constructor.props.aspect.default.call(this) : props.number.deserialize(val)
                },
            },
            near: {...props.number, default: 0.1},
            far: {...props.number, default: 1000},
            zoom: {...props.number, default: 1},
            active: {...props.boolean, default: false},
        },
    },

    updated(oldProps, modifiedProps) {
        super.updated(oldProps, modifiedProps)

        if (!this.isConnected) return

        if (modifiedProps.active) {
            this._setSceneCamera(this.active ? undefined : 'unset')
        }
        if (modifiedProps.aspect) {
            if (!this.aspect)
                // default aspect value based on the scene size.
                privateThis._startAutoAspect()
            else privateThis._stopAutoAspect()
        }
        // TODO handle the other props here, remove attributeChangedCallback
    },

    connectedCallback() {
        super.connectedCallback()

        this._lastKnownScene = this.scene
    },

    // TODO, unmountedCallback functionality. issue #150
    unmountedCallback() {},

    attributeChangedCallback(attr, oldVal, newVal) {
        super.attributeChangedCallback(attr, oldVal, newVal)

        if (typeof newVal == 'string') {
            this._attributeAddedOrChanged(attr, newVal)
        } else {
            this._attributeRemoved(attr)
        }
    },

    protected: {
        _makeThreeObject3d() {
            return new ThreePerspectiveCamera(75, 16 / 9, 1, 1000)
        },

        // TODO replace with unmountedCallback #150
        _deinit() {
            super._deinit()

            // TODO we want to call this in the upcoming
            // unmountedCallback, but for now it's harmless but
            // will run unnecessary logic. #150
            this._setSceneCamera('unset')
            this._lastKnownScene = null
        },
    },

    private: {
        _lastKnownScene: null,

        // TODO CAMERA-DEFAULTS, get defaults from somewhere common.
        _attributeRemoved(attr, newVal) {
            if (attr == 'fov') {
                publicThis.three.fov = 75
                publicThis.three.updateProjectionMatrix()
            } else if (attr == 'aspect') {
                this._startAutoAspect()
                publicThis.three.aspect = this._getDefaultAspect()
                publicThis.three.updateProjectionMatrix()
            } else if (attr == 'near') {
                publicThis.three.near = 0.1
                publicThis.three.updateProjectionMatrix()
            } else if (attr == 'far') {
                publicThis.three.far = 1000
                publicThis.three.updateProjectionMatrix()
            } else if (attr == 'zoom') {
                publicThis.three.zoom = 1
                publicThis.three.updateProjectionMatrix()
            } else if (attr == 'active') {
                this._setSceneCamera('unset')
            }
        },

        _attributeAddedOrChanged(attr, newVal) {
            if (attr == 'fov') {
                publicThis.three.fov = parseFloat(newVal)
                publicThis.three.updateProjectionMatrix()
            } else if (attr == 'aspect') {
                this._stopAutoAspect()
                publicThis.three.aspect = parseFloat(newVal)
                publicThis.three.updateProjectionMatrix()
            } else if (attr == 'near') {
                publicThis.three.near = parseFloat(newVal)
                publicThis.three.updateProjectionMatrix()
            } else if (attr == 'far') {
                publicThis.three.far = parseFloat(newVal)
                publicThis.three.updateProjectionMatrix()
            } else if (attr == 'zoom') {
                publicThis.three.zoom = parseFloat(newVal)
                publicThis.three.updateProjectionMatrix()
            } else if (attr == 'active') {
                this._setSceneCamera()
            }
        },

        _startAutoAspect() {
            if (!this._startedAutoAspect) {
                this._startedAutoAspect = true
                this.scene.on('sizechange', this._updateAspectOnSceneResize, this)
            }
        },
        _stopAutoAspect() {
            if (this._startedAutoAspect) {
                this._startedAutoAspect = false
                this.scene.off('sizechange', this._updateAspectOnSceneResize)
            }
        },

        _updateAspectOnSceneResize({x, y}) {
            this.three.aspect = x / y
        },

        _getDefaultAspect() {
            let result = 0

            if (publicThis.scene) {
                result = publicThis.scene.calculatedSize.x / publicThis.scene.calculatedSize.y
            }

            // in case of a 0 or NaN (0 / 0 == NaN)
            if (!result) result = 16 / 9

            return result
        },

        _setSceneCamera(unset) {
            if (unset) {
                // TODO: unset might be triggered before the scene was mounted, so
                // there might not be a last known scene. We won't need this check
                // when we add unmountedCallback. #150
                if (this._lastKnownScene) SceneProtected()(this._lastKnownScene)._removeCamera(publicThis)
            } else {
                if (!publicThis.scene || !publicThis.isConnected) return

                SceneProtected()(publicThis.scene)._addCamera(publicThis)
            }
        },
    },
}))
