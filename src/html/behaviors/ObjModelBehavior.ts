import 'element-behaviors'
import {OBJLoader} from '../../lib/three/OBJLoader'
import {MTLLoader} from '../../lib/three/MTLLoader'
import {Events} from '../../core/Events'
import {RenderableBehavior} from './RenderableBehavior'
import {disposeObjectTree, setRandomColorPhongMaterial, isRenderItem} from '../../utils/three'
import {Object3D} from 'three'
import BaseMaterialBehavior from './BaseMaterialBehavior'
import {reactive, attribute, autorun} from '../../core/Component'

declare global {
    interface Element {
        behaviors: Map<string, unknown>
    }
}

export default class ObjModelBehavior extends RenderableBehavior {
    // static props = {
    //     obj: String, // path to obj file
    //     mtl: String, // path to mtl file
    // }
    // obj!: string
    // mtl!: string

    @reactive
    @attribute
    obj = ''
    @reactive
    @attribute
    mtl = ''
    static tmp_props = {obj: true, mtl: true, ...(RenderableBehavior as any).tmp_props}
    async attributeChangedCallback(attr: string, oldVal: string | null, newVal: string | null) {
        super.attributeChangedCallback(attr, oldVal, newVal)
        if (attr === 'obj' || attr === 'mtl') {
            this[attr] = newVal as any
        }
    }
    loadGL() {
        if (!super.loadGL()) return false

        this.model = null
        this.objLoader = new OBJLoader() // TODO types for loaders
        this.mtlLoader = new MTLLoader(this.objLoader.manager)
        // Allow cross-origin images to be loaded.
        this.mtlLoader.crossOrigin = ''

        this.objLoader.manager.onLoad = () => {
            this.element.needsUpdate()
        }

        autorun(() => {
            // TODO if only mtl changes, maybe we can update only the material
            // instead of reloading the whole object?
            this.mtl
            this.__cleanup()
            this.__loadObj()
        })

        return true
    }
    unloadGL() {
        if (!super.unloadGL()) return false
        this.__cleanup()
        return true
    }

    // TODO no any
    model: any
    objLoader: any
    mtlLoader: any

    // updated(_oldProps: any, modifiedProps: any) {
    //     if (modifiedProps.obj || modifiedProps.mtl) {
    //         // TODO if only mtl changes, maybe we can update only the material
    //         // instead of reloading the whole object?
    //         if (!this.obj) return
    //         this.__cleanup()
    //         this.__loadObj()
    //     }
    // }

    // connectedCallback() {
    //     super.connectedCallback()
    //     MOVED TO loadGL
    // }

    // disconnectedCallback() {
    //     super.disconnectedCallback()
    //     MOVED TO unloadGL
    // }

    private __materialIsFromMaterialBehavior = false

    private __cleanup() {
        if (!this.model) return
        disposeObjectTree(this.model, {
            destroyMaterial: !this.__materialIsFromMaterialBehavior,
        })
        this.model = null
        this.__materialIsFromMaterialBehavior = false
    }

    private __loadObj() {
        const {obj, mtl, mtlLoader, objLoader} = this

        if (!obj) return

        if (mtl) {
            mtlLoader.setResourcePath(mtl.substr(0, mtl.lastIndexOf('/') + 1))
            // TODO if unloadGL was called before this loads, we need to cancel the callback logic
            mtlLoader.load(mtl, (materials: any) => {
                materials.preload()
                objLoader.setMaterials(materials)
                objLoader.load(obj, (model: any) => this.__setModel(model))
            })
        } else {
            objLoader.load(obj, (model: any) => {
                let materialBehavior = this.element.behaviors.get('basic-material') as BaseMaterialBehavior
                if (!materialBehavior)
                    materialBehavior = this.element.behaviors.get('phong-material') as BaseMaterialBehavior
                if (!materialBehavior)
                    materialBehavior = this.element.behaviors.get('standard-material') as BaseMaterialBehavior
                if (!materialBehavior)
                    materialBehavior = this.element.behaviors.get('lambert-material') as BaseMaterialBehavior

                if (materialBehavior) {
                    this.__materialIsFromMaterialBehavior = true
                    // TODO this part only works on Mesh elements at the
                    // moment. We will update the geometry and material
                    // behaviors to work in tandem with or without a mesh
                    // behavior, and other behaviors can use the geometry or
                    // material features.
                    model.traverse((child: Object3D) => {
                        if (isRenderItem(child)) {
                            child.material = materialBehavior.getMeshComponent('material')
                        }
                    })
                } else {
                    // if no material, make a default one with random color
                    setRandomColorPhongMaterial(model)
                }

                this.__setModel(model)
            })
        }
    }

    private __setModel(model: any) {
        this.element.three.add((this.model = model))
        this.element.emit(Events.MODEL_LOAD, {format: 'obj', model: model})
        this.element.needsUpdate()
    }
}

elementBehaviors.define('obj-model', ObjModelBehavior)

export {ObjModelBehavior}
