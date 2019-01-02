import 'element-behaviors'
import Class from 'lowclass'
import '../../../lib/three/global'
import 'three/examples/js/loaders/OBJLoader'
import 'three/examples/js/loaders/MTLLoader'
import Behavior from './Behavior'

const ObjModel = Class('ObjModel').extends(Behavior, ({Super}) => ({
    static: {
        props: {
            obj: String, // path to obj file
            mtl: String, // path to mtl file
        },
    },

    updated(oldProps, newProps, modifiedProps) {
        if (modifiedProps.obj || modifiedProps.mtl) {
            if (!this.obj) return
            this.cleanup()
            this.load()
        }
    },

    connectedCallback() {
        Super(this).connectedCallback()
        this.model = null
        this.objLoader = new THREE.OBJLoader()
        this.mtlLoader = new THREE.MTLLoader(this.objLoader.manager)
        // Allow cross-origin images to be loaded.
        this.mtlLoader.crossOrigin = ''

        this.objLoader.manager.onLoad = () => {
            this.element._needsToBeRendered()
        }
    },

    disconnectedCallback() {
        Super(this).disconnectedCallback()
        this.cleanup()
    },

    cleanup() {
        if (!this.model) return
        disposeObjectTree(this.model)
    },

    load() {
        const { obj, mtl, mtlLoader, objLoader } = this

        if (mtl) {
            mtlLoader.setTexturePath(mtl.substr(0, mtl.lastIndexOf('/') + 1))
            mtlLoader.load(mtl, materials => {
                materials.preload()
                objLoader.setMaterials(materials)
                objLoader.load(obj, model => this.setModel(model))
            })
        }
        else {
            objLoader.load(obj, model => {
                // if no material, make a default one with random color
                setRandomColorPhongMaterial(model)

                this.setModel(model)
            })
        }
    },

    setModel(model) {
        this.element.three.add(this.model = model)
        this.element.emit('model-loaded', {format: 'obj', model: model})
        this.element._needsToBeRendered()
    },

}))

function setColorPhongMaterial(obj, color, dispose, traverse = true) {
    const material = new THREE.MeshPhongMaterial
    material.color = new THREE.Color( color )

    if (traverse) obj.traverse(node => applyMaterial(node, material))
    else applyMaterial(obj, material)
}

function applyMaterial(obj, material, dispose = true) {
    if (!isRenderItem(obj)) return
    if (dispose && obj.material) disposeMaterial(obj)
    obj.material = material
}

function setRandomColorPhongMaterial(obj, dispose, traverse) {
    const randomColor = 0xffffff/3 * Math.random() + 0xffffff/3
    setColorPhongMaterial( obj, randomColor, dispose, traverse )
}

function isRenderItem(obj) {
  return 'geometry' in obj && 'material' in obj
}

function disposeMaterial(obj) {
  if (!isRenderItem(obj)) return

  // because obj.material can be a material or array of materials
  const materials = [].concat(obj.material)

  for (const material of materials) {
    material.dispose()
  }
}

function disposeObject(
  obj,
  removeFromParent = true,
  destroyGeometry = true,
  destroyMaterial = true
) {
  if (isRenderItem(obj)) {
    if (destroyGeometry) obj.geometry.dispose()
    if (destroyMaterial) disposeMaterial(obj)
  }

  removeFromParent && Promise.resolve().then(() => {
    // if we remove children in the same tick then we can't continue traversing,
    // so we defer to the next microtask
    obj.parent && obj.parent.remove(obj)
  })
}

function disposeObjectTree(obj, disposeOptions = {}) {
  obj.traverse(node => {
    disposeObject(
      node,
      disposeOptions.removeFromParent,
      disposeOptions.destroyGeometry,
      disposeOptions.destroyMaterial
    )
  })
}

elementBehaviors.define('obj-model', ObjModel)

export default ObjModel
