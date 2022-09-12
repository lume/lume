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

<div id="div">
	<lume-point-light intensity="0.6"></lume-point-light>
	<lume-point-light align-point="0.5 0.5" position="300 0 300"></lume-point-light>
	<lume-box id="node" size="100 100 100" rotation="0 -70 0" align-point="0.5 0.5 0.5" mount-point="0.5 0.5 0.5" color="cornflowerblue">
		<lume-element3d align-point="0 1 1" size="100 100">
			<h3 align="center">Hello 3D world!</h3>
		</lume-element3d>
	</lume-box>
</div>

<style>
	html,
	body {
		margin: 0;
		padding: 0;
		height: 100%;
		width: 100%;
		background: #333;
    color: hsl(337, 90%, 60%);
	}

	#div {
		width: 100%;
		height: 100%;
	}
</style>

<script>
	LUME.defineElements()
	node.rotation = (x, y, z) => [x, ++y, z]
	const root = div.attachShadow({
		mode: 'open'
	})
	root.innerHTML = \`
    <lume-scene webgl>
      <slot></slot>
    </lume-scene>
  \`
	window.addEventListener('error', e => console.log(e))
<\/script>

`
    },
  })
</script>
