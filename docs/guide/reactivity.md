# Reactivity

LUME has a reactivity system that makes it easy to react to changes in
variables, or to update rendering, in a concise and simple way.

The following example shows a button, that when clicked, updates a reactive
number variable, and this causes the rendering to update any time the number
value changes.

<div id="reactivityExample"></div>

<script type="application/javascript">
  new Vue({
    el: '#reactivityExample',
    template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`
<script src="${location.origin+location.pathname}global.js"><\/script>

<body>

  <script>
    LUME.defineElements()

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
        <lume-element3d
          id="node"
          rotation=\${rotation}
          size="100 100"
          align-point="0.5 0.5 0.5"
          mount-point="0.5 0.5 0.5"
        >
          <h1 align="center">\${count}</h1>
        </lume-element3d>

        <lume-element3d
          id="node"
          align-point="0.5 0.5"
          position="0 80"
        >
          <button
            style="transform: translateX(-50%)"
            onclick=\${buttonClicked}
          >
            Click
          </button>
        </lume-element3d>
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
    lume-element3d {
      background: deeppink;
      border-radius: 5px;
    }
  </style>
</body>
`
    },
  })
</script>

[variable](./includes/lume-variable.md ':include')
