<!-- # LUME -->

# <a href="//lume.io"><img src="./logo.svg" width="200" alt="LUME" title="LUME" /></a>

#### **A toolkit that simplifies the creation of rich and interactive 2D or 3D experiences for any device from mobile to desktop to AR/VR.**

<h3>
  <a href="//lume.io">Home</a>&nbsp;&nbsp;·&nbsp;
  <a href="//lume.io/docs">Documentation</a>&nbsp;&nbsp;·&nbsp;
  <a href="//lume.io/docs/#/examples/hello3d">Examples</a>&nbsp;&nbsp;·&nbsp;
  <a href="//lume.community">Forum</a>&nbsp;&nbsp;·&nbsp;
  <a href="//discord.gg/PgeyevP">Chat</a>&nbsp;&nbsp;·&nbsp;
  <a href="//github.com/lume/lume">Source</a>
</h3>

### `npm install lume`

## Features

LUME is composed of several packages that can be used individually, or
together as a whole:

### [`lume`](./packages/lume/README.md) - HTML elements for rich graphics

HTML elements for easily defining rich and interactive 2D or 3D applications
powered by both CSS and WebGL.

This package uses and re-exports features from the below packages.

### [`glas`](//github.com/lume/glas) - WebGL engine written in AssemblyScript

LUME glas is a WebGL engine with the consistent performance of WebAssembly, written
in AssemblyScript (a TypeScript-to-WebAssembly compiler). Currently LUME's 3D elements
use Three.js, but eventually we will switch to LUME glas once it is ready.

### [`@lume/element`](//github.com/lume/element) - System for defining HTML elements

This is a web component system that allows you to create new, fast, and
performant HTML elements in a simple way. It provides the foundation for
LUME's HTML elements, and a standard pattern for building new elements that
extend the features of LUME.

### [`@lume/variable`](//github.com/lume/variable) - Reactive variables

Create reactive variables and observe their changes in a simple and concise way with
less code and less coupling.

### [`element-behaviors`](//github.com/lume/element-behaviors) - Mix functionalities onto HTML elements

This allows you to augment HTML elements with features called "behaviors"
that are similar to custom elements: each behavior is defined as a `class`
that has the same lifecycle methods as custom elements. The difference is
that an unlimited number of behaviors can be associated with an element.

## Getting involved

There's various ways to get involved!

- Visit the [documentation](//lume.io/docs) and make something awesome!
- Submit fixes or new features to any packages or the website! See the
  [contributing](./CONTRIBUTING.md) guide.
- Discuss LUME, get help, or help others in the [forums](//lume.community) or
  on our Discord [chat server](//discord.gg/PgeyevP).

## Status

![](https://github.com/lume/lume/workflows/tests/badge.svg)
