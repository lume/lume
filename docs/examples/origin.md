# Origin

<div id="example"></div>
<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<code-vue :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`
<script src="http://localhost:3000/infamous.js"><\/script>

<style>
    html, body {
        width: 100%; height: 100%;
        margin: 0; padding: 0;
        background: #333;
    }
</style>

<!-- use the disable-css attribute so that we have only WebGL rendering enabled -->
<i-scene experimental-webgl disable-css>
    <i-ambient-light intensity="0.3"></i-ambient-light>
    <i-point-light align="0.5 0.5 0.5" position="-200 -200 400" intensity="0.5"></i-point-light>
</i-scene>

<script>
    infamous.useDefaultNames()

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

    const box = (origin, i) => \`
        <i-box origin="\${origin}" align="\${0.15+i} 0.5 0" size="100 100 100" mount-point="0.5 0.5 0.5" color="skyblue">
            <i-sphere align="\${origin}" size="10 10 10" mount-point="0.5 0.5 0.5" color="deeppink"></i-sphere>
        </i-box>
    \`

    const scene = document.querySelector('i-scene')

    let i = 0

    for (const origin of origins) {
        scene.insertAdjacentHTML('beforeend', box(origin, i))
        scene.lastElementChild.rotation = ( x, y, z ) => [ x -= 0.8, y -= 0.8, z ]
        i += 0.1
    }
<\/script>

`
    },
  })
</script>
