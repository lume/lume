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
  lume-scene {
    touch-action: none;
  }
</style>

<script src="${location.origin+location.pathname}global.js"><\/script>

<lume-scene id="scene" perspective="800" webgl enable-css="false" shadowmap-type="pcfsoft" touch-action="none">
    <lume-camera-rig active id="rig" rotation="0 30 0" min-polar-angle="-11"></lume-camera-rig>
    <lume-perspective-camera active id="cam" position="0 0 1000"></lume-perspective-camera>

    <flickering-orbs id="lights" rotation="0 30 0"></flickering-orbs>

    <lume-gltf-model
    	id="model"
    	src="https://rawcdn.githack.com/KhronosGroup/glTF-Sample-Models/c99173c645f47fae603dcb2e7263e656e265cf06/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb"
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
  LUME.useDefaultNames()

  lights.rotation = (x, y, z, t) => [x, y + 0.2, z]

  // setTimeout(() => cam.active = true, 3000)

  // Custom handling of the underlying Three.js tree.
  model.on('GLTF_LOAD', () => {
    model.three.traverse(n => {
      if ('material' in n) {
        n.castShadow = true
        n.receiveShadow = true
        model.needsUpdate()
      }
    })
  })

  const rig = document.getElementById('rig')

  rigActive.addEventListener('input', () => {
    // Toggle between the rig being active or not (recommended).
    rig.active = rigActive.checked

    // Alternatively toggle the rig by adding/removing the rig to/from DOM (less ideal, more CPU usage).
    // if (rigActive.checked) scene.append(rig)
    // else rig.remove()
  })
<\/script>
`
},
})
</script>
