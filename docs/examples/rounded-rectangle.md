# rounded-rectangle

<div id="example"></div>
<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`
<script src="${location.origin+location.pathname}global.js"><\/script>
<!-- pep.js provides the pointer events (pointermove, pointerdown, etc) -->
<script src="https://code.jquery.com/pep/0.4.3/pep.js"><\/script>

<style>
    body, html {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background: #191919;
        color: #ccc;
    }
</style>

<lume-scene id="scene" webgl>
    <lume-ambient-light intensity="0.3"></lume-ambient-light>
    <lume-point-light
        id="light"
        color="white"
        position="300 300 300"
        size="0 0 0"
        cast-shadow="true"
        intensity="0.8"
        shadow-radius="2"
        distance="800"
        shadow-bias="-0.001"
        >
    </lume-point-light>
    <lume-rounded-rectangle
        id="rect1"
        corner-radius="45"
        thickness="1"
        quadratic-corners="true"
        align-point="0.5 0.5"
        mount-point="0.5 0.5"
        size="100 100 100"
        position="55"
        color="skyblue"
        Xsidedness="double"
        Xwireframe
    >
    </lume-rounded-rectangle>
    <lume-rounded-rectangle
        id="rect2"
        corner-radius="45"
        thickness="1"
        quadratic-corners="false"
        align-point="0.5 0.5"
        mount-point="0.5 0.5"
        size="100 100 100"
        position="-55"
        color="pink"
    >
    </lume-rounded-rectangle>

</lume-scene>

<script>
    // defines the default names for the HTML elements
    LUME.defineElements()

    const light = document.querySelector('#light')

    document.addEventListener('pointermove', event => {
        event.preventDefault()
        light.position.x = event.clientX
        light.position.y = event.clientY
    })

    rect1.rotation = (x, y) => [0, ++y, 0]
    rect2.rotation = (x, y) => [0, ++y, 0]
<\/script>

`
    },
  })
</script>
