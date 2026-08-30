# Behavior Elements Migration Status

This document tracks the migration of Lume's element behaviors (old `has=` attribute pattern)
to behavior-elements (new Custom Elements as child elements pattern).

## Why

The old behavior system had attribute conflicts, no type safety, unclear ownership,
and maintenance issues. Behavior-elements solve this by converting behaviors to
custom elements that are children of the host:

**Before:** `<lume-points has="ply-geometry phong-material" src="./model.ply" color="#003333">`
**After:** `<lume-points><lume-ply-geometry slot="geometry" src="./model.ply"></lume-ply-geometry><lume-phong-material slot="material" color="#003333"></lume-phong-material></lume-points>`

Key architectural changes:

- `extends Behavior` → `extends HTMLElement`
- `this.element` → `this.parentElement`
- `@behavior` → `@element('element-name')`
- Removed `@receiver` decorators and `PropReceiver` dependencies

**Branch:** `copilot/fix-be31a400-3afb-4da8-9fa3-253b2751fda0`

---

## Migration Overview

### Before (Element Behaviors)

```html
<lume-points has="ply-geometry phong-material" src="./model.ply" color="#003333"></lume-points>
```

### After (Behavior Elements)

```html
<lume-points>
  <lume-ply-geometry src="./model.ply" slot="geometry"></lume-ply-geometry>
  <lume-phong-material color="#003333" slot="material"></lume-phong-material>
</lume-points>
```

---

## ✅ What Has Been Done

### 1. New `src/behavior-elements/` Package Created (31 files)

**Base classes:**

- `Behavior.ts` — abstract base class for behavior elements
- `RenderableBehavior.ts` — base for renderable behaviors
- `utils.ts` — shared utilities
- `index.ts` — barrel exports

**Mesh behavior base classes:**

- `mesh-behaviors/MeshBehaviorEl.ts` — base class for mesh behaviors
- `mesh-behaviors/Clipper.ts` — clip planes behavior element
- `mesh-behaviors/GeometryOrMaterialBehaviorEl.ts` — shared base for geometry/material behaviors

**Geometries (ported from `src/behaviors/mesh-behaviors/geometries/`):**

- ✅ `BoxGeometry.ts` → `<lume-box-geometry>`
- ✅ `LineGeometry.ts` → `<lume-line-geometry>`
- ✅ `MixedplaneGeometry.ts` → `<lume-mixedplane-geometry>`
- ✅ `PlaneGeometry.ts` → `<lume-plane-geometry>`
- ✅ `PlyGeometry.ts` → `<lume-ply-geometry>`
- ✅ `RoundedrectGeometry.ts` → `<lume-roundedrect-geometry>`
- ✅ `ShapeGeometry.ts` → `<lume-shape-geometry>`
- ✅ `SphereGeometry.ts` → `<lume-sphere-geometry>`
- ✅ `TorusGeometry.ts` → `<lume-torus-geometry>`
- ✅ `GeometryBehaviorEl.ts` — shared base class

**Materials (ported from `src/behaviors/mesh-behaviors/materials/`):**

- ✅ `BasicMaterial.ts` → `<lume-basic-material>`
- ✅ `LambertMaterial.ts` → `<lume-lambert-material>`
- ✅ `BasiclineMaterial.ts` → `<lume-basicline-material>`
- ✅ `MixedplaneMaterial.ts` → `<lume-mixedplane-material>`
- ✅ `PhongMaterial.ts` → `<lume-phong-material>`
- ✅ `PhysicalMaterial.ts` → `<lume-physical-material>`
- ✅ `PointsMaterial.ts` → `<lume-points-material>`
- ✅ `ProjectedMaterial.ts` → `<lume-projected-material>`
- ✅ `ShaderMaterial.ts` → `<lume-shader-material>`
- ✅ `StandardMaterial.ts` → `<lume-standard-material>`
- ✅ `MaterialBehaviorEl.ts` — shared base class

### 2. ✅ Mesh Classes Migrated to Slot/Template Pattern (via `_defaultGeometry`/`_defaultMaterial`)

All core mesh classes in `src/meshes/` now define their default geometry and material via
`protected _defaultGeometry` and `protected _defaultMaterial` overrides (inherited from the
abstract `MeshLike` base class). The shared template with `<Show>` guards and `<slot>` elements
lives in `MeshLike` — individual subclasses only override the defaults they need to change:

