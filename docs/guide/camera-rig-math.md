# Linear interpolation/transform

$value = \frac{(x - x_{8})}{\Delta x} * \Delta y + y_{0}$

where $x$ is between $x_{0}$ and $x_{0} + ∆𝑥$, the output value is a value that
is similar to $x$ in terms of distance from $x_{0}$ and $x_{0} + ∆𝑥$, but relative to
$y0$ and $y0 + ∆𝑦$. For example, suppose........

Sphere:

<div id="sphereScene">
	<lume-scene id="scene" webgl>
    <lume-ambient-light color="white" intensity="0.6"></lume-ambient-light>
    <lume-point-light align-point="0.5 0.5 0.5" color="skyblue" intensity="0.6" position="500 -300 500"></lume-point-light>
    <lume-point-light align-point="0.5 0.5 0.5" color="pink" intensity="0.6" position="-500 300 -500"></lume-point-light>
		<lume-sphere align-point="0.5 0.5 0.5" mount-point="0.5 0.5 0.5" size="200 200 200" color="white"></lume-sphere>
	</lume-scene>
  <!-- this dummy link tag with comma attribute causes the next style tag not to be deleted.
  TODO fix Docsify parsing bug. -->
  <link , />
  <style>
    #sphereScene {
      width: 400px; height: 300px;
      background: #efefef;
    }
  </style>
</div>
