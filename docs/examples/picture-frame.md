# Picture Frame

<div id="pictureFrameExample"></div>

<script>
  new Vue({
    el: '#pictureFrameExample', data: { code: pictureFrameExample },
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
  })
</script>
