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
	<lume-camera-rig rotation="0 30 0" align="0.5 0.5 0.5" min-polar-angle="-11"></lume-camera-rig>

    <flickering-orbs id="lights" align="0.5 0.5 0.5" rotation="0 30 0"></flickering-orbs>

    <lume-gltf-model
    	id="model"
    	src="https://rawcdn.githack.com/KhronosGroup/glTF-Sample-Models/c99173c645f47fae603dcb2e7263e656e265cf06/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb"
    	rotation="0 45 0"
    	size="2 2 0"
    	align="0.5 0.5 0.5"
    	mount-point="0.5 0.5 0.5"
    	scale="200 200 200"
    ></lume-gltf-model>

    <lume-plane
    	color="black"
    	size="4000 4000"
    	rotation="90 0 0"
    	align="0.5 0.5 0.5"
    	mount-point="0.5 0.5 0.5"
    	position="0 300 0"
    ></lume-plane>
</lume-scene>

<script>
  LUME.useDefaultNames()

  lights.rotation = (x, y, z, t) => [x, y + 0.2, z]

  model.on('GLTF_LOAD', () => {
    model.three.traverse(n => {
      if ('material' in n) {
        n.castShadow = true
        n.receiveShadow = true
        model.needsUpdate()
      }
    })
  })
<\/script>
`
},
})
</script>
