var Component = require('./Component');
var Matrix = require('xcssmatrix');

var DOMComponent = function(node, elem, container){
    this.node = node.id ? node.id : node;
    this._node = node;
    this.elem = elem ? elem : document.createElement('div');

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
        pre = (Array.prototype.slice
          .call(styles)
          .join('')
          .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
        if(dom ==='Moz'){
          transform = 'transform';
        } else if(dom ==='WebKit'){
          transform = 'webkitTransform';
        } else if(dom ==='MS'){
          transform = 'msTransform';
        } else if (dom ==='O'){
          transform = 'OTransform';
        } else {
          transform = 'transform';
        }
      return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1),
        transform: transform
      };
    };
    //
    this.vendor = prefix();

    this.transform(node);
};

DOMComponent.prototype = Object.create(Component.prototype);
DOMComponent.prototype.constructor = Component;

DOMComponent.prototype.isInt = function(n){
    return Number(n) === n && n % 1 === 0;
}

DOMComponent.prototype.isFloat = function(n){
    if(n === parseFloat(1.0)) return true;
    return n === Number(n) && n % 1 !== 0;
}

DOMComponent.prototype.transform = function(node){



  // var matrix = new Matrix('translate3d('+node.translate[0]+'px,'+node.translate[1]+'px,'+node.translate[2]+'px) '+
  //                         'scale3d('+node.scale[0]+'%,'+node.scale[1]+'%,'+node.scale[2]+'%) '+
  //                         'rotateX('+node.rotate[0]+'deg) '+
  //                         'rotateY('+node.rotate[1]+'deg) '+
  //                         'rotateZ('+node.rotate[2]+'deg)');
  var matrix = new Matrix();
  if(node.align) {
    console.log(node.align[0],node.align[1],node.align[2]);
    matrix = matrix.translate(node.align[0]*100+'%',node.align[1]*100+'%',node.align[2]*100+'%');
  }
  else if(node.translate) {
    matrix = matrix.translate(node.translate[0],node.translate[1],node.translate[2]);
  }
  if(node.scale) {
    matrix = matrix.scale(node.scale[0], node.scale[1], node.scale[2]);
  }
  if(node.rotate) {
    matrix = matrix.rotate(node.rotate[0], node.rotate[1], node.rotate[2]);
  }
  this.elem.style[this.vendor.transform]= matrix.toString();

  if(node.opacity) {
    this.elem.style.opacity = node.opacity;
  }
  // if(node.position) {
  //   this.elem.style.position = node.position;
  // }

  if(node.size[0] === 1) node.size[0] = parseFloat(1.0);
  if(node.size[1] === 1) node.size[1] = parseFloat(1.0);

  if(node.size) {
    this.isFloat(node.size[0]) ? this.elem.style.width = node.size[0]*100+'%' : this.elem.style.width = node.size[0]+'px' ;
    this.isFloat(node.size[1]) ? this.elem.style.height = node.size[1]*100+'%' : this.elem.style.height = node.size[1]+'px';
  }

  if(node.origin) {
    //this.elem.style.transformOrigin = node.origin[0]+'%,'+node.origin[1]+'%';//','+node.origin[2]+'%';
  }


};

module.exports = DOMComponent;
