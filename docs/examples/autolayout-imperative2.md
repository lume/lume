# Autolayout (imperative)

<div id="example"></div>

<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code: stripIndent(/*html*/`
        <body touch-action="none">
          <script src="${location.origin+location.pathname}global.js"><\/script>
          <!-- pointer events polyfill (touch-action support for Safari 13 (2019) and lower) -->
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
                  Autolayout,
                  Scene,
                  AmbientLight,
                  PointLight,
                  MixedPlane,
                  Sphere,
                  CameraRig
              } = LUME

              LUME.defineElements()

              const scene = document.body.appendChild(
                  new Scene().set({
                      webgl: true,
                  })
              )

              scene.setAttribute('touch-action', 'none')

              scene.append(
                  new CameraRig().set({
                      alignPoint: [0.5, 0.5]
                  })
              )

              scene.append(
                  new AmbientLight().set({
                      intensity: 0.1,
                  })
              )

              const pointLight = scene.appendChild(
                  new PointLight().set({
                      color: "white",
                      position: "300 300 120",
                      size: "0 0 0",
                      castShadow: "true",
                      intensity: "0.5",
                      shadowRadius: 2,
                      distance: 800,
                      shadowBias: -0.01,
                  })
              )

              const sphere = pointLight.appendChild(
                  new Sphere().set({
                      size: [10, 10, 10],
                      color: "white",
                      receiveShadow: false,
                      castShadow: false,
                      mountPoint: [0.5, 0.5, 0.5],
                      style: "pointer-events: none",
                  })
              )

              const behaviors = sphere.getAttribute('has')
              sphere.setAttribute('has', behaviors.replace('phong-material', 'basic-material'))

              const vfl1 = \`
                  //viewport aspect-ratio:3/1 max-height:300
                  H:|-[row:[one(two,five)]-[two]-[five]]-|
                  V:|-[row]-|
              \`
              const vfl2 = \`
                  V:|-[one(three)]-[three]-|
                  V:|-[two(four)]-[four]-|
                  V:[five(four)]-|
                  |-[one(two)]-[two]-|
                  |-[three(four,five)]-[four]-[five]-|
              \`

              const layout = scene.appendChild(
                  new Autolayout().set({
                      size: (x,y,z,t) => [ 600+200*Math.sin(t/1000), 400+200*Math.sin(t/1000), z ],
                      position: "0 0 0",
                      alignPoint: " 0.5 0.5 0",
                      mountPoint: " 0.5 0.5 0",
                      visualFormat: vfl2,
                      style: "background: rgba(0,0,0,0.3)",
                  })
              );

              const text = \`
                  This is a paragraph of text to show that it reflows when the
                  size of the layout changes size so that the awesomeness can be
                  observed in its fullness.
              \`

              for (const slot of ['one', 'two', 'three', 'four', 'five']) {
                  layout.append(
                      new MixedPlane().set({
                          color: 'deeppink',
                          size: [1, 1],
                          sizeMode: ['proportional', 'proportional'],
                          slot,
                          textContent: text,
                      })
                  )
              }

              document.addEventListener('pointermove', e => {
                  e.preventDefault()
                  pointLight.position.x = e.clientX
                  pointLight.position.y = e.clientY
              })

              let lastSize = 'big'
              let size = 'big' // or 'small'

              LUME.autorun(() => {
                  const {x, y, z} = layout.calculatedSize

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
