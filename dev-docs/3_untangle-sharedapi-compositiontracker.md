# Untangling `SharedAPI` from `CompositionTracker`

Plan for item 9 in `dev-docs/1_behavior-elements-migration-status.md`.

---

## Class Hierarchy (current)

```
HTMLElement
  └ LumeElement (@lume/element)
      └ Eventful
          └ CompositionTracker ← mixin
              └ PropertyAnimator
                  └ Sizeable
                      └ Transformable
                          └ Settable ← mixin
                              └ InitialBehaviors ← mixin
                                  └ SharedAPI
                                      ├─ Element3D  (isElement3D = true)
                                      └─ Scene      (isScene = true)
```

- `CompositionTracker` extends `ChildTracker` which provides `childConnectedCallback` / `childDisconnectedCallback`.
- `SharedAPI` overrides the composition lifecycle callbacks (`composedCallback`, `uncomposedCallback`, `childComposedCallback`, `childUncomposedCallback`) declared in `CompositionTracker`.

---

## Problem

`CompositionTracker` — intended to eventually move into `@lume/element` as a generic flat-tree tracking utility — has Lume-specific branching based on `isScene` and `isElement3D`. These boolean flags are declared on `CompositionTracker` (default `false`) and overridden in `SharedAPI`/`Scene`/`Element3D`.

Additionally, `CompositionTracker` has a `skipShadowObservation` field that lets subclasses opt out of shadow root observation entirely. Only `Scene` uses it. This suppresses `CompositionTracker`'s core purpose: faithfully tracking the flat tree.

Finally, there's a redundant property pair: `composedLumeParent`/`composedLumeChildren` and `composedSceneGraphParent` (no children counterpart yet). These serve overlapping roles:

| Property | What it does |
|----------|-------------|
| `composedLumeParent` | Filters `composedParent` to Lume types only (Scene or Element3D) |
| `composedLumeChildren` | Filters `composedChildren` to Element3D only |
| `composedSceneGraphParent` | Like `composedLumeParent` + adds Scene special case (falls back to `parentLumeElement?.isScene`) |
| *(missing)* | No children counterpart for Scene-graph composition |

We will consolidate into a single `composedSceneGraphParent`/`composedSceneGraphChildren` pair.

---

## Two kinds of composition

| Concept | Properties | Meaning |
|---------|-----------|---------|
| **DOM composition** | `composedParent`, `composedChildren` | Pure — what the DOM flat tree says. Never overridden. |
| **Scene-graph composition** | `composedSceneGraphParent`, `composedSceneGraphChildren` | What the 3D scene graph needs — filtered to Lume elements, with Scene's ShadowRoot treated as invisible |

---

## Goal

- **Remove `skipShadowObservation`** from `CompositionTracker`
- **Remove `isScene` / `isElement3D`** from `CompositionTracker`
- **Consolidate to a single `composedSceneGraphParent`/`composedSceneGraphChildren` pair** — remove `composedLumeParent`/`composedLumeChildren`
- **Keep `CompositionTracker`'s `composedParent`/`composedChildren` pure** — no overrides, they faithfully report the flat tree
- **Split `slotted*` into terminal and direct variants** so consumers can choose which data they want without overriding private methods
- **Scene uses the public composition hooks** (`childComposedCallback`, `composedCallback`, etc.) — not private `__trigger*` internals

---

## Approach

### Part A: Clean up CompositionTracker (Steps 1–4)

### Step 1: Remove `skipShadowObservation` from `CompositionTracker`

```ts
// ❌ Remove field:
skipShadowObservation = false

// ❌ Remove early return in attachShadow override:
if (this.skipShadowObservation) return root
```

### Step 2: Remove `isScene` and `isElement3D` from `CompositionTracker`

Delete these lines (current lines ~84–88):

```ts
// ❌ Remove:
// CONTINUE these do not belong in CompositionTracker {{
isScene = false
isElement3D = false
// }}
```

### Step 3: Remove `isScene` import from `CompositionTracker`

```ts
// Before:
import {isDomEnvironment, isScene} from './utils/isThisOrThat.js'

// After:
import {isDomEnvironment} from './utils/isThisOrThat.js'
```

