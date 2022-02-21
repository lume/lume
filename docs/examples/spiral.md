# Morphing Spiral

<div id="example"></div>
<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="1000" />',
    data: {
      code: `
<script src="${location.origin+location.pathname}global.js"><\/script>
<script src="${location.origin+location.pathname}node_modules/vue/dist/vue.js"><\/script>

<body>

  <template>
    <lume-scene>
      <lume-node
        ref="rotator"
        TODO-calculate-minimum-size-based-on-viewport-size
        size="1630 1630"
        align-point="0.5 0.5"
        mount-point="0.5 0.5"
        rotation="0 0 0"
      >
        <lume-scene v-once>
          <lume-node
            v-for="(n, i) of Array(400)"
            :key="i"
            size="0 0 0"
            align-point="0.5 0.5"
            :rotation="[0, 0, i * 10]"
          >
            <lume-node
              :size="[50 - i % 50, 50 - i % 50, 0]"
              mount-point="0.5 0.5"
              :position="[0, i * 2, 0]"
              :style="{
                background: 'hsl(' + ((i * 2) % 360) + ', 90%, 78%)',
                borderRadius: (i % 50) + 'px',
              }"
            >
            </lume-node>
          </lume-node>
        </lume-scene>
      </lume-node>
    </lume-scene>
  </template>

  <style>
    lume-scene {
      background: #333;
    }
    html, body {
      width: 100%; height: 100%;
      padding: 0; margin: 0;
    }
  </style>

  <script>
    LUME.defineElements()
    var template = document.querySelector('template')

    new Vue({
      el: template,
      template: template.innerHTML,
      mounted() {
        const rotator = this.$refs.rotator
        rotator.rotation = (x, y, z) => [x, y, z - 9.8]
      },
    })
  <\/script>

</body>

`
    }
  })
</script>

<!-- TODO show demo information without breaking the full height demo view:
- A ["picked" pen](https://codepen.io/trusktr/pen/JMMXPB) on CodePen!
- The 2D scene is defined using HTML
- JavaScript used for minimal animation
- Rendering: CSS3D -->