| File                  | Extends   | Overrides `_defaultGeometry`           | Overrides `_defaultMaterial`                | Status        |
| --------------------- | --------- | -------------------------------------- | ------------------------------------------- | ------------- |
| `Mesh.ts`             | MeshLike  | _(none — box geometry from MeshLike)_  | _(none — physical material from MeshLike)_  | ✅            |
| `Box.ts`              | Mesh      | _(none — inherits Mesh's box default)_ | _(none — inherits Mesh's physical default)_ | ✅            |
| `Sphere.ts`           | Mesh      | `<lume-sphere-geometry>`               | _(none)_                                    | ✅            |
| `Plane.ts`            | Mesh      | `<lume-plane-geometry>`                | _(none)_                                    | ✅            |
| `Torus.ts`            | Mesh      | `<lume-torus-geometry>`                | _(none)_                                    | ✅            |
| `Shape.ts`            | Mesh      | `<lume-shape-geometry>`                | _(none)_                                    | ✅            |
| `RoundedRectangle.ts` | Mesh      | `<lume-roundedrect-geometry>`          | _(none)_                                    | ✅            |
| `MixedPlane.ts`       | Mesh      | `<lume-mixedplane-geometry>`           | `<lume-mixedplane-material>`                | ✅            |
| `Line.ts`             | MeshLike  | `<lume-line-geometry>`                 | `<lume-basicline-material>`                 | ✅            |
| `Points.ts`           | MeshLike  | _(none — box geometry from MeshLike)_  | `<lume-points-material>`                    | ✅            |
| `InstancedMesh.ts`    | Mesh      | _(custom slot handling)_               | _(custom slot handling)_                    | ✅            |
| `MeshLike.ts`         | Element3D | `<lume-box-geometry>` (base default)   | `<lume-physical-material>` (base default)   | ✅ (abstract) |

### 3. Examples Migrated

These examples have been updated to use child behavior elements:

| Example                                    | Status                                                                                              |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `examples/ply-geometry.html`               | ✅ Uses `<lume-ply-geometry>` and `<lume-phong-material>` / `<lume-points-material>` as children    |
| `examples/autolayout.html`                 | ✅ Uses `<lume-sphere-geometry>`, `<lume-basic-material>`, `<lume-mixedplane-material>` as children |
| `examples/shader-material.html`            | ✅ Uses `<lume-shader-material>` child element                                                      |
| `examples/torus.html`                      | ✅ Uses `<lume-physical-material>` child element                                                    |
| `examples/camera-rig.html`                 | ✅ Uses `<lume-phong-material>` child elements                                                      |
| `examples/line.html`                       | ✅ Uses `<lume-basicline-material>`, `<lume-line-geometry>` child elements                          |
| `examples/lume-inside-threejs.html`        | ✅ Uses `<lume-physical-material slot="material">` children                                         |
| `examples/instanced-mesh.html`             | ✅ Uses `<lume-sphere-geometry slot="geometry">` child                                              |
| `examples/instanced-mesh-nimble-html.html` | ✅ Uses `<lume-sphere-geometry slot="geometry">` child                                              |

### 4. Framework Types Added

All 21 elements that were missing framework types now have:

- **Solid.js + DOM types** in each element's `.ts` file (always present)
- **React types** in separate `.react-jsx.d.ts` files (opt-in)
- **4 new React index files** and **2 updated index files** for the chain

All 53 concrete custom elements in `src/` now have complete framework types.
See `dev-docs/2_behavior-element-type-declarations.md` for the patterns and conventions.

---

## ❌ Remaining Work

### 1. ✅ Remove deprecated `@reactive` class decorator from 5 classes

```ts
// src/interaction/FlingRotation.ts:29
// CONTINUE Remove @reactive usages
@reactive
class FlingRotation extends Effects {
```

The `@reactive` decorator is **deprecated** in `classy-solid`. In the latest API,
`@signal` and `@effect` work without any class-level decorator — `@reactive` is now
just an alias for `@untracked`. **The fix is to simply delete the `@reactive` decorator.**
The class's `@signal` properties and `@effect` methods continue working fine without it.

| File                                  | Line | Class                |
| ------------------------------------- | ---- | -------------------- |
| `src/interaction/ScrollFling.ts`      | 26   | `ScrollFling`        |
| `src/interaction/FlingRotation.ts`    | 32   | `FlingRotation`      |
| `src/interaction/PinchFling.ts`       | 13   | `PinchFling`         |
| `src/xyz-values/XYZValues.ts`         | 25   | `XYZValues`          |
| `src/renderers/WebglRendererThree.ts` | 39   | `WebglRendererThree` |

### 2. Migrate old `this.createEffect()` calls to `@effect` decorators, then remove manual `stopEffects()`/`startEffects()`

Two related CONTINUE comments:

**`src/layouts/Autolayout.ts:86`:**

```ts
// CONTINUE converting effects to use @effect in all classes except deprecated behaviors
```

**`src/interaction/FlingRotation.ts:225`:**

```ts
// CONTINUE Fix/update/delete all stopEffects() usage.
this.stopEffects()
```

`this.stopEffects()` is a valid method inherited from `Effects`. However, once
old-style `this.createEffect()` calls are migrated to `@effect` decorators, manual
`stopEffects()`/`startEffects()` calls become unnecessary. The base `Element` class from
`@lume/element` automatically starts effects in `connectedCallback` and stops them in
`disconnectedCallback` when using `@effect`-decorated methods — so classes extending
Lume elements get this lifecycle for free.

**Steps:**

1. Replace `this.createEffect(() => { ... })` calls with `@effect`-decorated methods.
2. Remove manual `stopEffects()`/`startEffects()` calls where the `@lume/element`
   lifecycle covers it.

### 3. ✅ Replace `InitialBehaviors` mixin / `setBehaviors()` with child behavior elements