### Step 4: Remove all `isScene` / `isElement3D` branches from `CompositionTracker`

**a) `__getComposedParent()` — the branch that remapped Scene's children**

```ts
// Before:
__getComposedParent(): HTMLElement | null {
    let parent: Node | null = this.parentElement
    if (parent && isScene(parent)) return parent  // ← remove
    parent = this.slottedParent || this.shadowParent
    if (parent) return parent as HTMLElement
    return getComposedParent(this)
}

// After:
__getComposedParent(): HTMLElement | null {
    let parent = this.terminalSlottedParent || this.shadowParent
    if (parent) return parent as HTMLElement
    return getComposedParent(this)
}
```

Note: `slottedParent` is renamed to `terminalSlottedParent` in Step 5a.

After this removal, `composedParent` for a direct child of Scene will faithfully resolve through the flat tree to some element inside Scene's ShadowRoot (since slots are untracked). `composedSceneGraphParent` handles this case (Step 12).

**b–d) Three dead-code `!this.isScene` branches**

These were never reached for Scene because `skipShadowObservation` prevented `exposedShadowRoot` from being set. Remove the `!this.isScene &&` prefix:

| Location | Before | After |
|----------|--------|-------|
| `childConnectedCallback` (×2) | `if (!this.isScene && this.exposedShadowRoot)` | `if (this.exposedShadowRoot)` |
| `childDisconnectedCallback` | `if (!this.isScene && this.exposedShadowRoot)` | `if (this.exposedShadowRoot)` |
| `__getCurrentAssignedNodes` | `return !this.isScene && slot.assignedSlot ? [] : ...` | `return slot.assignedSlot ? [] : ...` |

---

### Part B: Split `slotted*` into terminal and direct (Steps 5a–5b)

Currently `slottedParent` and `slottedChildren` track only the **terminal** distribution — if a slot is assigned to another slot, the slotted node moves to the final parent. This is what the flat tree uses. But consumers (like Scene) sometimes need the **direct** slot assignment regardless of forwarding — for example, Scene's light-DOM `<slot name="scene">` has its assigned elements forwarded to the renderer's default `<slot>`, so terminal tracking shows `[]`.

We split into two layers:

| Name | Meaning | Composition type |
|------|---------|-----------------|
| `terminalSlottedParent` / `terminalSlottedChildren` | Final distribution (current behavior, renamed) | `"terminal-slot"` |
| `slottedParent` / `slottedChildren` | Direct slot assignment regardless of forwarding (new) | `"slot"` |

This avoids overriding private methods like `__getCurrentAssignedNodes` and gives consumers a clean choice of which data they want.

### Step 5a: Rename current `slotted*` → `terminalSlotted*`

**In `CompositionTracker`:**

```ts
// Rename property:
// Before: slottedParent: CompositionTracker | null = null
// After:  terminalSlottedParent: CompositionTracker | null = null

// Rename property:
// Before: slottedChildren: Set<CompositionTracker> | null = null
// After:  terminalSlottedChildren: Set<CompositionTracker> | null = null
```

**Update all sites in `__handleSlottedChildren`:**

```ts
// Before:   removedNode.slottedParent = null
// After:    removedNode.terminalSlottedParent = null

// Before:   this.slottedChildren.delete(removedNode)
// After:    this.terminalSlottedChildren.delete(removedNode)

// Before:   if (this.slottedChildren) { ... if (this.slottedChildren.size) this.slottedChildren = null }
// After:    if (this.terminalSlottedChildren) { ... if (this.terminalSlottedChildren.size) this.terminalSlottedChildren = null }

// Before:   const slottedParent = addedNode.slottedParent
// After:    const terminalSlottedParent = addedNode.terminalSlottedParent

// Before:   addedNode.slottedParent = this
// After:    addedNode.terminalSlottedParent = this

// Before:   if (!this.slottedChildren) this.slottedChildren = new Set()
// After:    if (!this.terminalSlottedChildren) this.terminalSlottedChildren = new Set()

// Before:   this.slottedChildren.add(addedNode)
// After:    this.terminalSlottedChildren.add(addedNode)
```

