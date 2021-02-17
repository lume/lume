# Origin

<div id="example"></div>
<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`
<body touch-action="none">

<script src="${location.origin+location.pathname}/global.js"><\/script>

<style>
    html, body {
        width: 100%; height: 100%;
        margin: 0; padding: 0;
        background: #333;
        touch-action: none; /* prevent touch drag from scrolling */
        color: #ccc;
    }
    lume-scene { position: absolute!important; top: 0; left: 0; }
    lume-node { padding: 15px; pointer-events: all; }
</style>

<!-- Use the enable-css attribute to disable CSS rendering so that only WebGL
rendering is enabled (this saves CPU/Memory if you don't need CSS rendering).
-->
<lume-scene webgl enable-css="false">
    <lume-ambient-light intensity="0.3"></lume-ambient-light>
    <lume-point-light
      align-point="0.5 0.5 0.5"
      position="-200 -200 400"
      intensity="0.5"
      shadow-map-width="1024"
      shadow-map-height="1024"
    ></lume-point-light>
</lume-scene>

<lume-scene id="scene2">
    <lume-node size-mode="proportional literal" size="1 80">
        <label>
            X rotation <code id="xRotationVal"></code>:
            <input id="xRotation" type="range" min="0" max="360" value="0">
        </label>
        <br />
        <label>
            Y rotation <code id="yRotationVal"></code>:
            <input id="yRotation" type="range" min="0" max="360" value="0">
        </label>
        <br />
        <label>
            Z rotation <code id="zRotationVal"></code>:
            <input id="zRotation" type="range" min="0" max="360" value="0">
        </label>
    </lume-node>
</lume-scene>

<script>
    LUME.useDefaultNames()

    const {html} = LUME

    // the following values of origin allow the boxes to rotate around one of
    // their corners.
    const origins = [
        '0 0 0', // left/top/back
        '1 0 0', // right/top/back
        '0 1 0', // left/bottom/back
        '0 0 1', // left/top/front
        '1 1 0', // right/bottom/back
        '1 0 1', // right/top/front
        '0 1 1', // left/bottom/front
        '1 1 1', // right/bottom/front
    ]

    const makeBox = (origin, i) => html\`
        ${/* Lays the boxes out in a two-row grid, four boxes per row. */''}
        <lume-box origin=\${origin}
            align-point=\${[0.20 + i%4 * 0.20, i < 4 ? 0.4 : 0.6, 0]}
            size="100 100 100"
            mount-point="0.5 0.5 0.5"
            color="skyblue"
            opacity="0.5"
        >
            <lume-sphere align-point=\${origin} size="10 10 10" mount-point="0.5 0.5 0.5" color="deeppink"></lume-sphere>
        </lume-box>
    \`

    const scene = document.querySelector('lume-scene')
    const boxes = []

    let i = 0

    for (const origin of origins) {
        const box = makeBox(origin, i)
        boxes.push(box)
        scene.append(box)
        i += 1
    }


    const updateValues = () => {
        xRotationVal.innerHTML = '('+xRotation.value.padStart(3).replace(' ', '&nbsp;')+' deg)'
        yRotationVal.innerHTML = '('+yRotation.value.padStart(3).replace(' ', '&nbsp;')+' deg)'
        zRotationVal.innerHTML = '('+zRotation.value.padStart(3).replace(' ', '&nbsp;')+' deg)'
    }

    updateValues()

    const onChangeXRotation = () => {
        for (const box of boxes)
            box.rotation = [ xRotation.value, yRotation.value, zRotation.value ]

        updateValues()
    }

    xRotation.addEventListener('change', onChangeXRotation)
    xRotation.addEventListener('input', onChangeXRotation)
    yRotation.addEventListener('change', onChangeXRotation)
    yRotation.addEventListener('input', onChangeXRotation)
    zRotation.addEventListener('change', onChangeXRotation)
    zRotation.addEventListener('input', onChangeXRotation)
<\/script>
</body>
`
    },
  })
</script>
