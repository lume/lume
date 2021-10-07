# Cameras

> :construction: :hammer: Under construction! :hammer: :construction:

There are different ways to control a scene's "camera". A camera is an object
that is placed somewhere inside a LUME scene, and its position in that world
determines from where we will view the scene, much like a camera in the real
world.

In the following example, a `<lume-perspective-camera>` element is placed into
the scene, and we can control several aspects of the camera like the field of
view (fov), position, and rotation.

The perspective camera starts inactive. When a manually-created camera is not
active (i.e. it does not have an `active` attribute, or the attribute is set to
`active="false"`), then the scene will use a default camera. Once the
perspective camera is active we can control its attributes.

<div id="perspectiveCamera"></div>

<script type="application/javascript">
  new Vue({
    el: '#perspectiveCamera',
    template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`
<body touch-action="none">

<script src="${location.origin+location.pathname}global.js"><\/script>
<!-- pep.js provides the pointer events (pointermove, pointerdown, etc) -->
<script src="https://code.jquery.com/pep/0.4.3/pep.js"><\/script>

<style>
    body, html {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background: #191919;
        touch-action: none; /* prevent touch drag from scrolling */
        color: #ccc;
    }
    lume-scene { position: absolute!important; top: 0; left: 0; }
    lume-scene:nth-child(2) { pointer-events: none; }
    lume-node { padding: 15px; pointer-events: all; }
    label { padding-right: 10px; }
</style>

<lume-scene id="scene" webgl perspective="800">
    <!-- This node visualizes the size of the default viewing area. -->
    <lume-node size-mode="proportional proportional" size="1 1" style="border: 5px solid royalblue;"></lume-node>
    <lume-perspective-camera id="cam" position="0 0 1000" align-point="0.5 0.5"></lume-perspective-camera>
    <lume-ambient-light intensity="0.3"></lume-ambient-light>
    <lume-point-light
        id="light"
        color="white"
        cast-shadow="true"
        intensity="0.8"
        position="0 0 300"
    >
        <lume-mesh has="sphere-geometry basic-material" cast-shadow="false" size="10 10 10" mount-point="0.5 0.5" color="#eee"></lume-mesh>
    </lume-point-light>
    <!-- Specify a color otherwise the material will be tinted deeppink by default -->
    <lume-mesh id="model"
        has="box-geometry phong-material"
        rotation="40 40 0"
        align-point="0.5 0.5 0.5"
        mount-point="0.5 0.5 0.5"
        size="100 100 100"
        color="white"
        texture="${location.origin+location.pathname}textures/cement.jpg"
    >
    </lume-mesh>

</lume-scene>

<lume-scene id="scene2">
    <lume-node size-mode="proportional literal" size="1 80">
        <!-- FIXME When toggling these too fast, the toggling breaks. Three.js Loader problem? -->
        <label>
            Field of view <code id="fovValue">(50)</code>:
            <input id="fov" type="range" min="1" max="75" value="50">
        </label><br />
        <label>
            Camera element active:
            <input id="active" type="radio">
        </label>
    </lume-node>
</lume-scene>

<script>
    // defines the default names for the HTML elements
    LUME.useDefaultNames()

    const light = document.querySelector('#light')

    document.addEventListener('pointermove', event => {
        event.preventDefault()
        light.position.x = event.clientX
        light.position.y = event.clientY
    })

    const el = document.querySelector('#model')

    const rotate = (t) => 180 * Math.sin(0.0005 * t)
    el.rotation = (x, y, z, t) => [rotate(t/1.4), rotate(t/2.1), rotate(t/2.5)]

    const onFovChange = event => {
        cam.fov = event.target.value
        fovValue.textContent = '('+event.target.value.padStart(2, '0')+')'
    }

    fov.addEventListener('change', onFovChange)
    fov.addEventListener('input', onFovChange)

    active.addEventListener('change', e => cam.active = !cam.active)
<\/script>
</body>
`
    },
  })
</script>
