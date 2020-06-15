<!-- # LUME -->

# <a href="//lume.io"><img src="./logo.svg" width="200" alt="LUME" title="LUME" /></a>

#### **A toolkit for creating rich and interactive 2D or 3D experiences for any device form factor from mobile to desktop to AR/VR headsets.**

<h3>
  <a href="//lume.io">Home</a>&nbsp;&nbsp;·&nbsp;
  <a href="//lume.io/docs">Documentation</a>&nbsp;&nbsp;·&nbsp;
  <a href="//lume.io/docs/#/examples/hello3d">Examples</a>&nbsp;&nbsp;·&nbsp;
  <a href="//lume.community">Forum</a>&nbsp;&nbsp;·&nbsp;
  <a href="//discord.gg/PgeyevP">Discord</a>&nbsp;&nbsp;·&nbsp;
  <a href="//github.com/lume/lume">GitHub</a>
</h3>

### `npm install lume`

## Features

LUME is composed of several packages that can be used individually, or
together as a whole:

### [`lume`](./packages/lume/README.md) - HTML elements for defining rich graphics

This is the main package that exports HTML elements for defining rich and
interactive visuals powered by both CSS and WebGL.

This package uses and re-exports features from the below packages.

### [`glas`](//github.com/lume/glas) - WebGL engine written in AssemblyScript

This is a port of Three.js to AssemblyScript (TypeScript that compiles to
WebAssembly) for running WebGL graphics with consistent performance.

### [`@lume/element`](//github.com/lume/element) - System for defining HTML elements

This is a web component system that allows you to create new, fast, and
performant HTML elements in a simple way. It provides the foundation for
LUME's HTML elements, and a standard pattern for building new elements that
extend the features of LUME.

### [`@lume/variable`](//github.com/lume/variable) - A reactivity system

Create variables that are easy to react to when their values change.

### [`@lume/element-behaviors`](//github.com/lume/element-behaviors) - Augment HTML elements

This allows you to augment HTML elements with features called "behaviors"
that are similar to custom elements: each behavior is defined as a `class`
that has the same lifecycle methods as custom elements. The difference is
that an unlimited number of behaviors can be associated with an element.

## Getting involved

There's various way to get involved!

-   Visit the [documentation](//lume.io/docs) and make something awesome!
-   Submit fixes or new features to any packages or the website! See the
    [contributing](./CONTRIBUTING.md) guide.
-   Discuss LUME, get help, or help others in the [forums](//lume.community) or
    on our Discord [chat server](//discord.gg/PgeyevP).

## Status

![](https://github.com/lume/lume/workflows/tests/badge.svg)
