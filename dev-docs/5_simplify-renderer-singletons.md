# Simplify Renderers: Instance-Per-Scene Instead of Singleton

**Status:** Plan (not started)

## Motivation

`WebglRendererThree` and `Css3dRendererThree` are singletons holding a
`WeakMap<Scene, SceneState>` to track a separate `WebGLRenderer` /
`CSS3DRendererNested` per scene. This design:

1. Adds unnecessary indirection — every method takes a `scene` parameter just to
   look up state in the `WeakMap`.
2. Shares `localClippingEnabled` (and `#bgVersion` / `#envVersion` for load
   cancellation) across all scenes on the singleton, when these are
   conceptually per-scene.
3. Forces Scene to reach through the singleton to get the underlying Three.js
   renderer (`glRenderer`/`cssRenderer` getters traverse `sceneStates.get(this)`).

Since each Scene already gets its own Three.js renderer instance, the singleton
wrapper is just a routing layer. Creating one `WebglRendererThree` /
`Css3dRendererThree` **instance per Scene** removes the `WeakMap`, drops the
`scene` parameter from every method, and makes per-scene state (like
`localClippingEnabled`) live where it belongs.

---

## Step 1: Refactor `WebglRendererThree` (no more singleton)

### 1.1 Remove singleton machinery

- Delete module-level `instance` and `isCreatingSingleton` variables.
- Delete `static singleton()` method.
- Remove the guard in `constructor()` that throws when not creating a singleton.
- Delete the `releaseWebGLRendererThree()` export.

### 1.2 Delete the `SceneState` interface; put properties directly on the class

The current `SceneState` interface fields become direct class fields:

```ts
// Before: a SceneState sub-object looked up via WeakMap
// After: these are direct fields on WebglRendererThree
renderer!: WebGLRenderer
pmremgen?: PMREMGenerator
hasBg?: boolean
bgIsEquirectangular?: boolean
bgTexture?: Texture
hasEnv?: boolean
envTexture?: Texture
effects!: Effects
```

No more `sceneStates = new WeakMap<Scene, SceneState>()`. No more
`this.sceneStates.get(scene)` lookups. Just `this.renderer`, `this.effects`, etc.

### 1.3 Constructor takes a `Scene` and does all initialization inline

```ts
constructor(scene: Scene)
```

The constructor stores the scene, creates the `WebGLRenderer`, creates the
`Effects`, and appends the canvas to `scene._glLayer` — everything that
`initialize(scene)` currently does. No separate `initialize()` method is needed.

Scene's `glRendererEffect` just creates the instance:

```ts
this.#glRenderer = new WebglRendererThree(this)
```

The effect already guards with `if (!this.webgl || !this._glLayer) return`, so
the instance is only created when both conditions are true and `_glLayer` is
available in the DOM.

### 1.4 Remove `scene` parameter from all public methods

Every method currently has `scene: Scene` as first arg and looks up state via
`this.sceneStates.get(scene)`. After the change, state is accessed directly via
`this.renderer`, `this.effects`, etc.

**Methods changing signature:**

| Method | Before | After |
|---|---|---|
| `initialized` | `initialized(scene: Scene): boolean` | `initialized: boolean` (field) |
| `initialize` | `initialize(scene: Scene): void` | _deleted_ (done in constructor) |
| `uninitialize` | `uninitialize(scene: Scene): void` | `uninitialize(): void` |
| `drawScene` | `drawScene(scene: Scene): void` | `drawScene(): void` |
| `updateResolution` | `updateResolution(scene: Scene, x, y)` | `updateResolution(x, y)` |
| `setClearColor` | `setClearColor(scene: Scene, color, opacity)` | `setClearColor(color, opacity)` |
| `setClearAlpha` | `setClearAlpha(scene: Scene, opacity)` | `setClearAlpha(opacity)` |
| `setShadowMapType` | `setShadowMapType(scene: Scene, type)` | `setShadowMapType(type)` |
| `setPhysicallyCorrectLights` | `setPhysicallyCorrectLights(scene: Scene, value)` | `setPhysicallyCorrectLights(value)` |
| `enableBackground` | `enableBackground(scene, isEq, blur, cb)` | `enableBackground(isEq, blur, cb)` |
| `disableBackground` | `disableBackground(scene: Scene)` | `disableBackground()` |
| `enableEnvironment` | `enableEnvironment(scene: Scene, cb)` | `enableEnvironment(cb)` |
| `disableEnvironment` | `disableEnvironment(scene: Scene)` | `disableEnvironment()` |
| `requestFrame` | `requestFrame(scene: Scene, fn)` | `requestFrame(fn)` |
| `enableVR` | `enableVR(scene: Scene, enable)` | `enableVR(enable)` |
| `createDefaultVRButton` | `createDefaultVRButton(scene: Scene): HTMLElement` | `createDefaultVRButton(): HTMLElement` |

