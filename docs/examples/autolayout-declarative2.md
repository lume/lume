# Autolayout (declarative)

<div id="example"></div>

<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="1000" />',
    data: {
      code: stripIndent(/*html*/`
        <body touch-action="none">
          <script src="${location.origin+location.pathname}global.js"><\/script>
          <!-- pointer events polyfill (touch-action support for Safari 12 and lower) -->
          <script src="https://code.jquery.com/pep/0.4.3/pep.js"><\/script>

          <style>
              body, html {
                  width: 100%; height: 100%;
                  margin: 0; padding: 0;
                  overflow: hidden;
                  touch-action: none; /* prevent touch drag from scrolling */
              }
          <\/style>

          <!-- In general it is always better to ensure custom elements are defined before using them. -->
          <!-- FIXME: If we move this script to after the scene's markup, then the last item in the layout never becomes visible for some reason. -->
          <script>
              LUME.defineElements()
              const {html} = LUME
              const names = ['one', 'two', 'three', 'four', 'five']
          <\/script>

          <lume-scene id="scene" webgl touch-action="none">
              <lume-camera-rig align-point="0.5 0.5"></lume-camera-rig>
              <lume-ambient-light intensity="0.1"></lume-ambient-light>
              <lume-point-light
                  id="light"
                  color="white"
                  position="300 300 120"
                  size="0 0 0"
                  cast-shadow="true"
                  intensity="0.5"
                  shadow-radius="2"
                  distance="800"
                  shadow-bias="-0.01"
                  >
                  <lume-mesh
                      has="sphere-geometry basic-material"
                      size="10 10 10"
                      color="white"
                      receive-shadow="false"
                      cast-shadow="false"
                      mount-point="0.5 0.5 0.5"
                      style="pointer-events: none"
                      >
                  </lume-sphere>
              </lume-point-light>
              <lume-autolayout
                  id="layout"
                  TODO="why do we need Z size 0 here, but not in the imperative example?"
                  size="600 400 0"
                  position="0 0 0"
                  align-point=" 0.5 0.5 0"
                  mount-point=" 0.5 0.5 0"
                  visual-format="
                      V:|-[one(three)]-[three]-|
                      V:|-[two(four)]-[four]-|
                      V:[five(four)]-|
                      |-[one(two)]-[two]-|
                      |-[three(four,five)]-[four]-[five]-|
                  "
                  style="background: rgba(0,0,0,0.3)"
              >
                  <!-- prettier-ignore -->
                  <script>
                    layout.append(...names.map(name => html\`
                      <lume-mixed-plane size="1 1" size-mode="proportional proportional" color="deeppink" slot=\${name}>This is a paragraph of text to show that it reflows when the size of the layout changes size so that the awesomeness can be observed in its fullness.</lume-mixed-plane>
                    \`))
                  <\/script>
              </lume-autolayout>
          </lume-scene>

          <script>
              const layout = document.querySelector('#layout')
              layout.size = (x,y,z,t) => [600+200*Math.sin(t/1000),400+200*Math.sin(t/1000),z]

              const light = document.querySelector('#light')

              document.addEventListener('pointermove', function(e) {
                  e.preventDefault()
                  light.position.x = e.clientX
                  light.position.y = e.clientY
              })

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