**Update `__getComposedParent`:**

```ts
// Before: let parent = this.slottedParent || this.shadowParent
// After: let parent = this.terminalSlottedParent || this.shadowParent
```

**Update `composedChildren` getter:**

```ts
// Before: ...(this.slottedChildren || [])...
// After:  ...(this.terminalSlottedChildren || [])...
```

**Update `composedCallback`/`uncomposedCallback` calls to use `"terminal-slot"`:**

The `__triggerChildComposedCallback` and `__triggerChildUncomposedCallback` calls in `__handleSlottedChildren` currently pass `'slot'`. Change them to `'terminal-slot'`:

```ts
// In __handleSlottedChildren, the uncompose calls:
// Before: this.__triggerChildUncomposedCallback(this, removedNode, 'slot')
// After:  this.__triggerChildUncomposedCallback(this, removedNode, 'terminal-slot')

// In __handleSlottedChildren, the compose calls:
// Before: this.__triggerChildComposedCallback(this, addedNode, 'slot')
// After:  this.__triggerChildComposedCallback(this, addedNode, 'terminal-slot')

// In __handleSlottedChildren, the discrepancy fix:
// Before: this.__triggerChildUncomposedCallback(this, addedNode, 'slot')
//         this.__triggerChildComposedCallback(this, addedNode, 'slot')
// After:  this.__triggerChildUncomposedCallback(this, addedNode, 'terminal-slot')
//         this.__triggerChildComposedCallback(this, addedNode, 'terminal-slot')
```

This changes the `compositionType` value seen by `composedCallback` implementations from `"slot"` to `"terminal-slot"`.

**Update `CompositionType`:**

```ts
// Before:
export type CompositionType = 'root' | 'slot' | 'actual'

// After:
export type CompositionType = 'root' | 'slot' | 'terminal-slot' | 'actual'
```

### Step 5b: Add new direct `slotted*` properties

Add new `slottedParent` and `slottedChildren` that reflect the direct slot assignment regardless of forwarding:

**New properties:**

```ts
/**
 * The parent whose child <slot> this element is assigned to,
 * regardless of whether that slot itself is assigned to a
 * deeper slot. This is the direct slot parent.
 *
 * Compare with terminalSlottedParent, which follows slot
 * chaining to the final distributed parent.
 */
slottedParent: CompositionTracker | null = null

/**
 * Elements directly assigned to this element's child <slot>,
 * regardless of whether this slot is assigned to a deeper slot.
 * These are the direct slotted children.
 *
 * Compare with terminalSlottedChildren, which only contains
 * children whose slot is NOT forwarded further down.
 */
slottedChildren: Set<CompositionTracker> | null = null
```

**Update `__handleSlottedChildren` to set both:**

Delete `__getCurrentAssignedNodes` — it's no longer needed. Inline `slot.assignedElements({flatten: true})` directly in `__getSlottedChildDifference`, and add conditional forwarding logic in `__handleSlottedChildren`:

```ts
// ❌ Remove method entirely:
__getCurrentAssignedNodes(slot: HTMLSlotElement) { ... }

// In __getSlottedChildDifference, replace the __getCurrentAssignedNodes call:
// Before: const newNodes = this.__getCurrentAssignedNodes(slot)
// After:  const newNodes = slot.assignedElements({flatten: true})
```

Now `diff.added` always contains the flat assigned elements regardless of forwarding. In `__handleSlottedChildren`, add conditional logic to decide whether to set `terminal*` properties:

