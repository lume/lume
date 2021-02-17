# Reactivity

<div id="example"></div>
<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`
<script src="${location.origin+location.pathname}/global.js"><\/script>

<body>

  <script>
    LUME.useDefaultNames()

    const {variable, html, Motor} = LUME

    const count = variable(0)
    const incrementCount = () => count(count() + 1)

    let targetRotationY = 0
    const rotationY = variable(-80)
    Motor.addRenderTask(t => {
      rotationY.set(
        rotationY() + (targetRotationY - rotationY.get()) / 20
      )
    })

    const buttonClicked = () => {
      incrementCount()
      targetRotationY += 20
    }

    const rotation = () => [0, rotationY(), 0]

    const scene = html\`
      <lume-scene>
        <lume-node
          id="node"
          rotation=\${rotation}
          size="100 100"
          align="0.5 0.5 0.5"
          mount-point="0.5 0.5 0.5"
        >
          <h1 align="center">\${count}</h1>
        </lume-node>

        <lume-node
          id="node"
          align="0.5 0.5"
          position="0 80"
        >
          <button
            style="transform: translateX(-50%)"
            onclick=\${buttonClicked}
          >
            Click
          </button>
        </lume-node>
      </lume-scene>
    \`

    console.log(scene instanceof HTMLElement) // true

    document.body.append(scene)
  <\/script>

  <style>
    html, body {
      margin: 0; padding: 0;
      height: 100%; width: 100%;
      background: #333;
      font-family: sans-serif;
    }
    lume-node {
      background: deeppink;
      border-radius: 5px;
    }
  </style>
</body>
`
    },
  })
</script>
