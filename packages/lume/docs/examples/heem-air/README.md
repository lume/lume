# Heem Air

<div id="example"></div>
<script>
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" :autorun="true" mode="html>iframe" />',
    data: { code: perspectiveLayeredImage({
      bg: '/examples/heem-air/bg.jpg',
      fg: '/examples/heem-air/fg.png',
      bgPosition: {x: 0, y: 36},
    }) },
  })
</script>
