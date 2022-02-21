# Disco Helmet

<div id="example"></div>

<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`
<style>
  html,
  body {
    width: 100%;
    height: 100%;
    margin: 0;
    background: black;
  }
  loading-icon {
    --loading-icon-color: 255, 255, 0; /* yellow */
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 10px; height: 10px;
  }
  lume-scene {
    touch-action: none;
  }
  .hidden { visibility: hidden; }
</style>

<script src="${location.origin+location.pathname}global.js"><\/script>

<!-- See src/examples/LoadingIcon.ts -->
<loading-icon id="loading"></loading-icon>

<lume-scene id="scene" perspective="800" class="hidden" webgl enable-css="false" shadowmap-type="pcfsoft" touch-action="none">
    <lume-camera-rig active id="rig" rotation="0 30 0" min-polar-angle="-11"></lume-camera-rig>
    <lume-perspective-camera active id="cam" position="0 0 1000"></lume-perspective-camera>

    <!-- See src/examples/FlickeringOrbs.ts -->
    <flickering-orbs id="lights" rotation="0 30 0"></flickering-orbs>

    <lume-gltf-model
    	id="model"
    	src="${location.origin+location.pathname}examples/disco-helmet/DamagedHelmet.glb"
    	rotation="0 45 0"
    	size="2 2 0"
    	mount-point="0.5 0.5 0.5"
    	scale="200 200 200"
    ></lume-gltf-model>

    <lume-plane
    	color="black"
    	size="4000 4000"
    	rotation="90 0 0"
    	mount-point="0.5 0.5 0.5"
    	position="0 300 0"
    ></lume-plane>
</lume-scene>

<div ui>
  <fieldset>
    <legend>Options</legend>
    <label>
      <input id="rigActive" type="checkbox" checked />
      Use camera rig (otherwise use static camera)
    </label>
  </fieldset>
</div>

<style>
  [ui] {
    color: cyan; user-select: none;
    font-style: sans-serif;
    position: absolute; top: 0; left: 0;
    margin: 10px;
  }
  fieldset {border-radius: 5px; border-color: deeppink}
  legend {color: yellow}
</style>

<script>
  LUME.defineElements()

  lights.rotation = (x, y, z, t) => [x, y + 0.2, z]

  const rig = document.getElementById('rig')

  rigActive.addEventListener('input', () => {
    // Toggle between the rig being active or not.
    rig.active = rigActive.checked
  })

  // Custom handling of the underlying Three.js tree.
  model.on('MODEL_LOAD', () => {
    model.three.traverse(n => {
      if ('material' in n) {
        n.castShadow = true
        n.receiveShadow = true
        model.needsUpdate()
      }
    })

    scene.classList.remove('hidden')
    loading.classList.add('hidden')
  })
<\/script>
`
},
})
</script>
