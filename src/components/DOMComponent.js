var Component = require('./Component');
var Matrix = require('xcssmatrix');

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



  // var matrix = new Matrix('translate3d('+node.translate[0]+'px,'+node.translate[1]+'px,'+node.translate[2]+'px) '+
  //                         'scale3d('+node.scale[0]+'%,'+node.scale[1]+'%,'+node.scale[2]+'%) '+
  //                         'rotateX('+node.rotate[0]+'deg) '+
  //                         'rotateY('+node.rotate[1]+'deg) '+
  //                         'rotateZ('+node.rotate[2]+'deg)');
  var matrix = new Matrix();
  if(node.translate) {
    matrix = matrix.translate(node.translate[0],node.translate[1],node.translate[2]);
  }
  if(node.scale) {
    matrix = matrix.scale(node.scale[0], node.scale[1], node.scale[2]);
  }
  if(node.rotate) {
    matrix = matrix.rotate(node.rotate[0], node.rotate[1], node.rotate[2]);
  }
  this.elem.style.webkitTransform = matrix.toString();

  if(node.opacity) {
    this.elem.style.opacity = node.opacity;
  }
  // if(node.position) {
  //   this.elem.style.position = node.position;
  // }
  if(node.size) {
    this.elem.style.width = node.size[0]+'px';
    this.elem.style.height = node.size[1]+'px';
  }
  if(node.origin) {
    this.elem.style.transformOrigin = node.origin[0]+'%,'+node.origin[1]+'%,'+node.origin[2]+'%';
  }
  //TODO: Figure out how to get browser to output css matrix3D transform



};

module.exports = DOMComponent;
