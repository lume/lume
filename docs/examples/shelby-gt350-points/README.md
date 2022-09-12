# Shelby GT350 Points

<div id="example"></div>

<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`
<script src="${location.origin+location.pathname}global.js"><\/script>

<style>
  html,
  body {
    width: 100%; height: 100%;
    margin: 0; padding: 0;
    background: #222;
    --color: 135, 206, 235; /*skyblue*/
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

<loading-icon id="loading"></loading-icon>

<lume-scene id="scene" perspective="800" webgl class="hidden">
  <lume-element3d position="-250 0 0">
    <lume-point-light id="light" intensity="3" color="limegreen"></lume-point-light>
  </lume-element3d>
  <lume-ambient-light color="white" intensity="0.6"></lume-ambient-light>
  <lume-camera-rig active rotation="0 -150 0" initial-distance="400" max-distance="700" min-distance="100"></lume-camera-rig>
  <!--
  Use a ply-behavior on an element with geometry (such as <lume-mesh> or
  <lume-points>) to load geometry points from a PLY file.
  -->
  <lume-points
    id="model"
    has="ply-geometry phong-material"
    src="${location.origin+location.pathname}examples/shelby-gt350-points/shelby-gt350.ply"
    rotation="90 0 0"
    position="-250 0 0"
    size="0 0 0"
    scale="50 50 50"
    color="royalblue"
  ></lume-points>
</lume-scene>

<div info align="center">Ford Shelby GT350 scanned with a Velodyne laser radar scanner (lidar).</div>

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
