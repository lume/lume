var Component = require('./Component');
var Matrix = require('./Matrix');

var DOMComponent = function(node, elem, container){

    this.node = node.id ? node.id : node;
    this._node = node;
    this.elem = elem ? document.createElement(elem) : document.createElement('div');

    var container = container ? container : document.body;

    this.elem.dataset.node = this.node;
    this.elem.classList.add(this.node);
    this.elem.classList.add('node');
    container.appendChild(this.elem);

    Object.observe(this._node, function(changes){
        this.transform(this._node);
    }.bind(this));

    var prefix = function () {

      var styles = window.getComputedStyle(document.documentElement, ''),
        transform,
        origin,
        perspective,
        pre = (Array.prototype.slice
          .call(styles)
          .join('')
          .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
        if(dom ==='Moz'){
          transform = 'transform';
          origin = 'transformOrigin';
          perspective = 'perspective';
        } else if(dom ==='WebKit'){
          transform = 'webkitTransform';
          origin = 'webkitTransformOrigin';
          perspective = 'perspective';
        } else if(dom ==='MS'){
          transform = 'msTransform';
          origin = 'msTransformOrigin';
          perspective = 'perspective';
        } else if (dom ==='O'){
          transform = 'OTransform';
          origin = 'transformOrigin';
          perspective = 'perspective';
        } else {
          transform = 'transform';
          origin = 'transformOrigin';
          perspective = 'perspective';
        }
      return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1),
        transform: transform,
        origin: origin
      };

    };

    this.vendor = prefix();

    if(node.content) {
      this.setContent(node.content);
    }

    if(node.classes) {
      for(var i=0; i<node.classes.length; i++){
        this.addClass(node.classes[i]);
      }
    }

    this.transform(node);
};

DOMComponent.prototype = Object.create(Component.prototype);
DOMComponent.prototype.constructor = Component;

DOMComponent.prototype.configure = function(n){

  n.origin = n.origin || [0.0,0.0,0.0];
  n.align = n.align || [0.0,0.0,0.0];
  n.size = n.size || [1.0,1.0,1.0];
  n.scale = n.scale || [1.0,1.0,1.0];
  n.rotate = n.rotate || [0,0,0];
  n.opacity = n.opacity || 1.0;

}

DOMComponent.prototype.isInt = function(n){

    return Number(n) === n && n % 1 === 0;

}

DOMComponent.prototype.isFloat = function(n){

    if(n === parseFloat(1.0)) return true;
    return n === Number(n) && n % 1 !== 0;

}

DOMComponent.prototype.setContent = function(content){

  this.elem.innerHTML = content;

}

DOMComponent.prototype.addClass = function(cl){

  this.elem.classList.add(cl);

}

DOMComponent.prototype.removeClass = function(cl){

  this.elem.classList.remove(cl);

}

DOMComponent.prototype.degreesToRadians = function(degrees) {

  return degrees * (Math.PI / 180);

};

DOMComponent.prototype.transform = function(node){

  var d = this;

  if(node.origin) {

    this.elem.style[this.vendor.origin] = (node.origin[0]*100)+'% '+(node.origin[1]*100)+'%';

  }


  if(node.size) {

    if(node.size[0] === 1) node.size[0] = parseFloat(1.0);
    if(node.size[1] === 1) node.size[1] = parseFloat(1.0);

    if(node.size[0] === null) {
        this.elem.style.width = node.size[1]*100+'vh';
    } else if(node.size[0] === 'auto') {
        this.elem.style.width = 'auto';
    } else {
        this.isFloat(node.size[0]) ? this.elem.style.width = node.size[0]*100+'%' : this.elem.style.width = node.size[0]+'px';
    }
    if(node.size[1] === null) {
        this.elem.style.height = node.size[0]*100+'vw';
    } else if(node.size[1] === 'auto') {
        this.elem.style.height = 'auto';
    } else {
        this.isFloat(node.size[1]) ? this.elem.style.height = node.size[1]*100+'%' : this.elem.style.height = node.size[1]+'px';
        // console.log(node.size[1]*100+'%');
        // this.elem.style.height = node.size[1]*100+'%';
    }

    //TODO: fix isFloat and isInt, its not working!

  }

  if(node.opacity) {

    this.elem.style.opacity = node.opacity;

  }

  if(node.position) {

    this.elem.style.position = node.position;

  }

  if(node.transform) {

    this.elem.style[this.vendor.transform] = node.transform;

  } else {

  var matrix = new Matrix();

  if(node.translate && node.align) {

    matrix = matrix.translate((node.align[0] * this.elem.parentNode.clientWidth)+node.translate[0], (node.align[1] * this.elem.parentNode.clientHeight)+node.translate[1], node.align[2]+ node.translate[2] === 0 ? 1 : node.translate[2] );

  } else if(node.align) {

    matrix = matrix.translate(node.align[0] * this.elem.parentNode.clientWidth, node.align[1] * this.elem.parentNode.clientHeight, node.align[2] );

  } else if(node.translate) {

    matrix = matrix.translate(node.translate[0], node.translate[1], node.translate[2] === 0 ? 1 : node.translate[2]);

  } else {

    matrix = matrix.translate(0, 0, 1);

  }

  if(node.scale) {

      matrix.scale(node.scale[0] || 1, node.scale[1] || 1, node.scale[2] || 1);

  }
  if(node.rotate) {

      if(node.rotate[0]) {
        matrix = matrix.rotateX(d.degreesToRadians(node.rotate[0]));
      }
      if(node.rotate[1]) {
        matrix = matrix.rotateY(d.degreesToRadians(node.rotate[1]));
      }
      if(node.rotate[2]) {
        matrix = matrix.rotateZ(d.degreesToRadians(node.rotate[2]));
      }

  }

  this.elem.style[this.vendor.transform] = matrix.toString();

  }

};

DOMComponent.prototype.setPerspective = function(p){

  this.elem.style['perspective'] = p;

};

DOMComponent.prototype.resize = function(){

  this.transform(this._node);

};

module.exports = DOMComponent;
