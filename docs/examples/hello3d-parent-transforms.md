# Hello 3D, Parent Transforms

<div id="example"></div>
<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<code-vue class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`<script src="http://localhost:3000/infamous.js"><\/script>

<i-scene>
  <i-node position="50 50">
    <i-node position="50 50">
      <i-node
        id="container"
        size="100 100"
        position="50 50"
      >
        Hello 3D World, at position 150,150!
      </i-node>
    </i-node>
  </i-node>
</i-scene>

<style>
  html, body {
    margin: 0; padding: 0;
    height: 100%; width: 100%;
  }
  i-scene { background: #333 }
  i-node { background: royalblue }
</style>

<script>
  infamous.useDefaultNames()
  container.rotation = (x, y, z) => [x, ++y, z]
<\/script>
`
    },
  })
</script>