```ts
const isForwarded = !!slot.assignedSlot

// --- Direct slotted* (always set, regardless of forwarding) ---

// Alongside removedNode.terminalSlottedParent = null:
removedNode.slottedParent = null

// Alongside this.terminalSlottedChildren.delete(removedNode):
if (this.slottedChildren) {
    this.slottedChildren.delete(removedNode)
    if (!this.slottedChildren.size) this.slottedChildren = null
}

// Alongside the terminal slottedParent clear (when moving between slots):
const directParent = addedNode.slottedParent
if (directParent) {
    const children = directParent.slottedChildren
    if (children) {
        children.delete(addedNode)
        if (!children.size) directParent.slottedChildren = null
    }
}

// Alongside addedNode.terminalSlottedParent = this:
addedNode.slottedParent = this

// Alongside if (!this.terminalSlottedChildren) ... terminalSlottedChildren.add:
if (!this.slottedChildren) this.slottedChildren = new Set()
this.slottedChildren.add(addedNode)

// Direct composed/uncomposed callbacks fire BEFORE terminal:
// (removedNode:)
this.__triggerChildUncomposedCallback(this, removedNode, 'slot')
// (addedNode:)
this.__triggerChildComposedCallback(this, addedNode, 'slot')

// --- Terminal slotted* (only when NOT forwarded) ---

// The existing terminal assignments are wrapped in a guard:
if (!isForwarded) {
    removedNode.terminalSlottedParent = null
    // ... existing terminal cleanup ...
    addedNode.terminalSlottedParent = this
    // ... existing terminal set operations ...
    this.__triggerChildUncomposedCallback(this, removedNode, 'terminal-slot')
    this.__triggerChildComposedCallback(this, addedNode, 'terminal-slot')
}
```

This eliminates `__getCurrentAssignedNodes` and the need for any parallel helper — all the decision logic lives in `__handleSlottedChildren` where it belongs.

---

### Part C: Scene-graph composition (Steps 6–12)

### Step 6: Scene — override `childConnectedCallback` and `childDisconnectedCallback`

```ts
// In Scene:
import {isElement3D} from './utils/isThisOrThat.js'

override childConnectedCallback(child: Element) {
    super.childConnectedCallback(child)

    if (isElement3D(child)) {
        this.childComposedCallback?.(child, 'actual')
        child.composedCallback?.(this, 'actual')
    }
}

override childDisconnectedCallback(child: Element) {
    super.childDisconnectedCallback(child)

    if (isElement3D(child)) {
        child.uncomposedCallback?.(this, 'actual')
        this.childUncomposedCallback?.(child, 'actual')
    }
}
```

### Step 7: SharedAPI — replace `composedLumeParent`/`composedLumeChildren` with scene-graph pair

```ts
// ❌ Remove:
get composedLumeParent(): SharedAPI | null { ... }
get composedLumeChildren(): Element3D[] { ... }

// ✅ Replacement:
get composedSceneGraphParent(): SharedAPI | null {
    // Scene's direct children compose to Scene in the scene graph.
    if (isScene(this.parentLumeElement)) return this.parentLumeElement

    // Slot-distributed children: check the direct slottedParent
    // (not terminal — Scene's slots may forward to renderer-internal
    // slots, but here we want the original distribution).
    if (isScene(this.slottedParent)) return this.slottedParent

    // Otherwise, filter the composed parent to Lume types.
    return (isScene(this.composedParent) || isElement3D(this.composedParent)) ? this.composedParent : null
}

get composedSceneGraphChildren(): Element3D[] {
    if (this.isScene) {
        // For Scene: use slottedChildren (direct slot assignment).
        // This gives us Scene's light-DOM slot distribution regardless
        // of whether the slot is forwarded to a renderer-internal slot.
        const slotted = this.slottedChildren ? [...this.slottedChildren] : []
        const direct = Array.from(this.children).filter(
            (n): n is AnyCompositionTracker => isAnyCompositionTracker(n)
        )
        return [...slotted, ...direct].filter(child => isElement3D(child))
    }
    return this.composedChildren.filter(child => isElement3D(child))
}
```

No `__getCurrentAssignedNodes` override needed — Scene reads the direct `slottedChildren` which are always populated regardless of slot forwarding.

### Step 8: Update `#reconnectThree` and `#reconnectThreeCSS`

```ts
#reconnectThree(): void {
    this.composedSceneGraphParent?.three.add(this.three)
    for (const child of this.composedSceneGraphChildren) {
        this.three.add(child.three)
    }
    this.needsUpdate()
}

#reconnectThreeCSS(): void {
    this.composedSceneGraphParent?.threeCSS.add(this.threeCSS)
    for (const child of this.composedSceneGraphChildren) {
        this.threeCSS.add(child.threeCSS)
    }
    this.needsUpdate()
}
```

