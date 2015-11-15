var SceneWorker = new Worker('../../src/workers/SceneWorker.js');
var controller,
    header,
    footer,
    aside,
    mainContent;
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
header.addClass('pad-1');
aside.elem.innerHTML = '<h5>Add content using Element.innerHTML or DOMComponent.setContent()</h5>';
aside.addClass('pad-2');
mainContent.setContent('<ul><li>Header</li><li>Aside</li><li>Main Content</li><li>Footer</li></ul>');
mainContent.addClass('pad-2');
footer.setContent('<a href="https://github.com/infamous/boxer">Prototype CSS 3D Matrix Rendering Engine on Github</a>');
footer.addClass('pad-2');
