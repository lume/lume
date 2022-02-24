# Positioning

> :construction: :hammer: Under construction! :hammer: :construction:

## Origin

The `origin` attribute on LUME elements controls the point about which rotation happens.

In the next example, there are eight cubes, and each cube has its origin set to
one of its corners. We placed a dot on the corner where the origin is specified
to be. When the cubes rotate, we'll see that the cubes rotate around the
specified point.

<div id="originExample"></div>

## Mount Point

## Align Point

<script type="application/javascript">
  new Vue({
    el: '#originExample',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: { code: originExample },
  })
</script>
