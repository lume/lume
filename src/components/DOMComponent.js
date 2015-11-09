var Component = require('./Component');

var DOMComponent = function(node, elem, container){
    this.node = node.id ? node.id : node;
    this.elem = elem ? elem : document.createElement('div');

    var container = container ? container : document.body;

    this.elem.dataset.node = this.node;
    this.elem.classList.add(this.node);
    this.elem.classList.add('node');
    container.appendChild(this.elem);

    this.transform(node);
};

DOMComponent.prototype = Object.create(Component.prototype);
DOMComponent.prototype.constructor = Component;



DOMComponent.prototype.transform = function(node){

  //console.log(node);
  //position => translate3d(x,y,z)
  //align
  //origin
  //rotate => rotate3d(x,y,z,angle)
  //size => width, height
  //scale => scale3d(x,y,z)
  //opacity => opacity

  this.elem.style.transform = 'translate3d('+node.position[0]+'px,'+node.position[1]+'px,'+node.position[2]+'px)';
  //' scale3d('+node.scale[0]+'%,'+node.scale[1]+'%,'+node.scale[2]+'%)';

    console.log('translate3d('+node.position[0]+'px,'+node.position[1]+'px,'+node.position[2]+'px)');
  //;

  this.elem.style.width = node.size[0];
  this.elem.style.height = node.size[1];
  this.elem.style.opacity = node.opacity;



};

module.exports = DOMComponent;
