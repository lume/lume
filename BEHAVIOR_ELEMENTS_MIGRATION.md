# Port element behaviors to custom elements as behavior-elements

This document describes the migration from element behaviors to behavior-elements (Custom Elements).

<details>
<summary>Original Problem Statement</summary>

## Problem with Element Behaviors

The original element behavior system had several fundamental issues that needed to be addressed:

### 1. Attribute Conflicts
Multiple behaviors on the same element could conflict over attribute names. When behaviors are attached via the `has` attribute, there's no clear separation of concerns for attributes.

**Example Problem:**
```html
<lume-points has="ply-geometry phong-material" src="./model.ply" color="#003333">
</lume-points>
```

In this example:
- Both `ply-geometry` and `phong-material` behaviors could potentially use the same attribute names
- It's unclear which behavior "owns" the `src` attribute
- It's unclear which behavior "owns" the `color` attribute
- If both behaviors define a `color` attribute, there would be a conflict

### 2. No Type Safety
Elements had no well-defined set of attributes since their valid attributes depended entirely on which behaviors were dynamically attached. This made it impossible to:
- Provide proper TypeScript definitions
- Validate attributes at compile time
- Know what attributes are valid without examining the behavior implementations

### 3. Unclear Ownership
It was impossible to determine which behavior owned which attributes just by looking at the HTML. Developers had to:
- Read behavior source code to understand attribute ownership
- Hope that behaviors didn't have conflicting attribute names
- Deal with unexpected behavior when attributes were misinterpreted

### 4. Maintenance Issues
- Difficult to debug when attributes weren't working as expected
- Hard to document which attributes belonged to which behaviors
- Complex interactions when multiple behaviors modified the same attributes

</details>

## Solution: Behavior Elements

Convert behaviors to Custom Elements that are children of the host element instead of attached behaviors.

### Before (Element Behaviors):
```html
<lume-points has="ply-geometry phong-material" src="./model.ply" color="#003333">
</lume-points>
```

### After (Behavior Elements):
```html
<lume-points>
    <ply-geometry src="./model.ply"></ply-geometry>
    <phong-material color="#003333"></phong-material>
</lume-points>
```

## Benefits

1. **Type Safety**: Each behavior element has clearly defined attributes with no conflicts
2. **Clear Ownership**: Attributes are clearly owned by their respective elements
3. **Better Developer Experience**: Clear parent-child relationships in HTML structure  
4. **Maintainable Code**: Follows standard Custom Elements patterns used throughout LUME
5. **Future Compatibility**: Easier to add TypeScript definitions for each element's attributes
6. **No Conflicts**: Impossible for attributes to conflict since they're on separate elements

## Implementation

### Architecture Transformation
- **Base class change**: `extends Behavior` → `extends HTMLElement` 
- **Element reference**: `this.element` → `this.parentElement`
- **Registration**: `@behavior` → `@element('element-name', autoDefineElements)`
- **Property forwarding**: Removed `@receiver` decorators and `PropReceiver` dependencies

### Behavior Elements Ported
**Geometries (8 elements):**
- `box-geometry`, `line-geometry`, `mixedplane-geometry`, `plane-geometry`
- `ply-geometry`, `rounded-rectangle-geometry`, `sphere-geometry`, `torus-geometry`

**Materials (5 elements):**  
- `basic-material`, `phong-material`, `points-material`, `standard-material`

**Models (1 element):**
- `gltf-model`

**Utilities:**
- `clip-planes`

The transformation maintains 100% functional compatibility while providing the improved architecture that eliminates the fundamental problems with the original behavior system.