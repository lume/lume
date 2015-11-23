/**
* Component
*
* A simple API for all Components that operate via the Engine.
* This class should contain properties shared by all Components,
* for example DOMComponent, SVGComponent, and MeshComponent.
*
* by Steve Belovarich
* Licensed under MIT, see license.txt or http://www.opensource.org/licenses/mit-license.php
**/

var Component = function(node){
    this.node = node ? node : null;
};

module.exports = Component;
