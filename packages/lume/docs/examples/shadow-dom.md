# Shadow DOM

<div id="example"></div>
<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`
<script src="${location.origin+location.pathname}/global.js"><\/script>

<style>
  html, body {
    margin: 0; padding: 0;
    height: 100%; width: 100%;
    background: #333;
  }
  div {
    width: 100%;
    height: 100%;
  }
  lume-node {
    background: deeppink;
    font-family: sans serif;
    border-radius: 5px;
  }
</style>

<script>
  LUME.useDefaultNames()
<\/script>

<!--
<div id="div1" class="hasShadow">
  <lume-node
    class="rotate"
    size="100 100"
    rotation="0 -70 0"
    align="0.5 0.5 0.5"
    mount-point="0.5 0.5 0.5"
  >
    <h3 align="center">Hello 3D world!</h3>
  </lume-node>
</div>

<script type=module>
  const root = div1.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene>
      <slot></slot>
    </lume-scene>
  \`
<\/script>

<div id="div2" class="hasShadow">
  <lume-ambient-light intensity="0.7"></lume-ambient-light>
  <lume-point-light intensity="0.7" align="0.5 0.5" position="300 0 300"></lume-point-light>
  <lume-box
    class="rotate"
    size="100 100 100"
    color="cornflowerblue"
    rotation="0 -70 0"
    align="0.5 0.5 0.5"
    mount-point="0.5 0.5 0.5"
  >
    <h3 align="center">Hello 3D world!</h3>
  </lume-box>
</div>

<script type=module>
  const root = div2.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene webgl enable-css="false">
      <slot></slot>
    </lume-scene>
  \`
<\/script>

<div id="div3" class="hasShadow">
  <lume-node
    class="rotate"
    size="100 100"
    rotation="0 -70 0"
    align="0.5 0.5 0.5"
    mount-point="0.5 0.5 0.5"
  >
    <h3 align="center">Hello 3D world!</h3>
  </lume-node>
</div>

<script type=module>
  const root = div3.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene>
      <lume-node align="0.25 0.25">
        <slot></slot>
      </lume-node>
    </lume-scene>
  \`
<\/script>

<div id="div4" class="hasShadow">
  <lume-ambient-light intensity="0.7"></lume-ambient-light>
  <lume-point-light intensity="0.7" align="0.5 0.5" position="300 0 300"></lume-point-light>
  <lume-box
    class="rotate"
    size="100 100 100"
    color="cornflowerblue"
    rotation="0 -70 0"
    align="0.5 0.5 0.5"
    mount-point="0.5 0.5 0.5"
  >
    <h3 align="center">Hello 3D world!</h3>
  </lume-box>
</div>

<script type=module>
  const root = div4.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene webgl enable-css="false">
      <lume-node align="0.75 0.25">
        <slot></slot>
      </lume-node>
    </lume-scene>
  \`
<\/script>

<div id="div5" class="hasShadow">
  <lume-node>
    <lume-node
      class="rotate"
      size="100 100"
      rotation="0 -70 0"
      align="0.5 0.5 0.5"
      mount-point="0.5 0.5 0.5"
    >
      <h3 align="center">Hello 3D world!</h3>
    </lume-node>
  </lume-node>
</div>

<div id="div6" class="hasShadow">
  <lume-node
      id="node1"
      align="1 1"
      size="100 100"
      style="background: skyblue;"
  >
    <lume-node
      id="node2"
      class="rotate"
      size="100 100"
      rotation="0 -70 0"
      align="1 1"
      mount-point="0 0 0.5"
    >
      <h3 align="center">Hello 3D world!</h3>
    </lume-node>
  </lume-node>
</div>

<script type=module>
  const root = div6.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene id="scene1">
      <lume-node id="node3 "size="10 10" align="0.25 0.25" style="background: pink;">
        <slot></slot>
      </lume-node>
    </lume-scene>
  \`
<\/script>

<div id="div7" class="hasShadow">
  <lume-ambient-light intensity="0.7"></lume-ambient-light>
  <lume-point-light intensity="0.7" align="0.5 0.5" position="300 0 300"></lume-point-light>
  <lume-node
      id="node1"
      align="1 1"
      size="100 100"
      style="background: skyblue;"
  >
    <lume-box
      id="node2"
      class="rotate"
      size="100 100 100"
      rotation="0 -70 0"
      align="1 1"
      mount-point="0 0 0.5"
      color="cornflowerblue"
    >
      <h3 align="center">Hello 3D world!</h3>
    </lume-box>
  </lume-node>
</div>

<script type=module>
  const root = div7.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene id="scene1" webgl>
      <lume-node id="node3 "size="10 10" align="0.25 0.25" style="background: pink;">
        <slot></slot>
      </lume-node>
    </lume-scene>
  \`
<\/script>

<div id="div8" class="hasShadow">
  <lume-node
      id="node1"
      align="1 1"
      size="100 100"
      style="background: skyblue;"
  >
    <lume-box
      id="node2"
      class="rotate"
      size="100 100 100"
      rotation="0 -70 0"
      align="1 1"
      mount-point="0 0 0.5"
      color="cornflowerblue"
    >
      <h3 align="center">Hello 3D world!</h3>
    </lume-box>
  </lume-node>
</div>

<script type=module>
  const root = div8.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene id="scene1" webgl>
      <lume-node id="node3 "size="10 10" align="0.25 0.25" style="background: pink;">
        <lume-ambient-light intensity="0.7"></lume-ambient-light>
        <lume-point-light intensity="0.7" align="0.5 0.5" position="300 0 300"></lume-point-light>
        <slot></slot>
      </lume-node>
    </lume-scene>
  \`
<\/script>

<div id="div9" class="hasShadow">
  <lume-ambient-light intensity="0.7"></lume-ambient-light>
  <lume-point-light intensity="0.7" align="0.5 0.5" position="300 0 300"></lume-point-light>
  <lume-node
      id="node1"
      align="1 1"
      size="100 100"
      style="background: skyblue;"
  >
    <lume-box
      id="node2"
      class="rotate"
      size="100 100 100"
      rotation="0 -70 0"
      align="1 1"
      mount-point="0 0 0.5"
      color="cornflowerblue"
    >
      <h3 align="center">Hello 3D world!</h3>
    </lume-box>
  </lume-node>
</div>

<script type=module>
  const root = div9.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene id="scene1" webgl>
      <lume-node id="node3 "size="10 10" align="0.25 0.25" style="background: pink;">
        <slot></slot>
      </lume-node>
    </lume-scene>
  \`
  const root2 = node1.attachShadow({mode: 'open'})
  root2.innerHTML = '<slot></slot>'
<\/script>
-->

<div id="div9" class="hasShadow">
  <lume-ambient-light intensity="0.7"></lume-ambient-light>
  <lume-point-light intensity="0.7" align="0.5 0.5" position="300 0 300"></lume-point-light>
  <lume-node
      id="node1"
      align="1 1"
      size="100 100"
      style="background: skyblue;"
  >
    <lume-box
      id="node2"
      class="rotate"
      size="100 100 100"
      rotation="0 -70 0"
      align="1 1"
      mount-point="0 0 0.5"
      color="cornflowerblue"
    >
      <h3 align="center">Hello 3D world!</h3>
    </lume-box>
  </lume-node>
</div>

<script type=module>
  const root = div9.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene id="scene1" webgl>
      <lume-node id="node3 "size="10 10" align="0.25 0.25" style="background: pink;">
        <slot></slot>
      </lume-node>
    </lume-scene>
  \`
  const root2 = node1.attachShadow({mode: 'open'})
  root2.innerHTML = \`
    <lume-box size="60 60 60" align="1 1" color="teal">
      <slot></slot>
    </lume-box>
  \`
<\/script>

<script>
  for (const el of Array.from(document.querySelectorAll('.rotate'))) {
    el.rotation = (x, y, z) => [x, ++y, z]
  }
<\/script>

`
    },
  })
</script>
