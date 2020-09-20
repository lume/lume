# obj-model

<div id="example"></div>
<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="1000" />',
    data: {
      code:
`
<script src="${location.origin+location.pathname}/global.js"><\/script>
<!-- pep.js provides the pointer events (pointermove, pointerdown, etc) -->
<script src="https://code.jquery.com/pep/0.4.3/pep.js"><\/script>

<style>
    body, html {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background: #222;
        touch-action: none; /* prevent touch drag from scrolling */
        color: #ccc;
    }
    lume-scene { position: absolute!important; top: 0; left: 0; }
    lume-scene:nth-child(2) { pointer-events: none; }
    lume-node { padding: 15px; pointer-events: all; }
</style>

<body touch-action="none">

<!-- Use the disable-css attribute so that only WebGL rendering is enabled
(if you don't need CSS rendering, turn it off to save CPU). -->
<lume-scene id="scene" experimental-webgl disable-css>
    <lume-ambient-light intensity="0.1"></lume-ambient-light>
    <lume-point-light
        id="light"
        color="#ffe9ab"
        position="300 300 600"
        size="0 0 0"
        cast-shadow="true"
        >
        <lume-sphere
            has="basic-material"
            size="5 5 5"
            color="#ffe9ab"
            receive-shadow="false"
            cast-shadow="false"
            style="pointer-events: none"
            >
        </lume-sphere>
    </lume-point-light>
    <lume-node id="ship1Rotator" align="0.5 0.5 0" rotation="0 40 0">
        <!-- This is an lume-node element with an obj-model behavior. The
        obj-model behavior observes the obj and mtl attributes. -->
        <lume-node
            id="ship1"
            has="obj-model"
            size="0 0 0 "
            scale="200 200 200"
            position="0 -30 100"
            obj="${location.origin + location.pathname}/models/spaceship/ship.obj"
            mtl="${location.origin + location.pathname}/models/spaceship/ship.mtl"
        >
        </lume-node>
    </lume-node>
    <lume-node id="ship2Rotator" align="0.5 0.5 0" rotation="0 20 0">
        <!-- Alternatively, the lume-obj-model is an element that implicityly
        has an obj-model behavior. We've omitted the mtl attribute, so this
        model will by default have a plain random color. -->
        <lume-obj-model
            id="ship2"
            size="0 0 0"
            scale="200 200 200"
            position="0 30 210"
            obj="${location.origin+location.pathname}/models/spaceship/ship.obj"
        >
        </lume-obj-model>
    </lume-node>
</lume-scene>

<!-- We're using two scenes, the next one for overlaid HTML/CSS-based UI, the previous one for WebGL content. -->

<lume-scene id="scene">
    <lume-node size-mode="proportional literal" size="1 80">
        <!-- FIXME When toggling these too fast, the toggling breaks. Three.js Loader problem? -->
        <label><input id="objToggle" type="checkbox" checked /> Enable model on first ship.</label>
        <label><input id="matToggle" type="checkbox" /> Enable material on second ship.</label>
    </lume-node>
</lume-scene>

<script>
    // defines the default names for the HTML elements
    LUME.useDefaultNames()

    document.addEventListener('pointermove', function(e) {
        e.preventDefault()
        light.position.x = e.clientX
        light.position.y = e.clientY
    })

    smooth(ship1)
    smooth(ship2)

    const { Motor } = LUME
    Motor.addRenderTask(() => {
        ship1Rotator.rotation.y -= 0.1
        ship2Rotator.rotation.y -= 0.4
    })

    function smooth(objModelElement) {
        const {Events} = LUME

        // Use the 'MODEL_LOAD' event to work with the 'model' once loaded, if
        // needed. 'model' is an instance of THREE.Group containing THREE.Mesh
        // objects
        objModelElement.on(Events.MODEL_LOAD, ({ model }) => {
          console.log('%%%%%%%%%%%%%%%% modify geometry')
            modifyGeometry(model)

            // we modified the internals the element, signal that it
            // needs an update on next render
            objModelElement.needsUpdate()
        })

    }

    function modifyGeometry(obj) {

        // Use Three.js APIs to traverse obj's decendants.
        obj.traverse(node => {

            if ('geometry' in node) {

                // Re-center the geometry around the local origin.
                node.geometry.center()

                // In case the model's shading looks flat on each polygon, this is a trick to
                // make it look smooth. See https://discourse.threejs.org/t/5531
                const tempGeometry = new THREE.Geometry().fromBufferGeometry( node.geometry );
                tempGeometry.mergeVertices();
                tempGeometry.computeVertexNormals();
                node.geometry = new THREE.BufferGeometry().fromGeometry( tempGeometry );

            }

        })

    }

    objToggle.addEventListener('click', () => {
        objBehavior = ship1.behaviors.get('obj-model')
        if (objBehavior.obj) objBehavior.obj = ''
        else objBehavior.obj = '${location.origin + location.pathname}/models/spaceship/ship.obj'
    })

    matToggle.addEventListener('click', () => {
        objBehavior = ship2.behaviors.get('obj-model')
        if (objBehavior.mtl) objBehavior.mtl = ''
        else objBehavior.mtl = '${location.origin + location.pathname}/models/spaceship/ship.mtl'
    })
<\/script>

</body>

`
    },
  })
</script>