```ts
// src/behaviors/InitialBehaviors.ts:26
// CONTINUE replace usages with child behavior elements.
export function setBehaviors(el: Element, behaviors: Record<string, string>, replace = true) {
```

The `InitialBehaviors` mixin and `setBehaviors()` function are still used and need to be
eliminated:

**a) ✅ `RoundedRectangle.ts` — migrated from `initialBehaviors` to slot/template pattern**

```ts
// src/meshes/RoundedRectangle.ts:12
class RoundedRectangle extends Mesh {
  override initialBehaviors = {geometry: 'rounded-rectangle', material: 'physical'}
}
```

Migrate to the slot/template pattern like all other meshes:

```ts
override template = () => html`
    <${Show} when=${() => !this.has.split(/\s+/).some(v => v.endsWith('-geometry'))}>
        <slot name="geometry">
            <lume-roundedrect-geometry></lume-roundedrect-geometry>
        </slot>
    </>
    <${Show} when=${() => !this.has.split(/\s+/).some(v => v.endsWith('-material'))}>
        <slot name="material">
            <lume-physical-material></lume-physical-material>
        </slot>
    </>
    <slot></slot>
`
```

**b) ✅ `threeToLume.ts` — replaced `setBehaviors()` with `<lume-projected-material>` child element**

```ts
// src/utils/three/threeToLume.ts:65
// CONTINUE: convert to child element behavior
setBehaviors(el, {material: 'projected'})
```

Update to create a `<lume-projected-material>` child element instead.

### 4. ✅ Verify/update stale CONTINUE reminders about mesh migration

Two CONTINUE comments on already-migrated classes — removed once `RoundedRectangle.ts` was migrated:

- `src/meshes/Sphere.ts:33` — `// CONTINUE: migrate all meshes to new behavior element system with slots`
- `src/meshes/Plane.ts:27` — `// CONTINUE make sure we updated all meshes`

These can be removed once `RoundedRectangle.ts` is migrated (see item 3a).

### 5. ✅ Update JSDoc comments to reference new behavior element classes

```ts
// src/meshes/Points.ts:27
// CONTINUE update jsdoc comments to point to new behavior classes
```

All JSDoc markdown links in mesh classes already point to `../behavior-elements/mesh-behaviors/...`
— no links to the old `../behaviors/` remain. The model classes (GltfModel, FbxModel, etc.)
had dead links to non-existent `behavior-elements/mesh-behaviors/models/` — those were
removed since model behaviors are intentionally not ported.

### 6. ✅ Update example still using old `has=` attribute

`examples/tests/test.html` line 114:

```html
<lume-mesh has="sphere-geometry basic-material" size="10 10 10" color="#ffffcc" ...></lume-mesh>
```

Update to:

```html
<lume-mesh size="10 10 10">
  <lume-sphere-geometry></lume-sphere-geometry>
  <lume-basic-material color="#ffffcc"></lume-basic-material>
  ...
</lume-mesh>
```

### 7. ✅ Verify/replace non-prefixed behavior element names

Two examples use `<basic-material>` (without `lume-` prefix):

- `examples/instanced-mesh.html:16`
- `examples/instanced-mesh-nimble-html.html:16`

Check against the current element registration to verify they work, or update to
`<lume-basic-material>`.

### 8. Investigate CSS scene `matrixWorldAutoUpdate`

```ts
// src/core/Scene.ts:722
// CONTINUE apparently we weren't applying matrixWorldAutoUpdate=false to the CSS scene. Do we need to?
```

The CSS 3D scene in `makeThreeCSSObject()` may or may not need `matrixWorldAutoUpdate = false`.

### 9. ✅ Untangle `SharedAPI` from `CompositionTracker` → [Plan](dev-docs/3_untangle-sharedapi-compositiontracker.md)

### 10. Review `untrack()` wrapper in GeometryOrMaterialBehaviorEl

```ts
// src/behavior-elements/mesh-behaviors/GeometryOrMaterialBehaviorEl.ts:51
// CONTINUE remove untrack if not needed
untrack(() => {
  this.composedParent!.three[this.type] = newComponent
})
```

Performance/correctness investigation: determine if the `untrack()` wrapper is necessary.

### 11. ✅ Wrap element names in angle brackets in JSDoc

```ts
// src/behavior-elements/mesh-behaviors/geometries/PlyGeometry.ts:15
 * CONTINUE: add <> brackets to all "Element: " mentions in docs
 * Element: `<lume-ply-geometry>`
```

All 21 behavior-element files already have angle-bracketed element names
(e.g. `Element: <lume-ply-geometry>`). The stale CONTINUE comment in
`PlyGeometry.ts` was removed — nothing else needed.

### 12. ✅ Move material attributes from mesh elements to child material behavior elements

When mesh classes used the old `initialBehaviors` pattern (or `has=` attribute), material
properties like `color`, `roughness`, `opacity`, etc. set directly on the mesh element were
forwarded to the material behavior. Now that default behaviors are rendered as child
elements via slots, these attributes must be on the child material element instead.

