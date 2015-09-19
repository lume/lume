var Component = require('./Component');

var DOMComponent = function(node, elem, container){
    this.node = node.id ? node.id : node;
    this.elem = elem ? elem : document.createElement('div');

    var container = container ? container : document.body;

    this.elem.dataset.node = this.node;
    container.appendChild(this.elem);
};

DOMComponent.prototype = Object.create(Component.prototype);
DOMComponent.prototype.constructor = Component;



DOMComponent.prototype.transform = function(){

    //     this.view.style.transform = JSON.stringify(matrix3d(1, 0, 0, 0,
    //                                                         0, 1, 0, 0,
    //                                                         0, 0, 1, 0,
    //                                                         0, 0, 0, 1));
    //

};

module.exports = DOMComponent;
