define(function(require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Surface = require('samsara/dom/Surface');

    // The Drawer is the side panel that gets exposed by
    // translating the content.
    //
    // Its initially offset to the left, and slides into place
    // as the content is moved. Its speed is sped up from the
    // content by the threshold parameter, which also defines
    // the cutoff at which the drawer reaches its final position.

    var Drawer = View.extend({
        defaults : {
            length : 250    // length of drawer surface
        },
        // Executed on instantiation. Options are patched by the defaults if unspecified.
        initialize : function(options){

            var content = '';
            for (var i = 1; i <= 50; i++){
                content += '<div class="menuItem">' + i + '</div>'
            }

            // Create the drawer
            var drawer = new Surface({
                size : [options.length, undefined],
                origin : [1,0],
                content : content,
                classes : ['drawer'],
                enableScroll: true
            });

            // Uncomment this for a more funky example
            var drawerTransform = this.input.map(function (data) {
                var angle = Math.min(Math.PI/2 * (1.3*data.progress - 1), 0);
                return Transform.thenMove(
                    Transform.rotateY(angle),
                    [data.value, 0, 0]
                );
            });

            var opacity = this.input.pluck('progress').map(function(value){
                return value;
            });

            // Create the render subtree
            this.add({
                transform: drawerTransform,
                opacity : opacity
            }).add(drawer);
        }
    });

    module.exports = Drawer;
});