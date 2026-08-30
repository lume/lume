# Framework Types for Lume Elements

Reference for adding **framework types** to Lume custom elements. Every Lume element
needs framework types so it can be used with full type safety across frameworks. The DOM
is itself one framework, alongside Solid.js and React. More frameworks (Svelte, Vue, etc.)
will be added later using the same pattern of separate opt-in type files.

---

## The Current Frameworks

Each custom element defined with `@element('lume-example', autoDefineElements)` needs:

### 1. Attributes Type (exported, at top of file)

```ts
export type ExampleElementAttributes = ParentAttributes | 'customProp1' | 'customProp2'
```

- Union of the parent's Attributes type with the element's own custom attribute names
- If the element has no custom attributes, export an alias for the parent's type:
  `export type ExampleElementAttributes = ParentAttributes`
- This type is shared by all framework types (Solid, DOM, React, and future frameworks)

### 2. Solid.js + DOM Framework Types (at bottom of the element's `.ts` file)

```ts
import {type ElementAttributes} from '@lume/element'

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'lume-example': ElementAttributes<ExampleElement, ExampleElementAttributes>
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lume-example': ExampleElement
  }
}
```

- Solid.js: uses `@lume/element`'s `ElementAttributes<TClass, TAttr>` which
  supports Lume's reactive attributes, event bindings, and refs
- DOM: registers the element in `HTMLElementTagNameMap` so `document.createElement('lume-example')`
  returns the correct type
- These are **always** in the same file as the element class — Solid is the default framework

### 3. React Framework Types (separate sibling file `ExampleElement.react-jsx.d.ts`)

```ts
import type {ExampleElement, ExampleElementAttributes} from './ExampleElement'
import type {ReactElementAttributes} from '@lume/element/src/react'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lume-example': ReactElementAttributes<ExampleElement, ExampleElementAttributes>
    }
  }
}
```

- **Always a separate file** — `.react-jsx.d.ts` beside the `.ts` source
- React users opt in by importing the file (or importing from the React index)
- Uses `ReactElementAttributes` from `@lume/element/src/react` instead of `ElementAttributes`
- The comment at the top is standard boilerplate (present in all existing React type files)

### 4. React Index Files (`index.react-jsx.d.ts`)

Every directory containing elements with React types gets an `index.react-jsx.d.ts` file.
Each index file does two things:

1. **Imports all sibling `*.react-jsx.d.ts` files** in its own directory (same folder).
2. **Imports `index.react-jsx.d.ts` from any direct sub-directories** (exactly one level down).

This chains from leaves to root — leaf directories import only their siblings, higher
directories import their siblings _plus_ their immediate children's index files:

```
src/
├── index.react-jsx.d.ts          ← imports: meshes/index, core/index, cameras/index, ...
├── meshes/
│   ├── index.react-jsx.d.ts      ← imports: Box.react-jsx, Sphere.react-jsx, ... (siblings only)
│   ├── Box.react-jsx.d.ts
│   └── Sphere.react-jsx.d.ts
├── behavior-elements/
│   ├── index.react-jsx.d.ts      ← imports: mesh-behaviors/index.react-jsx (direct child)
│   └── mesh-behaviors/
│       ├── index.react-jsx.d.ts  ← imports: geometries/index, materials/index, Clipper.react-jsx
│       │                            (siblings + direct sub-dirs)
│       ├── Clipper.react-jsx.d.ts
│       ├── geometries/
│       │   ├── index.react-jsx.d.ts  ← imports: BoxGeometry.react-jsx, SphereGeometry.react-jsx, ...
│       │   │                            (siblings only, no further sub-dirs)
│       │   ├── BoxGeometry.react-jsx.d.ts
│       │   └── SphereGeometry.react-jsx.d.ts
│       └── materials/
│           ├── index.react-jsx.d.ts  ← imports: BasicMaterial.react-jsx, PhongMaterial.react-jsx, ...
│           │                            (siblings only)
│           ├── BasicMaterial.react-jsx.d.ts
│           └── PhongMaterial.react-jsx.d.ts
```

