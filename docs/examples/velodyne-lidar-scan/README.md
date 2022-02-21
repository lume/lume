# Velodyne Lidar Scan

<div id="example"></div>

<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`
<script src="${location.origin+location.pathname}global.js"><\/script>

<loading-icon id="loading"></loading-icon>

<lume-scene id="scene" perspective="800" webgl enable-css="false" class="hidden">
  <lume-point-light id="light" position="200 -200 200" intensity="3" color="deeppink"></lume-point-light>
  <lume-ambient-light color="white" intensity="0.6"></lume-ambient-light>
  <lume-camera-rig active rotation="0 -110 0" initial-distance="500" max-distance="1200" min-distance="100" initial-polar-angle="30"></lume-camera-rig>
  <lume-gltf-model src="${location.origin+location.pathname}examples/velodyne-lidar-scan/puck.gltf"></lume-gltf-model>
  <!--
    Use a ply-behavior on an element with geometry (such as <lume-mesh> or
    <lume-points>) to load geometry points from a PLY file.
  -->
  <lume-points
    id="model"
    has="ply-geometry phong-material"
    src="${location.origin+location.pathname}examples/velodyne-lidar-scan/shelby-scene.ply"
    rotation="90 0 0"
    position="0 0 60"
    size="0 0 0"
    scale="50 50 50"
    color="royalblue"
  ></lume-points>
</lume-scene>

<div info align="center">A scene scanned with a Velodyne laser radar scanner (lidar),<br />focused on a Ford Shelby GT350.</div>

<style>
  html,
  body {
    width: 100%; height: 100%;
    margin: 0; padding: 0;
    background: #222;
    --color: 228, 20, 255 /*vibrant pink*/;
    color: rgb(var(--color)); font-family: sans-serif;
    touch-action: none;
  }
  loading-icon {
    --loading-icon-color: var(--color);
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 10px; height: 10px;
  }
  [info] {
    position: absolute; top: 0; left: 0; width: 100%;
    box-sizing: border-box; padding: 10px;
  }
  .hidden { visibility: hidden; }
</style>

<script>
  LUME.defineElements()
  light.position = (x, y, z, t) => [500 * Math.sin(t * 0.001), 500 * Math.cos(t * 0.001), z]
  model.on('MODEL_LOAD', () => {
    scene.classList.remove('hidden')
    loading.classList.add('hidden')
  })
<\/script>
`
},
})
</script>
