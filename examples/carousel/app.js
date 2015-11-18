var SceneWorker = new Worker('../../src/workers/SceneWorker.js');
var controller = new ViewController([], SceneWorker);
var slides = [1,2,3,4,5,6,7,8,9];
var slideAngle = 360 / slides.length;
var slideWidth = 288;
var slideZ = Math.round( ( slideWidth / 2 ) / Math.tan( (Math.PI / slides.length - 1) ) );
var currentAngle = 0;
var carousel;

controller.addComponent({
    position: 'absolute',
    size: [1.0,1.0,0],
    transform: 'rotateY( 0deg ) translateZ( -'+slideWidth+'px )',
    id: 'app-carousel',
    opacity : 1.0
},'div',document.getElementsByClassName('app-carousel-container')[0]);


for(var i=0; i<slides.length; i++) {

  controller.addComponent({
      position: 'absolute',
      size: [186,140,0],
      transform: 'rotateY( '+slideAngle*i+'deg ) translateZ( '+slideWidth+'px )',
      id: 'app-carousel-slide-'+i,
      opacity : 0.9,
      content: '<h3>'+slides[i]+'</h3>',
      classes: ['app-carousel-slide']
  },'div',document.getElementsByClassName('app-carousel')[0]);

}

carousel = controller.getComponent({id:'app-carousel'});

document.getElementsByClassName('prev')[0].addEventListener('click',function(ev){
  console.log(ev);
  currentAngle--;
  carousel.transform({
                 transform:'rotateY( '+slideAngle*currentAngle*-1+'deg ) translateZ( -'+slideWidth+'px)'
                });
});

document.getElementsByClassName('next')[0].addEventListener('click',function(ev){
  console.log(ev);
  currentAngle++;
  carousel.transform({
                 transform:'rotateY( '+slideAngle*currentAngle*-1+'deg ) translateZ( -'+slideWidth+'px)'
                });
});
