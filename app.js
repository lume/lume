var SceneWorker = new Worker('src/workers/SceneWorker.js');
var controller = new ViewController([], SceneWorker),
    list,
    listItems = [{
      path: 'examples/header-aside-content-footer/',
      title: 'Simple App Layout'
    },
    {
      path: 'examples/rotate-180-nodes/',
      title: 'Rotate 180 Nodes'
    }];

controller.addComponent({
    position: 'absolute',
    origin : [0.0,0.0,0.0],
    align : [0.0,0.0,0.0],
    size : [1.0,0.1,0],
    scale : [1.0,1.0,1.0],
    rotate: [0,0,0],
    id: 'app-directory-header',
    content: '<h1>Boxer Engine Examples</h1>',
    opacity : 1.0
});

controller.addComponent({
    position: 'absolute',
    origin : [0.0,0.0,0.0],
    align : [0.0,0.1,0.0],
    size : [1.0,1.0,0],
    scale : [1.0,1.0,1.0],
    rotate: [0,0,0],
    id: 'app-directory',
    opacity : 1.0
},'ul');


for(var i=0; i<listItems.length; i++) {

  controller.addComponent({
      position: 'relative',
      origin : [0.0,0.0,0.0],
      align : [0.0,0.0,0.0],
      size : [320,'auto',0],
      scale : [1.0,1.0,1.0],
      rotate: [0,0,0],
      id: 'app-directory-list-item-'+i,
      opacity : 1.0,
      content: '<a href="'+listItems[i].path+'">'+listItems[i].title+'</a>',
      classes: ['app-directory-list-item','pad-1'],
      transition:{
          key: 'rotate',
          from: [0, 0, -90],
          to: [0, 0, 0],
          curve: 'outElastic',
          duration: 2400
      }
  },'li',document.getElementsByClassName('app-directory')[0]);


}