**Example — before (broken):**

```html
<lume-sphere color="orange" roughness="0.4" transmission="0.99"></lume-sphere>
```

**After (correct):**

```html
<lume-sphere>
  <lume-physical-material color="orange" roughness="0.4" transmission="0.99"></lume-physical-material>
</lume-sphere>
```

**Material attributes that commonly appear on mesh elements and need migration:**
`color`, `opacity`, `texture`, `sidedness`, `wireframe`, `dithering`, `emissive`,
`roughness`, `metalness`, `transmission`, `ior` (`refractiveIndex`), `reflectivity`,
`thickness`, `clearcoat`, `shininess`, `specular`, `bumpMap` (`bump-map`),
`specularMap` (`specular-map`), `alphaMap`, `aoMap`, `normalMap`, `displacementMap`,
`alphaTest` (`alpha-test`), `bumpScale` (`bump-scale`), `sizeAttenuation`, `pointSize`,
and others from `MaterialBehaviorEl`, `PhysicalMaterial`, `StandardMaterial`, `PhongMaterial`,
`BasicMaterial`, `LambertMaterial`, `PointsMaterial`, `BasiclineMaterial`, and
`ShaderMaterial` classes.

**Files needing migration:**

| File                                                  | Element(s)                                   | Attributes to move                                                                 | Also has `has=`?                                                           |
| ----------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `apps/docs/examples/lava-lamp/example.html`           | `<lume-sphere>`                              | `color`, `roughness`, `transmission`, `ior`, `thickness`, `sidedness`              | no (using `initialBehaviors`)                                              |
| `apps/docs/examples/hello-world/example.html`         | `<lume-sphere>` (stars, earth, clouds, moon) | `texture`, `sidedness`, `color`, `bump-map`, `specular-map`, `opacity`             | yes (`has="basic-material"`)                                               |
| `apps/docs/examples/spotlight.html`                   | `<lume-sphere>` (×3), `<lume-box>`           | `color`                                                                            | yes (`has="basic-material"`)                                               |
| `apps/docs/examples/texture-shadow/example.html`      | `<lume-plane>`                               | `texture`, `alpha-test`, `opacity`, `sidedness`                                    | no (has CONTINUE comment, already has child material but attrs duplicated) |
| `apps/docs/examples/buttons-with-shadow/example.html` | `<lume-plane>`, `<lume-mesh>`                | `color`, `texture`, `bump-map`, `bump-scale`, `shininess`, `specular`, `dithering` | yes (`has="phong-material"`, `has="sphere-geometry basic-material"`)       |
| `apps/docs/examples/disco-helmet/example.html`        | `<lume-plane>`                               | `color`, `shininess`                                                               | yes (`has="phong-material"`)                                               |
| `apps/docs/examples/rounded-rectangle.md`             | `<lume-rounded-rectangle>` (×2)              | `color`, `sidedness`, `wireframe`                                                  | no (uses `initialBehaviors`)                                               |
| `apps/docs/examples/velodyne-lidar-scan/example.html` | `<lume-points>`                              | `color`                                                                            | yes (`has="ply-geometry ...-material"`)                                    |
| `apps/docs/examples/shelby-gt350-points/example.html` | `<lume-points>`                              | `color`                                                                            | yes (`has="ply-geometry ...-material"`)                                    |
| `apps/docs/examples/nasa-astrobee-robot/README.md`    | `<lume-sphere>` (×8)                         | `sidedness`                                                                        | yes (`has="basic-material"`)                                               |
| `src/examples/FlickeringOrb.ts`                       | `<lume-sphere>`                              | `color`, `opacity`                                                                 | yes (`has="basic-material"`)                                               |
| `examples/shimmer-cube/shimmer-cube.js`               | `<lume-box>`                                 | `color`, `opacity`, `roughness`                                                    | yes (`has="physical-material"`) + CONTINUE comment                         |

**Note:** Some files above are done, but additional `has=` occurrences remain across
`apps/docs/` and elsewhere. See item 14 below.

### 13. ✅ Replace `.behaviors.get()` calls — access child elements or model elements directly

The `.behaviors` property (from `element-behaviors` library) returns old-style behaviors defined
via the `has=` attribute or `initialBehaviors`. Now that behaviors are child elements, code that
calls `element.behaviors.get('some-behavior')` needs to instead find the child behavior element
or interact with the model element directly.

**`apps/docs/examples/skateboard-configurator/example.html:442`:**

```js
const modelBehavior = skateboardModel.behaviors.get('gltf-model')
```

`skateboardModel` is `<lume-gltf-model>`, a standalone custom element — `.behaviors` won't
have a `gltf-model` entry. Fix: access `skateboardModel` directly (it IS the model element).

**`apps/docs/intro-example.html:155,167`** (has CONTINUE comments):

```js
// CONTINUE access child element behavior
const mat = targetBox.behaviors.get('shader-material')
```

Fix: find the `<lume-shader-material>` child element instead, e.g.:

```js
const mat = targetBox.querySelector('lume-shader-material')
```

