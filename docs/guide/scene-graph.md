# Scene Graph

> :construction: :hammer: Under construction! :hammer: :construction:

A graphical scene is made up of a hierarchy of objects called a "scene graph",
A scene graph is a "tree" structure containing the objects that specify what
will be rendered on screen.

The HTML DOM is a scene graph that has traditionally been used for 2D graphics.
LUME brings 3D to the DOM, or shall we say, LUME brings the DOM into the
future.

The following graphic shows the idea of a hierarchical tree. The graphic itself
is made of a tree of DOM nodes (a scene graph) that specify how to render the
concept of a tree.

<style>
	html,
	body {
		width: 100%;
		height: 100%;
	}

	lume-scene {
		user-select: none;
	}

	.line {
		background: black;
	}

	lume-element3d:not(.line) {
		font-family: sans-serif;
		background: skyblue;
		border-radius: 3px;
	}

	lume-element3d div {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>

<div style="width: 400px; height: 300px;">
	<lume-scene id="scene">
		<!-- Root Scene -->
		<lume-element3d size="60 30" align-point="0.5 0.2" mount-point="0.5 0.5">
			<div align="center">
				Scene
			</div>
		</lume-element3d>
		<!-- Left Child Node -->
		<lume-element3d size="60 30" align-point="0.3 0.5" mount-point="0.5 0.5">
			<div align="center">
				Node
			</div>
		</lume-element3d>
		<!-- Right Child Node -->
		<lume-element3d size="60 30" align-point="0.7 0.5" mount-point="0.5 0.5">
			<div align="center">
				Node
			</div>
		</lume-element3d>
		<!-- Line, Root Scene to Left Child Node -->
		<lume-element3d class="line" size="2 100" align-point="0.4 0.35" rotation="0 0 50" mount-point="0.5 0.5" position="0 0 -1"></lume-element3d>
		<!-- Line, Root Scene to Left Child Node -->
		<lume-element3d class="line" size="2 100" align-point="0.6 0.35" rotation="0 0 -50" mount-point="0.5 0.5" position="0 0 -1"></lume-element3d>
		<!-- Left Grandchild Node -->
		<lume-element3d size="60 30" align-point="0.2 0.8" mount-point="0.5 0.5">
			<div align="center">
				Node
			</div>
		</lume-element3d>
		<!-- Right Grandchild Node -->
		<lume-element3d size="60 30" align-point="0.4 0.8" mount-point="0.5 0.5">
			<div align="center">
				Node
			</div>
		</lume-element3d>
		<!-- Line, Left Child to Left Grandchild Node -->
		<lume-element3d class="line" size="2 100" align-point="0.25 0.65" rotation="0 0 25" mount-point="0.5 0.5" position="0 0 -1"></lume-element3d>
		<!-- Line, Left Child to Right Grandchild Node -->
		<lume-element3d class="line" size="2 100" align-point="0.35 0.65" rotation="0 0 -25" mount-point="0.5 0.5" position="0 0 -1"></lume-element3d>
	</lume-scene>
</div>

The top-level node in a LUME scene is always a `<lume-scene>` element. The
`<lume-scene>` element creates an area in which we'll render LUME-based
graphics. Below the scene element are other types of nodes that render in
different visual ways.

This next example shows how parent nodes affect the positioning of child nodes.
The positions and rotations of the child `<lume-element3d>` elements are relative to
their parent `<lume-element3d>` elements. This is why the parent-most node only
rotates, while each child not only rotates, but also moves due to the rotation
of its parent.

<div id="parentTransforms"></div>

<script type="application/javascript">
	// LUME.defineElements()

	document.querySelectorAll('lume-scene *').forEach(n => {
		if (n instanceof LUME.Node) {
			// FIXME temporary hack to trigger a re-render because transforms are not
			// updated on the initial paint.
			n.rotation.y += 0.000000001
			n.addEventListener('pointerover', event => {
				console.log('on a node!')
				n.scale.x = 1.1
				n.scale.y = 1.1
				n.scale.z = 1.1
			})
			n.addEventListener('pointerout', event => {
				n.scale.x = 1
				n.scale.y = 1
				n.scale.z = 1
			})
		}
	})

	new Vue({
		el: '#parentTransforms',
		template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
		data: {
			code: stripIndent(`
				<script src="${location.origin+location.pathname}global.js"><\/script>

				<lume-scene>
					<lume-element3d id="one" position="50 50" size="10 10" rotation="0 0 10">
						<lume-element3d id="two" position="50 50" size="10 10" rotation="0 0 10">
							<lume-element3d id="three" position="50 50" size="10 10" rotation="0 0 10">
								<lume-element3d id="four" position="50 50" size="100 100" rotation="0 0 10">
									Positioning is relative to parents!
								</lume-element3d>
							</lume-element3d>
						</lume-element3d>
					</lume-element3d>
				</lume-scene>

				<style>
					html, body {
						margin: 0; padding: 0;
						height: 100%; width: 100%;
						background: #333; color: white;
					}
					lume-element3d { padding: 5px; }
					#one { background: coral; }
					#two { background: yellowgreen; }
					#three { background: deeppink; }
					#four { background: royalblue; }
				</style>

    			<script>
    				LUME.defineElements()
    				const rotationFunction = (x, y, z, t) => [x, y, 10 * Math.sin(t * 0.002)]

    				// Give all nodes the same rotation. Note that each node rotates "inside" of the parent space.
    				one.rotation = rotationFunction
    				two.rotation = rotationFunction
    				three.rotation = rotationFunction
    				three.rotation = rotationFunction
    			<\/script>
    		`).trim()
    	},
    })

</script>
