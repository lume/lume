var Scene = boxer.core.Scene;
var controller = new ViewController([], Scene),
    list,
    listItems = [{
      path: 'examples/header-aside-content-footer/',
      title: 'Responsive App Layout'
    },
    {
      path: 'examples/carousel/',
      title: '3D Carousel'
    },
    {
      path: 'examples/carousel-matrix3d/',
      title: '3D Carousel (Matrix3D)'
    },
    {
      path: 'examples/rotate-180-nodes/',
      title: 'Rotate 180 Nodes'
    }],
    respond = new res([{
                         "state": "mobile",
                         "breakpoint": 640,
                         "cols": 4,
                         "margin": 20,
                         "gutter": 20
                     },
                     {
                         "state": "desktop",
                         "breakpoint": 3840,
                         "cols": 16,
                         "margin": 160,
                         "gutter": 40
                     }]);

controller.addComponent({
    origin : [0.0,0.0,0.0],
    align : [0.0,0.0,1],
    size : [1.0,0.1,0],
    scale : [1.0,1.0,1.0],
    rotate: [0,0,0],
    id: 'app-directory-header',
    content: '<h1>Boxer Engine Examples</h1>',
    opacity : 1.0,
    classes: ['mint-green-bg']
});

controller.addComponent({
    origin : [0.0,0.0,0.0],
    align : [0.0,0.0,1],
    size : [1.0,1.0,0],
    scale : [1.0,1.0,1.0],
    rotate: [0,0,0],
    id: 'app-directory',
    opacity : 1.0
},'ul');


for(var i=0; i<listItems.length; i++) {

  controller.addComponent({
      origin : [0.0,0.0,0.0],
      align : [0.0,0.0,1],
      size : [respond.state === 'mobile' ? 1.0 : 320,'auto',0],
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
