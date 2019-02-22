import * as THREE from 'three'

export function isRenderItem(obj) {
  return 'geometry' in obj && 'material' in obj
}

export function disposeMaterial(obj) {
  if (!isRenderItem(obj)) return

  // because obj.material can be a material or an array of materials
  const materials = [].concat(obj.material)

  for (const material of materials) {
    material.dispose()
  }
}

export function disposeObject(
  obj,
  removeFromParent = true,
  destroyGeometry = true,
  destroyMaterial = true
) {
  if (isRenderItem(obj)) {
    if (destroyGeometry) obj.geometry.dispose()
    if (destroyMaterial) disposeMaterial(obj)
  }

  obj.dispose && obj.dispose()

  removeFromParent && Promise.resolve().then(() => {
    // if we remove children in the same tick then we can't continue traversing,
    // so we defer to the next microtask
    obj.parent && obj.parent.remove(obj)
  })
}

export function disposeObjectTree(obj, disposeOptions = {}) {
  obj.traverse(node => {
    disposeObject(
      node,
      disposeOptions.removeFromParent,
      disposeOptions.destroyGeometry,
      disposeOptions.destroyMaterial
    )
  })
}

export function quaternionApproximateEquals(a, b, epsilon) {
  return Math.abs(a.x - b.x) < epsilon
    && Math.abs(a.y - b.y) < epsilon
    && Math.abs(a.z - b.z) < epsilon
    && Math.abs(a.w - b.w) < epsilon
}