The `#bgVersion` and `#envVersion` private fields stay as direct class fields
(they were already on the singleton, now they become properly per-instance).

---

## Step 2: Refactor `Css3dRendererThree` (identical pattern)

Same changes as WebglRendererThree but simpler (fewer methods, no background/env
machinery):

1. Remove singleton pattern.
2. Delete the `SceneState` interface; put `renderer` field directly on the class.
3. Constructor takes `Scene`, does all initialization inline.
4. Remove `scene` param from `initialize`, `uninitialize`, `drawScene`,
   `updateResolution`, `requestFrame` (and delete `initialize`).
5. Delete `releaseCSS3DRendererThree()`.

---

## Step 3: Update `Scene.ts`

### 3.1 `glRendererEffect` (line ~709)

**Before:**
```ts
this.#glRenderer = WebglRendererThree.singleton()
this.#glRenderer.initialize(this)
```

**After:**
```ts
this.#glRenderer = new WebglRendererThree(this)
```

### 3.2 `cssRendererEffect` (line ~888)

**Before:**
```ts
this.#cssRenderer = Css3dRendererThree.singleton()
this.#cssRenderer.initialize(this)
```

**After:**
```ts
this.#cssRenderer = new Css3dRendererThree(this)
```

### 3.3 Update `glRenderer` getter (line ~578)

**Before:**
```ts
return this.#glRenderer?.sceneStates.get(this)?.renderer
```

**After:**
```ts
return this.#glRenderer?.renderer ?? null
```

No getter needed — `renderer` is a plain field on `WebglRendererThree`.

### 3.4 Update `cssRenderer` getter (line ~594)

**Before:**
```ts
return this.#cssRenderer?.sceneStates.get(this)?.renderer
```

**After:**
```ts
return this.#cssRenderer?.renderer ?? null
```

### 3.5 Update all `this.#glRenderer!.method(this, ...)` calls

Remove `this,` first argument from all calls:
- `this.#glRenderer!.localClippingEnabled = ...` — unchanged (property set)
- `this.#glRenderer!.setClearColor(this, ...)` → `.setClearColor(...)`
- `this.#glRenderer!.setClearAlpha(this, ...)` → `.setClearAlpha(...)`
- `this.#glRenderer!.setShadowMapType(this, ...)` → `.setShadowMapType(...)`
- `this.#glRenderer!.setPhysicallyCorrectLights(this, ...)` →
  `.setPhysicallyCorrectLights(...)`
- `this.#glRenderer!.enableVR(this, ...)` → `.enableVR(...)`
- `this.#glRenderer!.requestFrame(this, ...)` → `.requestFrame(...)`
- `this.#glRenderer!.createDefaultVRButton(this)` → `.createDefaultVRButton()`
- `this.#glRenderer!.enableBackground(this, ...)` → `.enableBackground(...)`
- `this.#glRenderer!.disableBackground(this)` → `.disableBackground()`
- `this.#glRenderer!.enableEnvironment(this, ...)` → `.enableEnvironment(...)`
- `this.#glRenderer!.disableEnvironment(this)` → `.disableEnvironment()`
- `this.#glRenderer!.updateResolution(this, x, y)` → `.updateResolution(x, y)`

### 3.6 Update `drawScene` method (line ~667)

**Before:**
```ts
drawScene() {
    this.#glRenderer?.drawScene(this)
    this.#cssRenderer?.drawScene(this)
}
```

**After:**
```ts
drawScene() {
    this.#glRenderer?.drawScene()
    this.#cssRenderer?.drawScene()
}
```

### 3.7 Update `enableVR` / `vr` effect

Make `requestFrame` call consistent with the new signature (no `scene` arg).

---

## Step 4: Update `renderers/index.ts`

Remove exports of `releaseWebGLRendererThree` and `releaseCSS3DRendererThree`.
No backward compatibility shim needed — internet searches show no external callers.

---

## Step 5: Verify

1. **Typecheck:** `yarn run typecheck` — ensure no type errors.
2. **Build:** `yarn run build` — ensure it compiles.
3. **Tests:** `yarn run test` — all existing tests pass.
4. **Manual check:** No other file in the codebase calls `WebglRendererThree.singleton()` or `Css3dRendererThree.singleton()` besides Scene.ts (confirmed by search — only Scene.ts calls them).