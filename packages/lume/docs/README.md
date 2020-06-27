# Introduction

<!-- #### **LUME is a toolkit that simplifies the creation of rich and interactive 2D or 3D experiences for any device from mobile to desktop to AR/VR.** -->

> **LUME is a toolkit that simplifies the creation of rich and interactive 2D or 3D experiences for any device from mobile to desktop to AR/VR.**

<h3 style="display: none;">
  <a href="//lume.io">Home</a>&nbsp;&nbsp;·&nbsp;
  <a href="//lume.io/docs">Documentation</a>&nbsp;&nbsp;·&nbsp;
  <a href="//lume.io/docs/#/examples/hello3d">Examples</a>&nbsp;&nbsp;·&nbsp;
  <a href="//lume.community">Forum</a>&nbsp;&nbsp;·&nbsp;
  <a href="//discord.gg/PgeyevP">Chat</a>&nbsp;&nbsp;·&nbsp;
  <a href="//github.com/lume/lume">Source</a>
</h3>

Lume gives you general-purpose HTML Elements for defining 2D or 3D scenes
rendered with CSS3D, WebGL, or both mixed together.

Lume's "mixed mode" let's us combine traditional HTML elements styled with
CSS with new elements that render with WebGL, which means we can render both
traditional HTML content and 3D models together in the same 3D space, with
lighting and shadow effects on both.

As an example, consider traditional CSS `box-shadow` which is flat and
boring:

<div id="boring"></div>

With Lume we can give traditional HTML content **_real_** shadow and lighting! See
for yourself!

<div id="fun"></div>

