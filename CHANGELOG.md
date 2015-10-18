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