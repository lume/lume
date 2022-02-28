# Introduction

> **Create rich 2D or 3D graphical experiences more easily using HTML.**

<h3 style="display: none;">
  <a href="//lume.io">Home</a>&nbsp;&nbsp;·&nbsp;
  <a href="//lume.io/docs">Documentation</a>&nbsp;&nbsp;·&nbsp;
  <a href="//lume.io/docs/#/examples/hello3d">Examples</a>&nbsp;&nbsp;·&nbsp;
  <a href="//lume.community">Forum</a>&nbsp;&nbsp;·&nbsp;
  <a href="//discord.gg/PgeyevP">Chat</a>&nbsp;&nbsp;·&nbsp;
  <a href="//github.com/lume/lume">Source</a>
</h3>

LUME gives you general-purpose HTML Elements for defining 2D or 3D scenes
rendered with CSS3D, WebGL, or both mixed together.

LUME's allows us to combine traditional HTML elements styled with
CSS with new elements that render with WebGL, which means we can render both
traditional HTML content and 3D models together in the same 3D space, with
lighting and shadow effects on both types of content.

As an example, consider traditional CSS `box-shadow` which is flat and static:

<div id="traditional"></div>

With LUME we can give traditional HTML content **_real and dynamic_** shadow and
lighting! The following demo shows traditional `<button>` elements decorated
with LUME elements to give them WebGL-powered lighting and shadow.

<div id="dynamic"></div>

LUME is built on [Web Component
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
      code: stripIndent(`
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
        <\/style>

        <div align="center"> <p>static</p> </div>
      `)
    },
  })
  new Vue({
    el: '#dynamic',
    template: '<live-code :template="code" :autorun="true" mode="html>iframe" />',
    data: { code: buttonsWithShadowExample },
  })
</script>