Lume is built on the [Web Component
standards](https://www.w3.org/standards/techs/components#w3c_all), making it
possible to write 3D scenes declaratively using custom HTML elements,
regardless of which view layer you prefer. This makes it possible for you write
3D scenes using popular HTML frameworks like (but not limited to)
[React](https://facebook.github.io/react), [Vue.js](https://vuejs.org),
[Meteor](http://meteor.com), [Angular](https://angular.io),
[Ember.js](https://www.emberjs.com), or even the great
[jQuery](http://jquery.com).

<script>
new Vue({
  el: '#boring',
  template: '<live-code :template="code" :autorun="true" mode="html>iframe" />',
  data: {
    code:
`
<body>
<style>
    body, html {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        font-family: sans-serif;
        background: #62b997;
    }
    div {
      width: 100px;
      height: 100px;
      box-shadow: 10px 10px 10px rgba(0,0,0,0.3);
      background: skyblue;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
</style>
<div> boring </div>
</body>
`
  },
})
new Vue({
  el: '#fun',
  template: '<live-code :template="code" :autorun="true" mode="html>iframe" />',
  data: {
    code:
`
<body>
<script src="${location.origin+location.pathname}/global.js"><\/script>
<script src="${location.origin+location.pathname}/node_modules/vue/dist/vue.js"><\/script>
<script src="${location.origin+location.pathname}/node_modules/tween.js/src/Tween.js"><\/script>
<style>
    body, html {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        font-family: sans-serif;
        touch-action: none;
    }
    i-node {
        text-align: center;
    }
    #bg {
        background: #62b997;
    }
    button {
        width: 100%;
        height: 100%;
        white-space: nowrap;
        border-radius: 0px;
        border: 1px solid #494455;
        background: #e96699;
        color: #494455;
        outline: none;
    }
    button:focus,
    button:hover {
        background: #0099d9;
        color: #0a3359;
        border-color: #0a3359;
    }
</style>
<template vue>
    <!-- Lights and shadows are powered by WebGL, but written with HTML: -->
    <i-scene
        experimental-webgl="true"
        id="scene"
        background-color="black"
        background-opacity="0"
        style="perspective: 800px"
        shadowmap-type="pcfsoft" NOTE="one of basic, pcf, pcfsoft"
    >
        <i-ambient-light color="#ffffff" intensity="0"></i-ambient-light>
        <i-dom-plane ref="plane" id="bg" size-mode="proportional proportional" size="1 1 0" color="#444">
            <i-node
                id="button-container"
                position="0 0 20"
                size="600 31 0"
                align="0.5 0.5 0"
                mount-point="0.5 0.5 0"
                >
                <i-dom-plane
                    v-for="n in [0,1,2,3,4]"
                    ref="btn"
                    :key="n"
                    size-mode="literal proportional"
                    size="100 1 0"
                    :align="\`\${n*0.25} 0 0\`"
                    :mount-point="\`\${n*0.25} 0 0\`"
                    color="#444"
                    >
                    <button>button {{n+1}}</button>
                </i-dom-plane>
            </i-node>
            <i-point-light
                id="light"
                color="white"
                position="300 300 300"
                size="0 0 0"
                cast-shadow="true"
                intensity="0.8"
                >
                <i-mesh
                    has="sphere-geometry basic-material"
                    size="10 10 10"
                    color="white"
                    receive-shadow="false"
                    cast-shadow="false"
                    style="pointer-events: none"
                    >
                </i-mesh>
            </i-point-light>
        </i-dom-plane>
    </i-scene>
</template>
<div id="funRoot"></div>
<script>
    LUME.useDefaultNames()

    new Vue({
        el: '#funRoot',
        template: document.querySelector('[vue]').innerHTML,
        mounted: function() {
            var {Motor, Events} = LUME
            var downTween, upTween, pressedButton

            var scene = document.querySelector('#scene')

            scene.on(Events.GL_LOAD, async () => {
                // TODO fix order of events. Why is Promise.resolve() needed for it to work?
                await Promise.resolve()

                var light = document.querySelector('#light')
                light.three.shadow.radius = 2
                light.three.distance = 800
                light.three.shadow.bias = -0.001

                // The following is a temporary hack because opacity isn't
                // exposed through the HTML API yet. work-in-progress...
                // TODO this stuff should be doable via the HTML
                Array.from( document.querySelectorAll('i-dom-plane') ).forEach(function(n) {
                    n.three.material.opacity = 0.3
                })

                document.querySelector('#bg').three.material.opacity = 0.3
                document.querySelector('#bg').three.material.dithering = true

                scene.needsUpdate()

            })

            // prevent default touch actions so we can move the light with touch
            document.querySelector('html').setAttribute('touch-action', 'none')
            document.querySelector('body').setAttribute('touch-action', 'none')

            const targetPosition = {x: window.innerWidth / 2, y: window.innerHeight / 4}

            document.addEventListener('pointermove', function(e) {
                e.preventDefault()

                targetPosition.x = e.clientX
                targetPosition.y = e.clientY
            })

            var Motor = LUME.Motor

            Motor.addRenderTask(() => {
                light.position.x += (targetPosition.x - light.position.x) * 0.02
                light.position.y += (targetPosition.y - light.position.y) * 0.02
            })

            var Motor = LUME.Motor
            var downTween, upTween, pressedButton

            // On mouse down animate the button downward
            document.addEventListener('pointerdown', function(e) {
                if ( is( e.target, 'button' ) ) {

                    pressedButton = e.target

                    if (upTween) {
                        upTween.stop()
                        upTween = null
                    }

                    downTween = new TWEEN.Tween(e.target.parentNode.position)
                        .to({z: -20}, 75)
                        .start()
                        .onComplete(function () { downTween = null })

                    Motor.addRenderTask(function(time) {
                        if (!downTween) return false
                        downTween.update(time)
                    })

                }
            })

            // On mouse up animate the button upward
            document.addEventListener('pointerup', function(e) {
                if ( pressedButton ) {

                    if (downTween) {
                        downTween.stop()
                        downTween = null
                    }

                    upTween = new TWEEN.Tween(pressedButton.parentNode.position)
                        .to({z: 0}, 75)
                        .start()
                        .onComplete(function() { upTween = null })

                    Motor.addRenderTask(function(time) {
                        if (!upTween) return false
                        upTween.update(time)
                    })

                }
            })

            function is( el, selector ) {
                if ( [].includes.call(
                    document.querySelectorAll( selector ),
                    el
                ) ) return true
                return false
            }
        },
    })

<\/script>

</body>
`
  },
})
</script>
