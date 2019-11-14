# Hello 3D

<!-- <code-vue :options="{theme: 'base16-light'}" template="#rotating-square" :autorun="true" />
<script type="text/x-template" id="rotating-square"><template>
  <i-scene>
    <i-node ref="node"
      size="100 100"
      align="0.5 0.5 0.5"
      mount-point="0.5 0.5 0.5"
    >
      Hello 3D
    </i-node>
  </i-scene>
</template>

<style>
  i-node {
    background: deeppink;
  }
</style>

<script>
  infamous.useDefaultNames()

  export default {
    mounted() {
      const node = this.$refs.node
      node.rotation = (x, y, z) => [x, ++y, z]
    },
  }
&lt;/script></script> -->

<div id="example"></div>
<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<code-vue :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`
<script src="${location.origin}/infamous.js"><\/script>

<i-scene>
  <i-node
    id="node"
    size="100 100"
    align="0.5 0.5 0.5"
    mount-point="0.5 0.5 0.5"
  >
    Hello 3D
  </i-node>
</i-scene>

<style>
  html, body {
    margin: 0; padding: 0;
    height: 100%; width: 100%;
  }
  i-scene {
    background: #333
  }
  i-node {
    background: deeppink;
  }
</style>

<script>
  infamous.useDefaultNames()
  node.rotation = (x, y, z) => [x, ++y, z]
<\/script>

`
    },
  })
</script>
