# Scene Graph

Coming soon...

<div class="graph">
  <lume-scene id="scene">
    <!-- Root Scene -->
    <lume-node size="60 30" align="0.5 0.2" mount-point="0.5 0.5">
      <div align="center">Scene</div>
    </lume-node>
    <!-- Left Child Node -->
    <lume-node size="60 30" align="0.3 0.5" mount-point="0.5 0.5">
      <div align="center">Node</div>
    </lume-node>
    <!-- Right Child Node -->
    <lume-node size="60 30" align="0.7 0.5" mount-point="0.5 0.5">
      <div align="center">Node</div>
    </lume-node>
    <!-- Line, Root Scene to Left Child Node -->
    <lume-node class="line" size="2 100" align="0.4 0.35" rotation="0 0 50" mount-point="0.5 0.5" position="0 0 -1"></lume-node>
    <!-- Line, Root Scene to Left Child Node -->
    <lume-node class="line" size="2 100" align="0.6 0.35" rotation="0 0 -50" mount-point="0.5 0.5" position="0 0 -1"></lume-node>
    <!-- Left Grandchild Node -->
    <lume-node size="60 30" align="0.2 0.8" mount-point="0.5 0.5">
      <div align="center">Node</div>
    </lume-node>
    <!-- Right Grandchild Node -->
    <lume-node size="60 30" align="0.4 0.8" mount-point="0.5 0.5">
      <div align="center">Node</div>
    </lume-node>
    <!-- Line, Left Child to Left Grandchild Node -->
    <lume-node class="line" size="2 100" align="0.25 0.65" rotation="0 0 25" mount-point="0.5 0.5" position="0 0 -1"></lume-node>
    <!-- Line, Left Child to Right Grandchild Node -->
    <lume-node class="line" size="2 100" align="0.35 0.65" rotation="0 0 -25" mount-point="0.5 0.5" position="0 0 -1"></lume-node>
  </lume-scene>
</div>

asdf jkasflk jasdflk jasdlfk jasdlfj asdlf jkaslfj kasdlfjk asdlfjk asl fjasldk fjasldkf jasldk fjasld fj
asdf jkasflk jasdflk jasdlfk jasdlfj asdlf jkaslfj kasdlfjk asdlfjk asl fjasldk fjasldkf jasldk fjasld fj
asdf jkasflk jasdflk jasdlfk jasdlfj asdlf jkaslfj kasdlfjk asdlfjk asl fjasldk fjasldkf jasldk fjasld fj
asdf jkasflk jasdflk jasdlfk jasdlfj asdlf jkaslfj kasdlfjk asdlfjk asl fjasldk fjasldkf jasldk fjasld fj
asdf jkasflk jasdflk jasdlfk jasdlfj asdlf jkaslfj kasdlfjk asdlfjk asl fjasldk fjasldkf jasldk fjasld fj
asdf jkasflk jasdflk jasdlfk jasdlfj asdlf jkaslfj kasdlfjk asdlfjk asl fjasldk fjasldkf jasldk fjasld fj
asdf jkasflk jasdflk jasdlfk jasdlfj asdlf jkaslfj kasdlfjk asdlfjk asl fjasldk fjasldkf jasldk fjasld fj
asdf jkasflk jasdflk jasdlfk jasdlfj asdlf jkaslfj kasdlfjk asdlfjk asl fjasldk fjasldkf jasldk fjasld fj
asdf jkasflk jasdflk jasdlfk jasdlfj asdlf jkaslfj kasdlfjk asdlfjk asl fjasldk fjasldkf jasldk fjasld fj
asdf jkasflk jasdflk jasdlfk jasdlfj asdlf jkaslfj kasdlfjk asdlfjk asl fjasldk fjasldkf jasldk fjasld fj
asdf jkasflk jasdflk jasdlfk jasdlfj asdlf jkaslfj kasdlfjk asdlfjk asl fjasldk fjasldkf jasldk fjasld fj
asdf jkasflk jasdflk jasdlfk jasdlfj asdlf jkaslfj kasdlfjk asdlfjk asl fjasldk fjasldkf jasldk fjasld fj
asdf jkasflk jasdflk jasdlfk jasdlfj asdlf jkaslfj kasdlfjk asdlfjk asl fjasldk fjasldkf jasldk fjasld fj
asdf jkasflk jasdflk jasdlfk jasdlfj asdlf jkaslfj kasdlfjk asdlfjk asl fjasldk fjasldkf jasldk fjasld fj

<style>
  .graph {
    float: left;
    width: 400px; height: 300px;
    border: 1px solid red;
  }
  lume-scene {
    user-select: none;
  }
  .line {
    background: black;
  }
  lume-node:not(.line) {
    background: skyblue;
    border-radius: 3px;
  }
  lume-node div {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<script>
  // FIXME temporary hack to trigger a re-render because transforms are not
  // updated on the initial paint.
  document.querySelectorAll('lume-scene *').forEach(n => {
    if (n instanceof LUME.Node) {
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
</script>
