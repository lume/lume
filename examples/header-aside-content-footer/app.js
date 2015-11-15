var SceneWorker = new Worker('../../src/workers/SceneWorker.js');
var controller,
    header,
    footer,
    aside,
    mainContent;
var navOpen = true;
var nodes = [{
    position: 'absolute',
    origin : [0.0,0.0,0.0],
    align : [0.0,0.0,0.0],
    size : [1.0,0.1,0],
    scale : [1.0,1.0,1.0],
    rotate: [0,0,0],
    id: 'app-header',
    opacity : 1.0
},
{
    position: 'absolute',
    origin : [0.0,0.0,0.0],
    align : [0.0,0.1,0.0],
    translate: [0,0,1],
    size : [0.3336,0.8,0],
    scale : [1.0,1.0,1.0],
    rotate: [0,0,0],
    id: 'app-sidebar',
    opacity : 1.0
},
{
    position: 'absolute',
    origin : [0.0,0.0,0.0],
    align : [0.3336,0.1,0.0],
    translate: [0,0,1],
    size : [0.6667,0.8,0],
    scale : [1.0,1.0,1.0],
    rotate: [0,0,0],
    id: 'app-content',
    opacity : 1.0
},
{
    position: 'absolute',
    origin : [0.0,1.0,0.0],
    align : [0.0,0.9,0.0],
    size : [1.0,0.1,0],
    scale : [1.0,1.0,1.0],
    rotate: [0,0,0],
    id: 'app-footer',
    opacity : 1.0
}];

controller = new ViewController(nodes, SceneWorker);

header = controller.getComponent({id:'app-header'});
aside = controller.getComponent({id:'app-sidebar'});
mainContent = controller.getComponent({id:'app-content'});
footer = controller.getComponent({id:'app-footer'});

header.setContent('<h1>Boxer Engine App Layout Example</h1>');
aside.elem.innerHTML = '<h5 class="pad-2">Add content using Element.innerHTML or DOMComponent.setContent(). Click aside to animate view.</h5>';
mainContent.setContent('<ul class="pad-2"><li>Header</li><li>Aside</li><li>Main Content</li><li>Footer</li></ul>');
footer.setContent('<a href="https://github.com/infamous/boxer">Prototype CSS 3D Matrix Rendering Engine on Github</a>');

aside.elem.addEventListener('click',function(){

  controller.transition('app-sidebar',{
      key: 'translate',
      from: [0,0,1],
      to: [0.3336*window.innerWidth*-1,0,1],
      curve: 'linear',
      duration:500,
      delay: 0
  });
  controller.transition('app-content',{
      key: 'align',
      from: [0.3336,0.1,0.0],
      to: [0.0,0.1,0.0],
      curve: 'linear',
      duration:500,
      delay: 0
  });
  controller.transition('app-content',{
      key: 'size',
      from: [0.6667,0.8,0],
      to: [1.0,0.8,0],
      curve: 'linear',
      duration:500,
      delay: 0
  });

  navOpen = false;

});

mainContent.elem.addEventListener('click',function(ev){

  if(navOpen === false) {

  controller.transition('app-sidebar',{
      key: 'translate',
      from: [0.3336*window.innerWidth*-1,0,1],
      to: [0,0,1],
      curve: 'linear',
      duration:500,
      delay: 0
  });
  controller.transition('app-content',{
      key: 'align',
      from: [0.0,0.1,0.0],
      to: [0.3336,0.1,0.0],
      curve: 'linear',
      duration:500,
      delay: 0
  });
  controller.transition('app-content',{
      key: 'size',
      from: [1.0,0.8,0],
      to: [0.6667,0.8,0],
      curve: 'linear',
      duration:500,
      delay: 0
  });

  navOpen = true;

  }
});
