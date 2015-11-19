var SceneWorker = new Worker('../../src/workers/SceneWorker.js');
var controller = new ViewController([], SceneWorker);
var slides = [1,2,3,4,5,6,7,8,9];
var slideAngle = 360 / slides.length;
var slideWidth = 288;
var slideZ =  Math.round( ( this.panelSize / 2) / Math.tan( Math.PI / slides.length ) );
var currentAngle = 0;
var oldAngle;
var carousel;
var prevBtn = document.getElementsByClassName('prev')[0];
var nextBtn = document.getElementsByClassName('next')[0];

controller.addComponent({
    position: 'absolute',
    size: [1.0,1.0,0],
    id: 'app-carousel-matrix',
    opacity : 1.0
},'div',document.getElementsByClassName('app-carousel-container')[0]);

controller.addComponent({
    size: [1.0,40,0],
    align: [0.0,0.1,1],
    id: 'app-carousel-memo-top',
    content: 'Positioning and animating with JS, Web Worker, and Matrix3D Transforms!',
    classes: ['text-center','app-memo'],
    opacity : 1.0
},'div');

controller.addComponent({
    size: [1.0,40,0],
    align: [0.0,0.8,1],
    id: 'app-carousel-memo-bottom',
    content: 'Adapted from <a href="https://desandro.github.io/3dtransforms/docs/carousel.html">this tutorial about CSS Transforms.</a>',
    classes: ['text-center','app-memo'],
    opacity : 1.0
},'div');


for(var i=0; i<slides.length; i++) {

  controller.addComponent({
      rotate: [0,slideAngle*i,0],
      size: [186,116,0],
      translate: [0, i*116*-1, slideWidth],
      id: 'app-carousel-slide-'+i,
      opacity : 0.8,
      content: '<h3>'+slides[i]+'</h3>',
      classes: ['app-carousel-slide-matrix']
  },'div',document.getElementsByClassName('app-carousel-matrix')[0]);

}

carousel = controller.getComponent({id:'app-carousel-matrix'});

prevBtn.addEventListener('click',function(ev){

  oldAngle = slideAngle * currentAngle *-1;
  currentAngle++;
  controller.transition('app-carousel-matrix',{
      key: 'rotate',
      from: [0,oldAngle,0],
      to: [0,slideAngle * currentAngle * -1,0],
      curve: 'linear',
      duration:200,
      delay: 0
  });

});

nextBtn.addEventListener('click',function(ev){
  oldAngle = slideAngle * currentAngle *-1;
  currentAngle--;
  controller.transition('app-carousel-matrix',{
      key: 'rotate',
      from: [0,oldAngle,0],
      to: [0,slideAngle * currentAngle * -1,0],
      curve: 'linear',
      duration:200,
      delay: 0
  });

});
