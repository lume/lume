/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    // used to ensure a commit cycle has passed before a clean cycle
    // typically helpful when dirty flags are set in DOM event listeners
    // which are fired before regular JS execution
    module.exports = [];
});