# Miscellaneous Notes

- WebGL rendering is currently powered by [Three.js](https://threejs.org). All
  elements have a `.three` property that you can access if you want to
  do custom things with the Three.js parts.
- Augmented and virtual reality modes (AR, VR) are not yet implemented, coming soon!
  - Implementing this should be a simple matter of taking advantage of builtin
    VR mode that ships with Three.js.
  - CSS3D doesn't support WebVR (at least not yet), therefore the only form of
    AR/VR that we can achieve with CSS3D rendering will be the type that splits
    the web page into two halves (one for each eye), which means CSS3D AR/VR
    will work only on headsets that carry mobile devices like Google Cardboard
    or Google Daydream. It may be possible to maps halves of a web page to
    specific eyes on other devices like Oculus, but this is a little way off.
- CSS3D objects can not be bent or distorted in 3D space at the moment (Adobe's
  CSS Shaders (later called CSS Custom Filters) proposal [was
  dropped](https://lists.webkit.org/pipermail/webkit-dev/2014-January/026098.html)),
  meaning traditional HTML elements can currently only be rendered as flat
  planes and nothing else.
  <!--
  - However, in the near future, we might be able to expose the hacky utility
    of tools like html2canvas via our API in order to manipulate textures
    generated from HTML content within WebGL directly. This has limitations,
    and some CSS styling may not work.
  -->