**`apps/website/public/sample.html:463`:**
Same as skateboard-configurator — `skateboardModel.behaviors.get('gltf-model')`.

**`src/meshes/InstancedMesh.ts:170,173`:**
Already has a graceful fallback to `assignedElements()` on slot, so `.behaviors` is a
fallback — but the `.behaviors` path should be removed once thoroughly verified.

### 14. ✅ Migrate remaining `has=`, geometry attributes, and material attributes across `apps/docs/` and examples

**Complete list of behavior-element attributes:**

_Material behavior attributes (from `MaterialBehaviorEl`, `PhysicalMaterial`, `StandardMaterial`, `PhongMaterial`, `BasicMaterial`, `LambertMaterial`, `PointsMaterial`, `BasiclineMaterial`, `ShaderMaterial`, `ProjectedMaterial`, `MixedplaneMaterial`):_
`color`, `emissive`, `specular`, `texture`, `materialOpacity` (`opacity` on mesh elements is ok),
`sidedness`, `wireframe`, `dithering`, `fog`, `flatShading`, `depthTest`, `depthWrite`,
`colorWrite`, `alphaTest`, `reflectivity`, `refractiveIndex` (`ior`), `transmission`,
`roughness`, `metalness`, `shininess`, `clearcoat`, `clearcoatRoughness`, `emissiveIntensity`,
`specularMap`, `bumpMap`, `bumpScale`, `normalMap`, `normalScale`, `alphaMap`, `aoMap`,
`aoMapIntensity`, `displacementMap`, `displacementScale`, `displacementBias`, `envMap`,
`emissiveMap`, `lightMap`, `lightMapIntensity`, `metalnessMap`, `roughnessMap`,
`transmissionMap`, `sizeAttenuation`, `pointSize`, `vertexTangents`, `morphTargets`,
`morphNormals`, `vertexShader`, `fragmentShader`, `uniforms`, `textureProjectors`.

_Geometry behavior attributes (from `BoxGeometry`, `PlaneGeometry`, `SphereGeometry`,
`TorusGeometry`, `LineGeometry`, `ShapeGeometry`, `RoundedrectGeometry`,
`MixedplaneGeometry`, `PlyGeometry`):_
`widthSegments`, `heightSegments`, `horizontalSegments`, `verticalSegments`, `radialSegments`,
`tubularSegments`, `curveSegments`, `bevelSegments`, `tubeThickness`, `arc`, `bevel`,
`bevelThickness`, `centerGeometry`, `cornerRadius`, `thickness`, `quadraticCorners`,
`shape`, `fitment`, `points`, `src`.

_Clipper attributes (from `Clipper`):_
`clipPlanes`, `clipIntersection`, `clipShadows`, `flipClip`, `clipDisabled`.

**Migration status per file:**

| File                                                      | Status  | Notes                                                                                                                   |
| --------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| `apps/docs/examples/lava-lamp/example.html`               | ✅ Done | `<lume-sphere>` → `<lume-physical-material>` with `color`, `roughness`, `transmission`, `ior`, `thickness`, `sidedness` |
| `apps/docs/examples/hello-world/example.html`             | ✅ Done | Stars, earth, clouds, moon → slot material children                                                                     |
| `apps/docs/examples/spotlight.html`                       | ✅ Done | 3× `<lume-sphere>` + `<lume-box>` → `<lume-basic-material>` + `<lume-physical-material>`                                |
| `apps/docs/examples/texture-shadow/example.html`          | ✅ Done | `<lume-plane>` → `<lume-physical-material>` with slot                                                                   |
| `apps/docs/examples/buttons-with-shadow/example.html`     | ✅ Done | `<lume-plane>` → `<lume-phong-material>`, `<lume-mesh>` → `<lume-sphere-geometry>` + `<lume-basic-material>`            |
| `apps/docs/examples/disco-helmet/example.html`            | ✅ Done | `<lume-plane>` → `<lume-phong-material>`                                                                                |
| `apps/docs/examples/rounded-rectangle.md`                 | ✅ Done | 2× `<lume-rounded-rectangle>` → `<lume-physical-material>`                                                              |
| `apps/docs/examples/velodyne-lidar-scan/example.html`     | ✅ Done | `<lume-points>` → `<lume-ply-geometry>` + `<lume-phong-material>`                                                       |
| `apps/docs/examples/shelby-gt350-points/example.html`     | ✅ Done | `<lume-points>` → `<lume-ply-geometry>` + `<lume-phong-material>`                                                       |
| `apps/docs/examples/nasa-astrobee-robot/README.md`        | ✅ Done | 8× `<lume-sphere>` → `<lume-basic-material>`, 1× luna station sphere                                                    |
| `apps/docs/examples/skateboard-configurator/example.html` | ✅ Done | `<lume-mesh>` → `<lume-sphere-geometry>` + `<lume-basic-material>`                                                      |
| `apps/docs/examples/autolayout.md`                        | ✅ Done | `<lume-mesh>` → `<lume-sphere-geometry>` + `<lume-basic-material>`                                                      |
| `apps/docs/examples/hello-vr.md`                          | ✅ Done | `<lume-box>` → `<lume-physical-material>`                                                                               |
| `apps/docs/intro-example.html`                            | ✅ Done | `<lume-sphere>` (×2), `<lume-shape>` → material + geometry children, JS `.shape` + `.children[0]` → `querySelector`     |
| `apps/docs/js/PictureFrameScene.js`                       | ✅ Done | 6+ `has=` replaced with behavior children                                                                               |
| `apps/docs/js/utils.js`                                   | ✅ Done | `projectedTextureExample` box, `meshExample`, shapes → geometry/material children, `setAttribute` handlers updated      |
| `apps/docs/guide/making-a-scene.md`                       | ✅ Done | 4× `<lume-sphere>` + `<lume-box>` → material children                                                                   |
| `apps/docs/guide/positioning/README.md`                   | ✅ Done | 6× `<lume-box>` + `<lume-sphere>` → material children                                                                   |
| `apps/docs/guide/external-assets/README.md`               | ✅ Done | 2× `<lume-sphere>` → material children, prose updated                                                                   |
| `apps/docs/guide/sizing.md`                               | ✅ Done | Stale CONTINUE comments removed, already using behavior elements                                                        |
| `src/examples/FlickeringOrb.ts`                           | ✅ Done | `<lume-sphere>` → `<lume-basic-material>`                                                                               |
| `examples/shimmer-cube/shimmer-cube.js`                   | ✅ Done | `<lume-box>` → `<lume-physical-material>`                                                                               |
| `apps/docs/guide/cameras/default-camera.html`             | ✅ Done | Already targets child material element via `el.children[0]`                                                             |
| `examples/torus.html`                                     | ✅ Done | `tube-thickness` → `<lume-torus-geometry>`, `slot="material"` added                                                     |
| `apps/website/public/create/create.ts`                    | ✅ Done | 4× `has="phong-material"` + `color=` → `<lume-phong-material slot="material">` children                                 |
| `apps/website/public/elements/HomePage.ts`                | ✅ Done | 3× `has="basic-material"` → `<lume-basic-material slot="material">` children                                            |
| `apps/website/public/sample.html`                         | ✅ Done | `<lume-mesh has="sphere-geometry basic-material" color="white">` → `<lume-sphere-geometry>` + `<lume-basic-material>`   |