**This is a separate tree from the regular `index.ts` files.** The `index.ts` files
(`export * from './Box.js'`) handle module exports. The `index.react-jsx.d.ts` files
handle React type augmentation. They never cross-reference each other.

Result: React consumers can `import 'lume/react'` once and all element types are
available in their JSX.

---

## Real-World Examples

### Reference: `TextureProjector` (has all framework types)

**`src/textures/TextureProjector.ts`** — contains the Attributes type and the Solid.js + DOM framework types:

```ts
export type TextureProjectorAttributes = Element3DAttributes | 'src' | 'fitment'

// ... class definition ...

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'lume-texture-projector': ElementAttributes<TextureProjector, TextureProjectorAttributes>
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lume-texture-projector': TextureProjector
  }
}
```

**`src/textures/TextureProjector.react-jsx.d.ts`** — separate React framework types file:

```ts
import type {TextureProjector, TextureProjectorAttributes} from './TextureProjector'
import type {ReactElementAttributes} from '@lume/element/src/react'

// React users can import this to have appropriate types for the element in their JSX markup.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lume-texture-projector': ReactElementAttributes<TextureProjector, TextureProjectorAttributes>
    }
  }
}
```

**`src/textures/index.react-jsx.d.ts`** — React index for the directory:

```ts
import type {} from './TextureProjector.react-jsx'
```

### Minimal Example: Element With No Custom Attributes

For elements that have no custom properties beyond what they inherit:

```ts
// No custom attributes — just alias the parent's type
export type BoxGeometryAttributes = GeometryBehaviorElAttributes

// ... class definition ...

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'lume-box-geometry': ElementAttributes<BoxGeometry, BoxGeometryAttributes>
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lume-box-geometry': BoxGeometry
  }
}
```

**Note:** `GeometryBehaviorEl` does not export an Attributes type. For geometry
elements with no custom props, either add `GeometryBehaviorElAttributes` to the parent
class, or use the Attributes type of whatever base class is available in the chain.

---

## Future Framework Support (Svelte, Vue, etc.)

Adding framework types for other frameworks follows the same pattern as React:

1. **Separate opt-in type files** — e.g. `ExampleElement.svelte-jsx.d.ts`,
   `ExampleElement.vue-jsx.d.ts`
2. **Framework-specific index files** — `index.svelte-jsx.d.ts`, `index.vue-jsx.d.ts`
3. **Framework-specific `ElementAttributes`** — each framework may need its own wrapper
   type (similar to `ReactElementAttributes`). These could live in `@lume/element`
   or in framework-specific adapter packages.

This keeps the element source files clean (only the core Solid.js + DOM framework types
in the `.ts` file) while letting users of any framework opt in to typed custom elements.

---

## Verification Checklist

For each element's framework types:

- [ ] Exported `*Attributes` type (or alias for parent's Attributes)
- [ ] Solid.js `declare module 'solid-js'` block at bottom of `.ts` file
- [ ] DOM `declare global { interface HTMLElementTagNameMap }` block at bottom of `.ts` file
- [ ] React `.react-jsx.d.ts` sibling file with `ReactElementAttributes`
- [ ] Every `index.react-jsx.d.ts` along the directory chain imports the `.react-jsx.d.ts`
- [ ] Top-level `src/index.react-jsx.d.ts` imports the new directory's `index.react-jsx.d.ts`

**Quick check command:**

```bash
# List all elements missing framework types (from repo root):
python3 -c "
import os, re, pathlib
src = pathlib.Path('src')
for f in sorted(src.rglob('*.ts')):
    if f.suffix != '.ts' or f.name.endswith('.d.ts'): continue
    c = f.read_text() if f.stat().st_size < 50000 else ''
    if re.search(r'@element\(\{autoDefine:\s*false\}\)', c): continue
    m = re.search(r\"@element\\('([^']+)'\", c)
    if not m: continue
    has_s = 'solid-js' in c
    has_d = 'HTMLElementTagNameMap' in c
    has_r = f.with_suffix('.react-jsx.d.ts').exists()
    if not (has_s and has_d and has_r):
        print(f'  {f}')
"
```
