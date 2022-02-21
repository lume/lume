# Hello VR

<div id="example"></div>

<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code: stripIndent(`
        <script src="${location.origin+location.pathname}global.js"><\/script>

        <lume-scene webgl vr>
          <lume-box
              id="node"
              size="80 80 80"
              align-point="0.5 0.5 0.5"
              mount-point="0.5 0.5 0.5"
              position="0 0 -500"
              rotation="30 30 30"
              color="deeppink">
          </lume-box>

          <lume-point-light
              align-point="0.5 0.5 0.5"
              mount-point="0.5 0.5 0.5"
              position="-200 0 0"
              color="white">
          </lume-point-light>
        </lume-scene>

        <style>
          html, body {
            margin: 0; padding: 0;
            height: 100%; width: 100%;
          }
          lume-scene {
            background: black;
          }
        <\/style>

        <script>
          LUME.defineElements()
          node.rotation = (x, y, z) => [x, ++y, z]
        <\/script>
      `)
    },
  })
</script>