### 15. ✅ Rename `opacity` to `material-opacity` on material behavior elements

The material behavior elements use `material-opacity` (not `opacity`) as their attribute
name. Files that were updated during item 12 may have used `opacity` incorrectly and need
correction. Additionally, some files still have `opacity` on mesh elements (to be moved
during item 14 migration).

### 16. ✅ Add framework types (Solid.js, DOM, React) for behavior elements and PushPaneLayout

All new behavior elements (ported from the old `has=` pattern) were missing their framework
types. Each Lume custom element needs **framework types** so it can be used with full type
safety across frameworks. The DOM is itself one framework, alongside Solid.js and React;
more frameworks (Svelte, Vue, etc.) will be added later using the same pattern.
Additionally, `<lume-push-pane-layout>` (`src/layouts/PushPaneLayout.ts`) was also missing
all framework types.

**Framework types currently supported per element:**

| Framework | Location                                               | Helper type                                             |
| --------- | ------------------------------------------------------ | ------------------------------------------------------- |
| Solid.js  | same `.ts` file as the class (default, always present) | `ElementAttributes` from `@lume/element`                |
| DOM       | same `.ts` file as the class                           | `HTMLElementTagNameMap` global                          |
| React     | separate sibling `.react-jsx.d.ts` file (opt-in)       | `ReactElementAttributes` from `@lume/element/src/react` |

**Pattern for each custom element (see `dev-docs/2_behavior-element-type-declarations.md` for full reference):**

```ts
// 1. Export an Attributes type (add if missing — BoxGeometry and MixedplaneGeometry lack one):
export type ExampleElementAttributes = ParentAttributes | 'customProp'

// 2. Solid.js framework types — at bottom of the element's .ts file:
declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'lume-example': ElementAttributes<ExampleElement, ExampleElementAttributes>
    }
  }
}

// 3. DOM framework types — at bottom of the element's .ts file:
declare global {
  interface HTMLElementTagNameMap {
    'lume-example': ExampleElement
  }
}

// 4. React framework types — separate sibling file ExampleElement.react-jsx.d.ts:
import type {ExampleElement, ExampleElementAttributes} from './ExampleElement'
import type {ReactElementAttributes} from '@lume/element/src/react'
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lume-example': ReactElementAttributes<ExampleElement, ExampleElementAttributes>
    }
  }
}

// 5. React index — every directory with elements needing React types gets an
//    `index.react-jsx.d.ts` file. It imports all sibling *.react-jsx.d.ts files
//    in the same directory, plus any direct sub-directories' index.react-jsx.d.ts
//    files (one level down). This chains from leaves to root so React consumers
//    get all types with a single import. The pattern mirrors regular index.ts
//    files (which are a separate tree — index.ts files do NOT import .react-jsx.d.ts).
```

**Files that needed framework types (21 elements, from search of all `@element('...')` in `src/`):**

