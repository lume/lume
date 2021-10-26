# Indian Boombox

<div id="example"></div>
<script>
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" :autorun="true" mode="html>iframe" />',
    data: { code: perspectiveLayeredImage({bg: '/examples/indian-boombox/bg.jpg', fg: '/examples/indian-boombox/fg.png'}) },
  })
</script>
