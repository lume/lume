- [x] don't access DOM APIs at the top level of any modules, to prevent issues in SSR systems.

- [ ] add pointer events for WebGL content

- [ ] replace `.on` (Eventful) with `.addEventListener` (already have EventTarget)

- [ ] move to classy-solid in lume/element then in lume, remove/deprecate lume/variable, re-export Solid from LUME

- [ ] update TypeScript version

- [ ] Make WebGL, layouts, etc, optional, as separate imports or separate global scripts. Make Three.js and Solid separate scripts too for global lume.

- [ ] update to official decorators. Yay! https://babeljs.io/blog/2022/09/05/7.19.0

- [ ] make sure that lume/cli is symlinked after bootstrap in the lume package. For some reason it wasn't at time of writing.
