# Shadow DOM

<div id="example"></div>
<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`
<script src="${location.origin+location.pathname}global.js"><\/script>

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
  lume-element3d {
    background: deeppink;
    font-family: sans serif;
    border-radius: 5px;
  }
</style>

<script>
  LUME.defineElements()
<\/script>

<!--
<div id="div1" class="hasShadow">
  <lume-element3d
    class="rotate"
    size="100 100"
    rotation="0 -70 0"
    align-point="0.5 0.5 0.5"
    mount-point="0.5 0.5 0.5"
  >
    <h3 align="center">Hello 3D world!</h3>
  </lume-element3d>
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
  <lume-point-light intensity="0.7" align-point="0.5 0.5" position="300 0 300"></lume-point-light>
  <lume-box
    class="rotate"
    size="100 100 100"
    color="cornflowerblue"
    rotation="0 -70 0"
    align-point="0.5 0.5 0.5"
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
  <lume-element3d
    class="rotate"
    size="100 100"
    rotation="0 -70 0"
    align-point="0.5 0.5 0.5"
    mount-point="0.5 0.5 0.5"
  >
    <h3 align="center">Hello 3D world!</h3>
  </lume-element3d>
</div>

<script type=module>
  const root = div3.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene>
      <lume-element3d align-point="0.25 0.25">
        <slot></slot>
      </lume-element3d>
    </lume-scene>
  \`
<\/script>

<div id="div4" class="hasShadow">
  <lume-ambient-light intensity="0.7"></lume-ambient-light>
  <lume-point-light intensity="0.7" align-point="0.5 0.5" position="300 0 300"></lume-point-light>
  <lume-box
    class="rotate"
    size="100 100 100"
    color="cornflowerblue"
    rotation="0 -70 0"
    align-point="0.5 0.5 0.5"
    mount-point="0.5 0.5 0.5"
  >
    <h3 align="center">Hello 3D world!</h3>
  </lume-box>
</div>

<script type=module>
  const root = div4.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene webgl enable-css="false">
      <lume-element3d align-point="0.75 0.25">
        <slot></slot>
      </lume-element3d>
    </lume-scene>
  \`
<\/script>

<div id="div5" class="hasShadow">
  <lume-element3d>
    <lume-element3d
      class="rotate"
      size="100 100"
      rotation="0 -70 0"
      align-point="0.5 0.5 0.5"
      mount-point="0.5 0.5 0.5"
    >
      <h3 align="center">Hello 3D world!</h3>
    </lume-element3d>
  </lume-element3d>
</div>

<div id="div6" class="hasShadow">
  <lume-element3d
      id="node1"
      align-point="1 1"
      size="100 100"
      style="background: skyblue;"
  >
    <lume-element3d
      id="node2"
      class="rotate"
      size="100 100"
      rotation="0 -70 0"
      align-point="1 1"
      mount-point="0 0 0.5"
    >
      <h3 align="center">Hello 3D world!</h3>
    </lume-element3d>
  </lume-element3d>
</div>

<script type=module>
  const root = div6.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene id="scene1">
      <lume-element3d id="node3 "size="10 10" align-point="0.25 0.25" style="background: pink;">
        <slot></slot>
      </lume-element3d>
    </lume-scene>
  \`
<\/script>

<div id="div7" class="hasShadow">
  <lume-ambient-light intensity="0.7"></lume-ambient-light>
  <lume-point-light intensity="0.7" align-point="0.5 0.5" position="300 0 300"></lume-point-light>
  <lume-element3d
      id="node1"
      align-point="1 1"
      size="100 100"
      style="background: skyblue;"
  >
    <lume-box
      id="node2"
      class="rotate"
      size="100 100 100"
      rotation="0 -70 0"
      align-point="1 1"
      mount-point="0 0 0.5"
      color="cornflowerblue"
    >
      <h3 align="center">Hello 3D world!</h3>
    </lume-box>
  </lume-element3d>
</div>

<script type=module>
  const root = div7.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene id="scene1" webgl>
      <lume-element3d id="node3 "size="10 10" align-point="0.25 0.25" style="background: pink;">
        <slot></slot>
      </lume-element3d>
    </lume-scene>
  \`
<\/script>

<div id="div8" class="hasShadow">
  <lume-element3d
      id="node1"
      align-point="1 1"
      size="100 100"
      style="background: skyblue;"
  >
    <lume-box
      id="node2"
      class="rotate"
      size="100 100 100"
      rotation="0 -70 0"
      align-point="1 1"
      mount-point="0 0 0.5"
      color="cornflowerblue"
    >
      <h3 align="center">Hello 3D world!</h3>
    </lume-box>
  </lume-element3d>
</div>

<script type=module>
  const root = div8.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene id="scene1" webgl>
      <lume-element3d id="node3 "size="10 10" align-point="0.25 0.25" style="background: pink;">
        <lume-ambient-light intensity="0.7"></lume-ambient-light>
        <lume-point-light intensity="0.7" align-point="0.5 0.5" position="300 0 300"></lume-point-light>
        <slot></slot>
      </lume-element3d>
    </lume-scene>
  \`
<\/script>

<div id="div9" class="hasShadow">
  <lume-ambient-light intensity="0.7"></lume-ambient-light>
  <lume-point-light intensity="0.7" align-point="0.5 0.5" position="300 0 300"></lume-point-light>
  <lume-element3d
      id="node1"
      align-point="1 1"
      size="100 100"
      style="background: skyblue;"
  >
    <lume-box
      id="node2"
      class="rotate"
      size="100 100 100"
      rotation="0 -70 0"
      align-point="1 1"
      mount-point="0 0 0.5"
      color="cornflowerblue"
    >
      <h3 align="center">Hello 3D world!</h3>
    </lume-box>
  </lume-element3d>
</div>

<script type=module>
  const root = div9.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene id="scene1" webgl>
      <lume-element3d id="node3 "size="10 10" align-point="0.25 0.25" style="background: pink;">
        <slot></slot>
      </lume-element3d>
    </lume-scene>
  \`
  const root2 = node1.attachShadow({mode: 'open'})
  root2.innerHTML = '<slot></slot>'
<\/script>
-->

<div id="div9" class="hasShadow">
  <lume-ambient-light intensity="0.7"></lume-ambient-light>
  <lume-point-light intensity="0.7" align-point="0.5 0.5" position="300 0 300"></lume-point-light>
  <lume-element3d
      id="node1"
      align-point="1 1"
      size="100 100"
      style="background: skyblue;"
  >
    <lume-box
      id="node2"
      class="rotate"
      size="100 100 100"
      rotation="0 -70 0"
      align-point="1 1"
      mount-point="0 0 0.5"
      color="cornflowerblue"
    >
      <h3 align="center">Hello 3D world!</h3>
    </lume-box>
  </lume-element3d>
</div>

<script type=module>
  const root = div9.attachShadow({mode: 'open'})
  root.innerHTML = \`
    <lume-scene id="scene1" webgl>
      <lume-element3d id="node3 "size="10 10" align-point="0.25 0.25" style="background: pink;">
        <slot></slot>
      </lume-element3d>
    </lume-scene>
  \`
  const root2 = node1.attachShadow({mode: 'open'})
  root2.innerHTML = \`
    <lume-box size="60 60 60" align-point="1 1" color="teal">
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
