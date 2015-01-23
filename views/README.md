Views are high-level RenderNodes that accept the RenderNodes beneath them in the Render Tree as input 
and manage more complex behavior between them such as

- layout (e.g., GridLayout, FlexibleLayout)
- selectively showing and hiding (e.g., RenderController)
- handling user input (e.g., Scrollview, DrawerLayout)

## Files

- DrawerLayout.js: A layout which will arrange two renderables: a featured content, and a
  concealed drawer. The drawer can be revealed from any side of the
  content (left, top, right, bottom) by dragging the featured content.
  
- EdgeSwapper.js: Container which handles swapping renderables from the edge of
  its parent context.
  
- FlexibleLayout.js: A layout which divides a context into sections based on a proportion
  of the total sum of ratios.  FlexibleLayout can either lay renderables out vertically
  or horizontally.
  
- Flipper.js: Allows you to link two renderables as front and back sides that
  can be 'flipped' back and forth along a chosen axis.
- GridLayout.js: A layout which divides a context into several evenly-sized grid
  cells.
  
- HeaderFooterLayout.js: A layout which will arrange three renderables into a
  header and footer area of defined size, and a content area of flexible size.
  
- RenderController.js: Show, hide, or switch between different renderables with
  a configurable transitions and in/out states
  
- ScrollContainer.js: A scrollview added within a container surface.

- Scroller.js: Lays out a collection of renderables, and will browse through them based on accessed position.

- Scrollview.js:  Lays out the sequenced renderables sequentially and makes them
  scrollable.
  
- SequentialLayout.js: Lays out specified renderables sequentially.

## License

Copyright (c) 2014 Famous Industries, Inc.

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain
one at http://mozilla.org/MPL/2.0/.
