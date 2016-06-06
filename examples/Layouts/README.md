These examples showcase the different layouts included in Samsara. Layouts are simply Samsara `views`, 
so they can be added to the render tree just like `Surfaces`. They can also be combined. For instance, 
you can have a scrollview of grid layouts, or a drawer layout whose content is a masonry layout, with
each entry being a sequential layout, etc.

Here we give a brief description of each layout. Open the examples for interactive demos.

| Name | Description |
| ---- | ----------- |
| SequentialLayout | Add renderables sequentially in the x- or y-directions. Can overflow its size. |
| FlexLayout | Add renderables sequentially. Renderables maintain a proportion (given by a flex value) of the available size. |
| GridLayout | A grid where each row is a FlexLayout |
| Masonry | A grid where each column is a SequentialLayout |
| HeaderFooterLayout | A three-part layout consisting of a header, footer and content. Either the header or footer can be left unspecified. |
| DrawerLayout | A two-part layout consisting of a swipeable drawer that can be opened and closed to reveal the content |
| Scrollview | A scrollable SequentialLayout |