| #   | File                                                                     | Element                       | Has Attributes type?                            | Done |
| --- | ------------------------------------------------------------------------ | ----------------------------- | ----------------------------------------------- | ---- |
| 1   | `src/behavior-elements/mesh-behaviors/Clipper.ts`                        | `<lume-clipper>`              | ✅ `ClipperAttributes`                          | ✅   |
| 2   | `src/behavior-elements/mesh-behaviors/geometries/BoxGeometry.ts`         | `<lume-box-geometry>`         | ✅ `BoxGeometryAttributes` (was missing)        | ✅   |
| 3   | `src/behavior-elements/mesh-behaviors/geometries/LineGeometry.ts`        | `<lume-line-geometry>`        | ✅ `LineGeometryAttributes`                     | ✅   |
| 4   | `src/behavior-elements/mesh-behaviors/geometries/MixedplaneGeometry.ts`  | `<lume-mixedplane-geometry>`  | ✅ `MixedplaneGeometryAttributes` (was missing) | ✅   |
| 5   | `src/behavior-elements/mesh-behaviors/geometries/PlaneGeometry.ts`       | `<lume-plane-geometry>`       | ✅ `PlaneGeometryAttributes`                    | ✅   |
| 6   | `src/behavior-elements/mesh-behaviors/geometries/PlyGeometry.ts`         | `<lume-ply-geometry>`         | ✅ `PlyGeometryAttributes`                      | ✅   |
| 7   | `src/behavior-elements/mesh-behaviors/geometries/RoundedrectGeometry.ts` | `<lume-roundedrect-geometry>` | ✅ `RoundedrectGeometryAttributes`              | ✅   |
| 8   | `src/behavior-elements/mesh-behaviors/geometries/ShapeGeometry.ts`       | `<lume-shape-geometry>`       | ✅ `ShapeGeometryAttributes`                    | ✅   |
| 9   | `src/behavior-elements/mesh-behaviors/geometries/SphereGeometry.ts`      | `<lume-sphere-geometry>`      | ✅ `SphereGeometryAttributes`                   | ✅   |
| 10  | `src/behavior-elements/mesh-behaviors/geometries/TorusGeometry.ts`       | `<lume-torus-geometry>`       | ✅ `TorusGeometryAttributes`                    | ✅   |
| 11  | `src/behavior-elements/mesh-behaviors/materials/BasicMaterial.ts`        | `<lume-basic-material>`       | ✅ `BasicMaterialAttributes`                    | ✅   |
| 12  | `src/behavior-elements/mesh-behaviors/materials/BasiclineMaterial.ts`    | `<lume-basicline-material>`   | ✅ `BasiclineMaterialAttributes`                | ✅   |
| 13  | `src/behavior-elements/mesh-behaviors/materials/LambertMaterial.ts`      | `<lume-lambert-material>`     | ✅ `LambertMaterialAttributes`                  | ✅   |
| 14  | `src/behavior-elements/mesh-behaviors/materials/MixedplaneMaterial.ts`   | `<lume-mixedplane-material>`  | ✅ `MixedplaneMaterialAttributes`               | ✅   |
| 15  | `src/behavior-elements/mesh-behaviors/materials/PhongMaterial.ts`        | `<lume-phong-material>`       | ✅ `PhongMaterialAttributes`                    | ✅   |
| 16  | `src/behavior-elements/mesh-behaviors/materials/PhysicalMaterial.ts`     | `<lume-physical-material>`    | ✅ `PhysicalMaterialAttributes`                 | ✅   |
| 17  | `src/behavior-elements/mesh-behaviors/materials/PointsMaterial.ts`       | `<lume-points-material>`      | ✅ `PointsMaterialAttributes`                   | ✅   |
| 18  | `src/behavior-elements/mesh-behaviors/materials/ProjectedMaterial.ts`    | `<lume-projected-material>`   | ✅ `ProjectedMaterialAttributes`                | ✅   |
| 19  | `src/behavior-elements/mesh-behaviors/materials/ShaderMaterial.ts`       | `<lume-shader-material>`      | ✅ `ShaderMaterialAttributes`                   | ✅   |
| 20  | `src/behavior-elements/mesh-behaviors/materials/StandardMaterial.ts`     | `<lume-standard-material>`    | ✅ `StandardMaterialAttributes`                 | ✅   |
| 21  | `src/layouts/PushPaneLayout.ts`                                          | `<lume-push-pane-layout>`     | ✅ `PushPaneLayoutAttributes` (was missing)     | ✅   |

**React index files needed (4 new):**

| Index file                                                             | Done |
| ---------------------------------------------------------------------- | ---- |
| `src/behavior-elements/index.react-jsx.d.ts`                           | ✅   |
| `src/behavior-elements/mesh-behaviors/index.react-jsx.d.ts`            | ✅   |
| `src/behavior-elements/mesh-behaviors/geometries/index.react-jsx.d.ts` | ✅   |
| `src/behavior-elements/mesh-behaviors/materials/index.react-jsx.d.ts`  | ✅   |

**React index files updated (2 existing):**

