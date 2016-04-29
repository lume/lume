/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {

    /**
     * Handles creating, allocating and removing DOM elements within a provided DOM element.
     *  Manages a pool of nodes based on DOM tagName for DOM node reuse.
     *  When a Surface is deallocated, its element is cleared and put back in the pool.
     *  When a Surface is allocated, an existing cleared element of the same tagName is
     *  looked for. If it is not found, a new DOM element is created.
     *
     * @class DOMAllocator
     * @constructor
     * @namespace Core
     * @private
     * @param container {Node} DOM element
     */
    function DOMAllocator(container) {
        this.set(container);
        this.detachedNodes = {};
    }

    /**
     * Set containing element to insert allocated content into
     *
     * @method set
     * @param container {Node} DOM element
     */
    DOMAllocator.prototype.set = function(container){
        if (!container) container = document.createDocumentFragment();
        this.container = container;
    };

    /**
     * Move the DOM elements from their original container to a new one.
     *
     * @method migrate
     * @param container {Node} DOM element
     */
    DOMAllocator.prototype.migrate = function migrate(container) {
        var oldContainer = this.container;
        if (container === oldContainer) return;

        if (oldContainer instanceof DocumentFragment)
            container.appendChild(oldContainer);
        else {
            while (oldContainer.hasChildNodes())
                container.appendChild(oldContainer.firstChild);
        }
        this.container = container;
    };

    /**
     * Allocate an element of specified type from the pool.
     *
     * @method allocate
     * @param type {string} DOM tagName, e.g., "div"
     * @return {Node}
     */
    DOMAllocator.prototype.allocate = function allocate(type) {
        type = type.toLowerCase();
        if (!(type in this.detachedNodes)) this.detachedNodes[type] = [];
        var nodeStore = this.detachedNodes[type];
        var result;
        if (nodeStore.length === 0){
            result = document.createElement(type);
            this.container.appendChild(result);
        }
        else result = nodeStore.shift();
        return result;
    };

    /**
     * De-allocate an element of specified type to the pool for recycling.
     *
     * @method deallocate
     * @param element {Node} DOM element
     */
    DOMAllocator.prototype.deallocate = function deallocate(element) {
        var nodeType = element.nodeName.toLowerCase();
        var nodeStore = this.detachedNodes[nodeType];
        nodeStore.push(element);
    };

    module.exports = DOMAllocator;
});
