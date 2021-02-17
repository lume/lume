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

As an example, consider traditional CSS `box-shadow` which is flat and static:

<div id="traditional"></div>

With Lume we can give traditional HTML content **_real and dynamic_** shadow and lighting! See
for yourself!

<div id="dynamic"></div>

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
  el: '#traditional',
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
<div align="center"> <p>static</p> </div>
</body>
`
  },
})
new Vue({
  el: '#dynamic',
  template: '<live-code :template="code" :autorun="true" mode="html>iframe" />',
  data: {
    code:
`
<body touch-action="none">
<script src="${location.origin+location.pathname}/global.js"><\/script>
<script src="${location.origin+location.pathname}/node_modules/vue/dist/vue.js"><\/script>
<!-- Tween.js is a lib for animating numbers based on "easing curves". -->
<script src="${location.origin+location.pathname}/node_modules/tween.js/src/Tween.js"><\/script>
<!-- pep.js provides the pointer events (pointermove, pointerdown, etc) -->
<script src="https://code.jquery.com/pep/0.4.3/pep.js"><\/script>
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
    lume-node {
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
        background: #eb4b89;
        color: #0a3359;
        border-color: #0a3359;
    }
</style>
<template vue>
    <!-- Lights and shadows are powered by WebGL, but written with HTML: -->
    <lume-scene
        webgl="true"
        id="scene"
        background-color="black"
        background-opacity="0"
        perspective="800"
        shadowmap-type="pcfsoft" NOTE="one of basic, pcf, pcfsoft"
    >
        <lume-ambient-light color="#ffffff" intensity="0"></lume-ambient-light>
        <lume-dom-plane ref="plane" id="bg" size-mode="proportional proportional" size="1 1 0" color="#444">
            <lume-node
                id="button-container"
                position="0 0 20"
                size="600 31 0"
                align="0.5 0.5 0"
                mount-point="0.5 0.5 0"
            >
                <lume-dom-plane
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
                </lume-dom-plane>
            </lume-node>
            <lume-node id="lightContainer" size="0 0 0" position="0 0 300">
                <lume-point-light
                    id="light"
                    color="white"
                    size="0 0 0"
                    cast-shadow="true"
                    intensity="0.8"
                >
                    <lume-mesh
                        has="sphere-geometry basic-material"
                        size="10 10 10"
                        color="white"
                        receive-shadow="false"
                        cast-shadow="false"
                        style="pointer-events: none"
                    >
                    </lume-mesh>
                </lume-point-light>
            </lume-node>
        </lume-dom-plane>
    </lume-scene>
</template>
<div id="buttonsRoot"></div>
<script>
    LUME.useDefaultNames()

    new Vue({
        el: '#buttonsRoot',
        template: document.querySelector('[vue]').innerHTML,
        mounted: function() {
            const {Motor, Events} = LUME
            const scene = document.querySelector('#scene')
            const lightContainer = document.querySelector('#lightContainer')
            const light = document.querySelector('#light')

            scene.on(Events.GL_LOAD, async () => {
                // TODO fix order of events. Promise.resolve() should not be needed here.
                await Promise.resolve()
                light.three.shadow.radius = 2
                light.three.distance = 800
                light.three.shadow.bias = -0.001

                // The following is a temporary hack because opacity isn't
                // exposed through the HTML API yet. work-in-progress...
                // TODO this stuff should be doable via the HTML
                Array.from( document.querySelectorAll('lume-dom-plane') ).forEach(function(n) {
                    n.three.material.opacity = 0.3
                })

                document.querySelector('#bg').three.material.opacity = 0.3
                document.querySelector('#bg').three.material.dithering = true

                scene.needsUpdate()
            })

            const targetPosition = {x: window.innerWidth / 2, y: window.innerHeight / 2}

            document.addEventListener('pointermove', function(e) {
                e.preventDefault()
                targetPosition.x = e.clientX
                targetPosition.y = e.clientY
            })

            Motor.addRenderTask(time => {
                lightContainer.position.x += (targetPosition.x - lightContainer.position.x) * 0.01
                lightContainer.position.y += (targetPosition.y - lightContainer.position.y) * 0.01
                light.position.x = 100 * Math.sin(time * 0.001)
                light.position.y = 100 * Math.cos(time * 0.001)
            })

            let downTween, upTween, pressedButton

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