| Index file                         | Change                                                          | Done |
| ---------------------------------- | --------------------------------------------------------------- | ---- |
| `src/index.react-jsx.d.ts`         | Add `import type {} from './behavior-elements/index.react-jsx'` | ✅   |
| `src/layouts/index.react-jsx.d.ts` | Add `import type {} from './PushPaneLayout.react-jsx'`          | ✅   |

**All other elements (32) already have their framework types (Solid.js, DOM, React)** —
verified via comprehensive search of all 53 concrete `@element('...', autoDefineElements)`
entries in `src/`. Typecheck passes with no errors.

### 17. ✅ Dedupe mesh slot/template into `MeshLike` base class with `_defaultGeometry`/`_defaultMaterial` hooks

Previously each mesh class (`Box`, `Plane`, `Sphere`, `Torus`, `Shape`, `RoundedRectangle`,
`MixedPlane`, `Line`, `Points`) duplicated the full `<slot>`/`<Show>` template. Now:

- New abstract base class `src/meshes/MeshLike.ts` (`@element({autoDefine: false})`, extends
  `Element3D`) owns the template, the geometry/material slots, and the protected
  `_defaultGeometry` / `_defaultMaterial` hooks (defaulting to `<lume-box-geometry>` +
  `<lume-physical-material>`).
- `Mesh` extends `MeshLike` (adds `castShadow`/`receiveShadow` + effects + `ThreeMesh`).
- `Line` and `Points` now extend `MeshLike` directly instead of `Element3D` — they cannot
  extend `Mesh` because TypeScript requires `makeThreeObject3d()` return types to be
  assignable to the base's, and three.js `Line`/`Points` are not subclasses of three.js
  `Mesh`. `MeshLike` mirrors three.js, where Line/Points/Mesh are siblings under Object3D.
- `Line` overrides both `_defaultGeometry` (`<lume-line-geometry>`) and `_defaultMaterial`
  (`<lume-basicline-material>`); `Points` overrides only `_defaultMaterial`
  (`<lume-points-material>`) and keeps the inherited box geometry.
- Subclasses only override what differs from the defaults; most mesh classes need only a
  `_defaultGeometry` override since `<lume-physical-material>` is already the default.
- Lazy imports for the base defaults (`BoxGeometry`, `PhysicalMaterial`) moved into
  `MeshLike.ts`; subclasses lazy-import only the geometry/material elements they override.

---

## Mesh Migration Status

All mesh classes now inherit the slot/template from the abstract `MeshLike` base class and
override `_defaultGeometry`/`_defaultMaterial` only where their defaults differ from
`MeshLike`'s (`lume-box-geometry` + `lume-physical-material`). No mesh class uses
`initialBehaviors`:

| Mesh Class         | `_defaultGeometry` override   | `_defaultMaterial` override        | Uses `initialBehaviors`? |
| ------------------ | ----------------------------- | ---------------------------------- | ------------------------ |
| `MeshLike` (base)  | `lume-box-geometry` (default) | `lume-physical-material` (default) | ❌                       |
| `Mesh`             | none (inherits)               | none (inherits)                    | ❌                       |
| `Box`              | none (inherits)               | none (inherits)                    | ❌                       |
| `InstancedMesh`    | N/A (custom slot handling)    | N/A (custom slot handling)         | ❌                       |
| `Line`             | `lume-line-geometry`          | `lume-basicline-material`          | ❌                       |
| `MixedPlane`       | `lume-mixedplane-geometry`    | `lume-mixedplane-material`         | ❌                       |
| `Plane`            | `lume-plane-geometry`         | none (inherits)                    | ❌                       |
| `Points`           | none (inherits)               | `lume-points-material`             | ❌                       |
| `RoundedRectangle` | `lume-roundedrect-geometry`   | none (inherits)                    | ❌                       |
| `Shape`            | `lume-shape-geometry`         | none (inherits)                    | ❌                       |
| `Sphere`           | `lume-sphere-geometry`        | none (inherits)                    | ❌                       |
| `Torus`            | `lume-torus-geometry`         | none (inherits)                    | ❌                       |

---

## App Sub-Projects

- **`apps/docs/`** — Docsify documentation site. No code migration needed; docs content
  may reference old behavior patterns that should be updated separately.

---

## Summary

### Done

- ✅ All geometry behavior-elements ported (9 elements)
- ✅ All material behavior-elements ported (10 elements)
- ✅ Clipper behavior-element ported
- ✅ 9 of 9 mesh classes migrated to slot/template pattern
- ✅ Mesh classes deduped via `MeshLike` base class with `_defaultGeometry`/`_defaultMaterial` overrides
- ✅ 9 examples migrated to child behavior-elements
- ✅ Framework types (Solid.js, DOM, React) added for all 21 remaining elements

### TODO (see Remaining Work for details)

- ✅ 15 items done (1, 3, 4, 5, 6, 7, 9, 11, 12, 13, 14, 15, 16, 17)
- ❌ 2 remaining items (2, 8, 10 above)
- ❌ `InitialBehaviors` mixin and `setBehaviors()` function still exist
