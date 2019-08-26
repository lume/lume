# obj-model

<div id="example"></div>
<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<code-vue :template="code" mode="html>iframe" :debounce="1000" />',
    data: {
      code:
`
<script src="http://localhost:3000/infamous.js"><\/script>

<style>
    body, html {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background: #222;
    }
</style>

<body>

<!-- use the disable-css attribute so that we have only WebGL rendering enabled -->
<i-scene id="scene" experimental-webgl disable-css>
    <i-ambient-light intensity="0.3"></i-ambient-light>
    <i-point-light
        id="light"
        color="deeppink"
        position="300 300 600"
        size="0 0 0"
        cast-shadow="true"
        intensity="0.5"
        >
        <i-sphere
            has="basic-material"
            size="5 5 5"
            color="deeppink"
            receive-shadow="false"
            cast-shadow="false"
            style="pointer-events: none"
            >
        </i-sphere>
    </i-point-light>
    <!-- an i-node element with an obj-model behavior. The obj-model
    behavior observes the obj and mtl attributes. -->
    <i-node
        id="ship1"
        rotation="0 40 0"
        align="0.5 0.5 0"
        size="0 0 0"
        scale="200 200 200"
        has="obj-model"
        obj="http://localhost:3000/models/spaceship/ship.obj"
        mtl="http://localhost:3000/models/spaceship/ship.mtl"
    >
    </i-node>
    <!-- alternatively, the i-obj-model is an node element that
    implicityly has an obj-model behavior. We've omitted the mtl, so the
    model will have a random-colored phong material: -->
    <i-obj-model
        id="ship2"
        rotation="0 20 0"
        align="0.5 0.5 0"
        size="0 0 0"
        scale="200 200 200"
        obj="http://localhost:3000/models/spaceship/ship.obj"
    >
    </i-obj-model>
</i-scene>

<script>
    // defines the default names for the HTML elements
    infamous.useDefaultNames()

    document.addEventListener('pointermove', function(e) {
        e.preventDefault()
        light.position.x = e.clientX
        light.position.y = e.clientY
    })

    smooth(ship1)
    smooth(ship2)

    const { Motor } = infamous
    Motor.addRenderTask(() => {
        ship1.rotation.y -= 0.1
        ship2.rotation.y -= 0.4
    })

    function smooth(objModelElement) {
        const {Events} = infamous

        // use the 'MODEL_LOAD' event to work with the 'model' once loaded, if needed.
        // 'model' is an instance of THREE.Group containing THREE.Mesh objects
        objModelElement.on(Events.MODEL_LOAD, ({ model }) => {
            setSmoothGeometry(model)

            // we modified the internals the element, signal that it
            // needs an update on next render
            objModelElement.needsUpdate()
        })

    }

    // if your model's shading looks flat on each polygon, use this to
    // make it look smooth. See https://discourse.threejs.org/t/5531
    function setSmoothGeometry(obj) {

        obj.traverse(node => {

            if ('geometry' in node) {

                const tempGeometry = new THREE.Geometry().fromBufferGeometry( node.geometry );
                tempGeometry.mergeVertices();
                tempGeometry.computeVertexNormals();
                node.geometry = new THREE.BufferGeometry().fromGeometry( tempGeometry );

            }

        })

    }
<\/script>

</body>

`
    },
  })
</script>
