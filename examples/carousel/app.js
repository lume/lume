var Scene = boxer.core.Scene;
var controller = new ViewController([], Scene);
var slides = [1,2,3,4,5,6,7,8,9];
var slideAngle = 360 / slides.length;
var slideWidth = 288;
var slideZ =  Math.round( ( this.panelSize / 2) / Math.tan( Math.PI / slides.length ) );
var currentAngle = 0;
var carousel;
var prevBtn = document.getElementsByClassName('prev')[0];
var nextBtn = document.getElementsByClassName('next')[0];

controller.addComponent({
    position: 'absolute',
    size: [1.0,1.0,0],
    transform: 'rotateY( 0deg )',
    id: 'app-carousel',
    opacity : 1.0
},'div',document.getElementsByClassName('app-carousel-container')[0]);

controller.addComponent({
    size: [1.0,40,0],
    align: [0.0,0.1,1],
    id: 'app-carousel-memo-top',
    content: 'Keep styling in .css and make transforms dynamic with JS!',
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
      transform: 'rotateY( '+slideAngle*i+'deg ) translateZ( '+slideWidth+'px )',
      id: 'app-carousel-slide-'+i,
      opacity : 0.8,
      content: '<h3>'+slides[i]+'</h3>',
      classes: ['app-carousel-slide']
  },'div',document.getElementsByClassName('app-carousel')[0]);

}

carousel = controller.getComponent({id:'app-carousel'});

prevBtn.addEventListener('click',function(ev){
  currentAngle++;
  carousel.transform({
                 transform:'rotateY( '+slideAngle*currentAngle*-1+'deg )'
                });
});

nextBtn.addEventListener('click',function(ev){
  currentAngle--;
  carousel.transform({
                 transform:'rotateY( '+slideAngle*currentAngle*-1+'deg )'
                });
});