### Step 9: Scene + Element3D — update `traverseSceneGraph` and constructor

**In Scene:**

```ts
// traverseSceneGraph: composedLumeChildren → composedSceneGraphChildren
override traverseSceneGraph(visitor: (el: Element3D) => void, waitForUpgrade = false) {
    if (!waitForUpgrade) {
        for (const child of this.composedSceneGraphChildren)
            child.traverseSceneGraph(visitor, waitForUpgrade)
        return
    }
    // ... waitForUpgrade branch, same change
}

// parentSize: composedLumeParent → composedSceneGraphParent
override get parentSize(): XYZValuesObject<number> {
    return this.composedSceneGraphParent?.calculatedSize ?? this.#elementParentSize
}
```

**In Element3D:**

```ts
// constructor: composedLumeParent → composedSceneGraphParent
if (this.composedSceneGraphParent) { ... }

// traverseSceneGraph: composedLumeChildren → composedSceneGraphChildren
override traverseSceneGraph(visitor: (node: Element3D) => void, waitForUpgrade = false) {
    visitor(this)
    if (!waitForUpgrade) {
        for (const child of this.composedSceneGraphChildren)
            child.traverseSceneGraph(visitor, waitForUpgrade)
        return
    }
    // ... waitForUpgrade branch, same change
}
```

### Step 10: Tests — update assertions

In `src/core/tests/ShadowDOM.test.ts`, rename all occurrences:

```
composedLumeParent    →  composedSceneGraphParent
composedLumeChildren  →  composedSceneGraphChildren
```

### Step 11: SharedAPI — change `override` to plain declarations

Since `CompositionTracker` no longer declares `isScene`/`isElement3D`:

```ts
// Before:
override isScene = false
override isElement3D = false

// After:
isScene = false
isElement3D = false
```

### Step 12: Scene — remove the `skipShadowObservation` line

```ts
// ❌ Remove:
override skipShadowObservation = this.isScene
```

---

## Files changed

| File | Changes |
|------|---------|
| `src/core/CompositionTracker.ts` | Remove `skipShadowObservation`, `isScene`/`isElement3D` fields, `isScene` import, 4 `isScene` branches. Rename `slottedParent`→`terminalSlottedParent`, `slottedChildren`→`terminalSlottedChildren`. Add new `slottedParent`/`slottedChildren`. Update `CompositionType` with `"terminal-slot"`. Fire `"slot"` callbacks for direct assignment |
| `src/core/SharedAPI.ts` | Remove `composedLumeParent`/`composedLumeChildren`. Add `composedSceneGraphParent` (checks `slottedParent` for Scene). Add `composedSceneGraphChildren` (uses `slottedChildren` for Scene). Update `#reconnectThree`/`#reconnectThreeCSS`. `override isScene/isElement3D` → plain declarations. Import `isAnyCompositionTracker` + `AnyCompositionTracker` |
| `src/core/Scene.ts` | Add `childConnectedCallback`/`childDisconnectedCallback` overrides. Update `traverseSceneGraph` and `parentSize`. Remove `skipShadowObservation`. Add `import {isElement3D}` |
| `src/core/Element3D.ts` | Update `traverseSceneGraph` and constructor check |
| `src/core/tests/ShadowDOM.test.ts` | `composedLumeParent` → `composedSceneGraphParent`, `composedLumeChildren` → `composedSceneGraphChildren` |
| `dev-docs/1_behavior-elements-migration-status.md` | Mark item 9 linked to this doc as done |

---

## Future: moving `CompositionTracker` to `@lume/element`

After this refactor, `CompositionTracker` has zero knowledge of `Scene`, `Element3D`, or any Lume concept. Its `composedParent`/`composedChildren` properties are never overridden. The `terminalSlotted*`/`slotted*` split gives consumers full control over which slot-distribution data they need. Remaining work:

- Audit `shadowParent` — generic but coupled to callback structure
- `ChildTracker` and `observeChildren` are dependencies that must move too
- `composedChildren` clones arrays for safety (noted as slow — FIXME in source) — address before publishing
