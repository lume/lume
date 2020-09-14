# Parent transforms

<div id="example"></div>
<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`<script src="${location.origin+location.pathname}/global.js"><\/script>

<lume-scene>
  <lume-node id="one" position="50 50" size="10 10">
    <lume-node id="two" position="50 50" size="10 10">
      <lume-node id="three" position="50 50" size="100 100">
        Positioning is relative to parents!
      </lume-node>
    </lume-node>
  </lume-node>
</lume-scene>

<script>
  LUME.useDefaultNames()
  one.rotation = (x, y, z, t) => [x, y, 10 * Math.sin(t * 0.002)]
  two.rotation = (x, y, z, t) => [x, y, 10 * Math.sin(t * 0.002)]
  three.rotation = (x, y, z, t) => [x, y, 10 * Math.sin(t * 0.002)]
<\/script>

<style>
  html, body {
    margin: 0; padding: 0;
    height: 100%; width: 100%;
    background: #333
  }
  lume-node { padding: 5px; }
  #one { background: coral; }
  #two { background: yellowgreen; }
  #three { background: royalblue; }
</style>

`
},
})
</script>
