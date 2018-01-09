infamous
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
========

Create 3D CSS+WebGL apps declaratively with HTML.

[Site](http://infamous.io) — [Forums](http://forums.infamous.io) — [Examples](./docs/examples.md) — [Docs](./docs/README.md)

About
-----

Infamous gives you general-purpose [Custom HTML
Elements](https://developers.google.com/web/fundamentals/architecture/building-components/customelements)
that the browser understands, for defining 2D or 3D scenes rendered with CSS3D,
WebGL, or both mixed together.

If you prefer imperative JavaScript, you can also use the imperative JavaScript
API.

Infamous' "mixed mode" let's us combine traditional HTML elements with new ones
that render to WebGL (powered by Three.js), which means we can render
traditional elements and 3D objects like spheres and cubes (and soon any 3D
model) together in the same 3D space (with lighting and shadow not just on the
WebGL objects, but on the DOM elements too!).

Unlike traditional CSS `box-shadow` which is flat and boring, with Infamous we
can give UIs __*real*__ shadows! [See for
yourself!](https://codepen.io/trusktr/pen/rpegZR)

Infamous is built on the [Web Component
standards](https://www.w3.org/standards/techs/components#w3c_all), making it
possible to write 3D scenes declaratively using custom HTML elements,
regardless of which view layer you prefer. This makes it possible for you write
3D scenes using popular HTML frameworks like (but not limited to)
[React](https://facebook.github.io/react), [Vue.js](https://vuejs.org),
[Meteor](http://meteor.com), [Angular](https://angular.io),
[Ember.js](https://www.emberjs.com), or even the great
[jQuery](http://jquery.com).

Supported browsers are Google Chrome, Mozilla Firefox, Opera, and Microsoft
Edge. You're luck may vary with anything lower than Edge, though in theory this
should at least work in IE11 but it might require some additional transpile
steps and WebGL feature detection guards. CSS3D rendering may even work in IE10
with scenes that only have one level of nesting. PRs welcome!

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars0.githubusercontent.com/u/2830402?v=4" width="100px;"/><br /><sub>corruptedzulu</sub>](https://github.com/corruptedzulu)<br />[💻](https://github.com/trusktr/infamous/commits?author=corruptedzulu "Code") [📖](https://github.com/trusktr/infamous/commits?author=corruptedzulu "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/297678?v=4" width="100px;"/><br /><sub>Joseph Orbegoso Pea</sub>](http://trusktr.io)<br />[💻](https://github.com/trusktr/infamous/commits?author=trusktr "Code") [🐛](https://github.com/trusktr/infamous/issues?q=author%3Atrusktr "Bug reports") [📖](https://github.com/trusktr/infamous/commits?author=trusktr "Documentation") [💡](#example-trusktr "Examples") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

[![BrowserStack](https://cloud.githubusercontent.com/assets/297678/18807024/f6a2ed04-81f1-11e6-94d7-b4205ed77db8.png)](https://www.browserstack.com/)
