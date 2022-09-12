# Hello world!

<div id="example"></div>

<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`
<script src="${location.origin+location.pathname}global.js"><\/script>

<!-- Do you see the Moon's shadow on Earth's surface when it passes in front of the sun? -->

<!-- Polyfill for Pointer Events (boo Safari) -->
<script src="https://code.jquery.com/pep/0.4.3/pep.js"><\/script>

<!-- By default a <lume-scene> fills the space of it's parent, in this case the <body>. -->
<lume-scene id="scene" webgl touch-action="none">
  <lume-camera-rig initial-polar-angle="0" min-distance="90" max-distance="1000" initial-distance="200"></lume-camera-rig>
  <!-- Stars -->
  <lume-sphere
    id="stars"
    texture="${location.origin+location.pathname}examples/hello-world/galaxy_starfield.png"
    receive-shadow="false"
    has="basic-material"
    sidedness="back"
    size="4000 4000 4000"
    mount-point="0.5 0.5 0.5"
    color="white"
  ></lume-sphere>
  <!-- Sun light -->
  <lume-element3d size="0 0" rotation="0 -50 0">
    <lume-element3d size="0 0" rotation="10 0 0">
      <lume-point-light
        id="light"
        size="0 0"
        position="0 0 1800"
        color="white"
        intensity="2"
        distance="10000"
        shadow-map-width="2048"
        shadow-map-height="2048"
        shadow-camera-far="20000"
      ></lume-point-light>
    </lume-element3d>
  </lume-element3d>
  <!-- Earth -->
  <lume-element3d size="0 0 0">
    <lume-element3d rotation="0 180 0">
      <lume-sphere
        id="earth"
        texture="${location.origin+location.pathname}examples/hello-world/earthmap1k.jpg"
        bump-map="${location.origin+location.pathname}examples/hello-world/earthbump1k.jpg"
        specular-map="${location.origin+location.pathname}examples/hello-world/earthspec1k.jpg"
        size="120 120 120"
        mount-point="0.5 0.5 0.5"
        color="white"
      >
        <lume-sphere
          id="clouds"
          texture="${location.origin+location.pathname}examples/hello-world/earthclouds.png"
          opacity="0.7"
          size="125 125 125"
          mount-point="0.5 0.5 0.5"
          align-point="0.5 0.5 0.5"
          color="white"
        ></lume-sphere>
      </lume-sphere>
    </lume-element3d>
    <lume-element3d rotation="90 10 0">
      <lume-element3d id="moonRotator" rotation="0 0 110">
        <lume-sphere
          id="moon"
          texture="${location.origin+location.pathname}examples/hello-world/moon.jpg"
          position="250"
          size="5 5 5"
          mount-point="0.5 0.5 0.5"
          color="white"
        ></lume-sphere>
      </lume-element3d>
    </lume-element3d>
  </lume-element3d>
</lume-scene>

<style>
  html,
  body {
    background: #222;
    width: 100%;
    height: 100%;
    margin: 0;
    overflow: hidden;
  }

  lume-scene {
    /* Prevent touch scrolling from interfering with out pointermove handler. */
    touch-action: none;
  }

  lume-scene * {
    pointer-events: none;
  }
</style>

<script>
  // Define LUME's HTML elements with their default names.
  LUME.defineElements();

  // We wrote the rotation function this way so that it would always start
  // at the angle defined in the HTML.
  let lastTime = performance.now();
  let dt = 0;
  moonRotator.rotation = (x, y, z, time) => {
    dt = time - lastTime;
    lastTime = time;
    return [x, y, z + dt * 0.01];
  };

  // ^ We could've written it more simply but it would start at some angle
  // based on time instead of our preferred angle:
  // moonRotator.rotation = (x, y, z, t) => [x, y, t * 0.004];

  earth.rotation = (x, y, z, t) => [x, t * 0.01, z];
  clouds.rotation = (x, y, z, t) => [x, -t * 0.003, z];
<\/script>
`
    },
  })
</script>
