import 'element-behaviors'
import '../../lib/three/make-global'
import 'three/examples/js/loaders/OBJLoader'
import 'three/examples/js/loaders/MTLLoader'
import {Events} from '../../core/Events'
import Behavior from './Behavior'
type Object3D = import('three').Object3D
type Color = import('three').Color | string | number
type Material = import('three').Material
type RenderItem = import('three').RenderItem

export default class ObjModelBehavior extends Behavior {
    static props = {
        obj: String, // path to obj file
        mtl: String, // path to mtl file
    }

    // TODO no any, should be constrained to Node
    element: any

    // TODO no any
    model: any
    objLoader: any
    mtlLoader: any

    updated(_oldProps: any, modifiedProps: any) {
        if (modifiedProps.obj || modifiedProps.mtl) {
            // TODO if only mtl changes, maybe we can update only the material
            // instead of reloading the whole object?
            if (!this.obj) return
            this.__cleanup()
            this.__loadObj()
        }
    }

    async connectedCallback() {
        super.connectedCallback()
        this.model = null
        this.objLoader = new (THREE as any).OBJLoader() // TODO types for loaders
        this.mtlLoader = new (THREE as any).MTLLoader(this.objLoader.manager)
        // Allow cross-origin images to be loaded.
        this.mtlLoader.crossOrigin = ''

        this.objLoader.manager.onLoad = () => {
            this.element.needsUpdate()
        }
    }

    async disconnectedCallback() {
        super.disconnectedCallback()
        this.__cleanup()
    }

    private __materialIsFromMaterialBehavior = false

    private __cleanup() {
        if (!this.model) return
        disposeObjectTree(this.model, {
            destroyMaterial: !this.__materialIsFromMaterialBehavior,
        })
        this.__materialIsFromMaterialBehavior = false
    }

    private __loadObj() {
        const {obj, mtl, mtlLoader, objLoader} = this

        if (mtl) {
            mtlLoader.setTexturePath(mtl.substr(0, mtl.lastIndexOf('/') + 1))
            mtlLoader.load(mtl, (materials: any) => {
                materials.preload()
                objLoader.setMaterials(materials)
                objLoader.load(obj, (model: any) => this.__setModel(model))
            })
        } else {
            objLoader.load(obj, (model: any) => {
                let materialBehavior = this.element.behaviors.get('basic-material')
                if (!materialBehavior) materialBehavior = this.element.behaviors.get('phong-material')
                if (!materialBehavior) materialBehavior = this.element.behaviors.get('standard-material')
                if (!materialBehavior) materialBehavior = this.element.behaviors.get('lambert-material')

                if (materialBehavior) {
                    this.__materialIsFromMaterialBehavior = true
                    // TODO this part only works on Mesh elements at the
                    // moment. We will update the geometry and material
                    // behaviors to work in tandem with or without a mesh
                    // behavior, and other behaviors can use the geometry or
                    // material features.
                    model.traverse((child: Object3D) => {
                        if ('material' in child) {
                            console.log(materialBehavior.getMeshComponent('material'))
                            ;(child as any).material = materialBehavior.getMeshComponent('material')
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

function setColorPhongMaterial(obj: Object3D, color: Color, dispose?: boolean, traverse = true) {
    const material = new THREE.MeshPhongMaterial()
    material.color = new THREE.Color(color)

    if (traverse) obj.traverse(node => applyMaterial(node, material, dispose))
    else applyMaterial(obj, material, dispose)
}

function applyMaterial(obj: Object3D, material: Material, dispose = true) {
    if (!isRenderItem(obj)) return
    if (dispose && obj.material) disposeMaterial(obj)
    obj.material = material
}

function setRandomColorPhongMaterial(obj: Object3D, dispose?: boolean, traverse?: boolean) {
    const randomColor = (0xffffff / 3) * Math.random() + 0xffffff / 3
    setColorPhongMaterial(obj, randomColor, dispose, traverse)
}

function isRenderItem(obj: any): obj is RenderItem {
    return 'geometry' in obj && 'material' in obj
}

function disposeMaterial(obj: Object3D) {
    if (!isRenderItem(obj)) return

    // because obj.material can be a material or array of materials
    const materials: Material[] = [].concat(obj.material as any)

    for (const material of materials) {
        material.dispose()
    }
}

function disposeObject(obj: Object3D, removeFromParent = true, destroyGeometry = true, destroyMaterial = true) {
    if (isRenderItem(obj)) {
        if (destroyGeometry) obj.geometry.dispose()
        if (destroyMaterial) disposeMaterial(obj)
    }

    removeFromParent &&
        Promise.resolve().then(() => {
            // if we remove children in the same tick then we can't continue traversing,
            // so we defer to the next microtask
            obj.parent && obj.parent.remove(obj)
        })
}

type DisposeOptions = Partial<{
    removeFromParent: boolean
    destroyGeometry: boolean
    destroyMaterial: boolean
}>

function disposeObjectTree(obj: Object3D, disposeOptions: DisposeOptions = {}) {
    obj.traverse(node => {
        disposeObject(
            node,
            disposeOptions.removeFromParent,
            disposeOptions.destroyGeometry,
            disposeOptions.destroyMaterial
        )
    })
}

elementBehaviors.define('obj-model', ObjModelBehavior)

export {ObjModelBehavior}
