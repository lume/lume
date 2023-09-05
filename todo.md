Changes for Anastasiia

- [ ] Don't render things when they are off screen (f.e. the rainbow shader in
      the footer, the marquee with the glass ball, etc).

Changes for Lume

from anastasiia branch

- [ ] Fix #envVersion counter in WebGLRendererThree, it wasn't per scene
      instance, should be per scene state. Better yet, simplify, just make one
      renderer instance per Scene.
- [ ] Fix setClearColor in WebGLRendererThree, remove `any`, handle null

General

- [x] don't access DOM APIs at the top level of any modules, to prevent issues
      in SSR systems.
- [ ] (WIP) add pointer events for WebGL content
- [ ] (WIP) replace `.on` (Eventful) with `.addEventListener` (already have
      EventTarget)
- [ ] (WIP) move to classy-solid in lume/element then in lume, remove/deprecate
      lume/variable, re-export Solid from LUME
  - [ ] (WIP) update to official decorators. Yay!
        https://babeljs.io/blog/2022/09/05/7.19.0
- [ ] Make WebGL, layouts, etc, optional, as separate imports or separate global
      scripts. Make Three.js and Solid separate scripts too for global lume.
- [ ] make sure that lume/cli is symlinked after bootstrap in the lume package.
      For some reason it wasn't at time of writing.
- [ ] update TypeScript version
- [ ] update Solid.js version
