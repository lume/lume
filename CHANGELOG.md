## 0.2.1

**General**
- Move test suite to QUnit

**Core**
- View removal API

**DOM**
- Node removal API
- Context emits a `deploy` event
- Clean separation between `Surface` and `ElementOutput`
- `Engine` handles window resizing instead of `Context`

**Inputs**
- Fix GenericInput bug

## 0.2.0

**General**
- Update copyright year to 2016
- Update all examples and provide demos and docs on website
- Add Carousel, ParallaxCats, GoogleNow and SafariTabs examples
- Smoother animations by scaling deviceRatio
- Better `resize` event handling for dealing with animating URL bars on mobile devices
- Add `Transitionable` test

**Core**

- `Transitionable` fix `set` and `reset` methods for multi-dimensional velocity transitions
- `Transitionable` fix `halt` method
- Element size is not commited unless changed

**DOM**

- `Surface` and `ContainerSurface` have `enableScroll` parameter to use native scrolling
- `Surface` and `ContainerSurface` have `roundToPixel` to prevent font aliasing effects
- `Context` can take a `perspectiveOrigin` attribute
- `Surface` has `remove` method to clear its DOM contents for later reuse

**Events**

- `EventFilter` only takes `data` argument. Removed `type` argument.

**Inputs**

- Update `MouseInput`, `TouchInput` and `ScrollInput` with `cumulate` property
- PreventDefault on `TouchInput` and `ScrollInput` to prevent native scrolling behavior
- `ScrollInput` sets velocity to 0 for `end` event when trackpad is used

**Streams**

- `Stream` now batches `update` events

**Transitions**

- Rename `damping` to `drag` in `Inertia`

**Views**

- `Scrollview` now has `marginTop` and `marginBottom` options
- `Scrollview` rename `goto` method to `goTo`
- `Scrollview` has support for inertia
- `View` supports `aspectRatio` setting

## 0.1.3

**General**
- Fix npm packaging issue

## 0.1.2

**General**
- Included support for tests with Intern.js
- Minor modifications to examples

## 0.1.1

**General**

- Hot fix inertial scroll bug in samsara.css
- Hot fix build step in package.json
- Made documentation consistent with src -> samsara rename

## 0.1.0

**General**
- Physics transitions
- Native scroll support via `enableScroll` option for `Surfaces`
- New directory structure, with examples and docs included

**Core**
- UPDATE `View` has `getSize` method

**DOM**
- UPDATE `Surface` has `enableScroll` option supporting native scrolling. 

**Transitions**
- ADD physics transitions `Spring` and `Inertia`
- ADD `setMany` method for chaining animations
- MOVE `TweenTransition` renamed to `Tween`
- DELETE `Easing.js`, some curves bundled into `Tween.js`
- UPDATE improved velocity calculation with centered difference scheme
- UPDATE improved architecture for n-dimensional arrays
- UPDATE `loop` method to new API
- FIX `halt` method now emits `end` event

**Inputs**
 - FIX velocity calculations for `TouchInput`
 - FIX `MouseInput` returns `false` to stop event propagation

**Streams**

- FIX `Stream` handles `end` events during updating correctly
- UPDATE `Accumulator` takes clamping options

**Layouts**
- UPDATE Improved DrawerLayout

## 0.0.4

**General**

- ADD samsara.css, samsara.js, samsara.min.js bundles
- ADD `dom` directory
- ADD `index.js` files for concatenation
- MOVE `Surface`, `Context`, `ContainerSurface` to `dom` directory
- MOVE `EventHandler` and `EventEmitter` to `events` directory
- UPDATE `samsara.css` for streamlining. Delete from `core` directory
- UPDATE require.js paths to be relative
 
**Core**

- UPDATE `Engine` to private class. Strip DOM dependency.
- UPDATE `Context` with `mount` method and new API use
- UPDATE `Transitionable.halt` emits events
- UPDATE `LayoutNode` and `SizeNode` created with JSON automatically
- FIX `Timer` clearing

**Layouts**

- UPDATE `SequentialLayout` to output length stream
- ADD Desktop version of `Scrollview`

## 0.0.3

**General**

- UPDATE documentation. Many more examples. 
- UPDATE Samsara.css. `samsara-surface` no longer has `preserve-3d` and
 `samsara-context` doesn't assume full-screen mode.

**Core**

- UPDATE `Context` to support taking pre-existing DOM elements 
- UPDATE `SizeNode` and `Surface` to accept aspect ratios
- UPDATE Commit functions removed. Stream all the things!
- UPDATE `resize` event emitted in `Surface`
- RENAME `SceneGraphNode` is now `RenderNode`
- FIX debounce method in `Timer`
- FIX reference bug for `DEFAULT_OPTIONS`

**Inputs**

- UPDATE `ScrollInput` calls `event.preventDefault()`

**Streams**

- UPDATE `Accumulator` has a `set` method and emits `start`, `end` events

**Layouts**

- UPDATE `DrawerLayout` default velocityThreshold to Infinity

## 0.0.2

**General**

- UPDATE documentation
	
**Core**

- ADD `Engine.size` property
- ADD `Engine.createRoot` method
- ADD `Transform.scaleX/Y/Z` methods
- FIX `Surface` dirtying
- FIX `Surface` overriding content of pre-existing elements
	
**Layouts**

- ADD `GridLayout`

## 0.0.1

- Initial release