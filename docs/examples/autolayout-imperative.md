# Autolayout (imperative)

<div id="example"></div>

<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code: stripIndent(`
        <body touch-action="none">
          <script src="${location.origin+location.pathname}global.js"><\/script>
          <!-- pep.js provides the pointer events (pointermove, pointerdown, etc) -->
          <script src="https://code.jquery.com/pep/0.4.3/pep.js"><\/script>

          <style>
              body, html {
                  width: 100%; height: 100%;
                  margin: 0; padding: 0;
                  overflow: hidden;
                  touch-action: none; /* prevent touch drag from scrolling */
              }
          <\/style>

          <script type="module">
              const {
                  AutoLayoutNode,
                  Scene,
                  AmbientLight,
                  PointLight,
                  MixedPlane,
                  Sphere
              } = LUME

              LUME.defineElements()

              const scene = new Scene().set({
                  webgl: true,
              })

              document.body.append(scene)

              const ambientLight = new AmbientLight().set({
                  intensity: 0.1,
              })

              scene.append(ambientLight)

              const pointLight = new PointLight().set({
                  color: "white",
                  position: "300 300 120",
                  size: "0 0 0",
                  castShadow: "true",
                  intensity: "0.5",
                  shadowRadius: 2,
                  distance: 800,
                  shadowBias: -0.01,
              })

              scene.append(pointLight)

              const sphere = new Sphere().set({
                  size: [10, 10, 10],
                  color: "white",
                  receiveShadow: false,
                  castShadow: false,
                  mountPoint: [0.5, 0.5, 0.5],
                  style: "pointer-events: none",
              })

              sphere.setAttribute('has', 'basic-material')
              pointLight.append(sphere)

              const vfl1 = \`
                  //viewport aspect-ratio:3/1 max-height:300
                  H:|-[row:[child1(child2,child5)]-[child2]-[child5]]-|
                  V:|-[row]-|
              \`
              const vfl2 = \`
                  V:|-[child1(child3)]-[child3]-|
                  V:|-[child2(child4)]-[child4]-|
                  V:[child5(child4)]-|
                  |-[child1(child2)]-[child2]-|
                  |-[child3(child4,child5)]-[child4]-[child5]-|
              \`

              const layout = new AutoLayoutNode().set({
                  size: [600, 400],
                  position: "0 0 0",
                  alignPoint: " 0.5 0.5 0",
                  mountPoint: " 0.5 0.5 0",
                  visualFormat: vfl2,
                  style: "background: rgba(0,0,0,0.3)",
              })

              const text = \`
                  This is a paragraph of text to show that it reflows when the
                  size of the layout changes size so that the awesomeness can be
                  observed in its fullness.
              \`

              const child1 = new MixedPlane().set({
                  color: 'deeppink'
              })

              child1.textContent = text
              layout.addToLayout(child1, 'child1')

              const child2 = new MixedPlane().set({
                  color: 'deeppink'
              })

              child2.textContent = text
              layout.addToLayout(child2, 'child2')

              const child3 = new MixedPlane().set({
                  color: 'deeppink'
              })

              child3.textContent = text
              layout.addToLayout(child3, 'child3')

              const child4 = new MixedPlane().set({
                  color: 'deeppink'
              })

              child4.textContent = text
              layout.addToLayout(child4, 'child4')

              const child5 = new MixedPlane().set({
                  color: 'deeppink'
              })

              child5.textContent = text
              layout.addToLayout(child5, 'child5')

              scene.append(layout);

              layout.size = (x,y,z,t) => [ 600+200*Math.sin(t/1000), 400+200*Math.sin(t/1000), z ]

              document.addEventListener('pointermove', e => {
                  e.preventDefault()
                  pointLight.position.x = e.clientX
                  pointLight.position.y = e.clientY
              })

              let lastSize = 'big'
              let size = 'big' // or 'small'

              layout.on('sizechange', ({x, y, z}) => {
                  if (x <= 600) size = 'small'
                  else size = 'big'

                  if (lastSize !== size) {
                      if (size === 'small') layout.visualFormat = vfl1
                      else layout.visualFormat = vfl2
                  }

                  lastSize = size
              })
          <\/script>
        </body>
      `).trim()
    },
  })
</script>
