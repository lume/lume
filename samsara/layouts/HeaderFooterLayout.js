/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Transform = require('../core/Transform');
    var View = require('../core/View');
    var Stream = require('../streams/Stream');

    /**
     *
     * A 3-part layout that arranges content in a header section, content section and footer section.
     *  The header and footer sections are each optional (though one of the two must be specified).
     *  If the header's or footer's size changes, the content will size appropriately to fit.
     * 
     * @class HeaderFooterLayout
     * @constructor
     * @namespace Layouts
     * @extends Core.View
     * @param [options] {Object}                Options
     * @param options.header {Surface|View}     Surface or View acting as a header
     * @param options.footer {Surface|View}     Surface or View acting as a footer
     * @param [options.content] {Surface|View}  Surface or View acting as content
     */
    var HeaderFooterLayout = View.extend({
        defaults : {
            header : null,
            content : null,
            footer : null
        },
        initialize : function initialize(options){
            this.contentNode = null;
            var size, transform;

            if (options.header) {
                transform = options.header.size.map(function(size){
                    return Transform.translateY(size[1]);
                });

                size = (options.footer)
                    ? Stream.lift(function(headerSize, footerSize, parentSize){
                        if (!headerSize || !footerSize) return false;
                        return [parentSize[0], parentSize[1] - headerSize[1] - footerSize[1]];
                    }, [options.header.size, options.footer.size, this.size])
                    : Stream.lift(function(headerSize, parentSize){
                        if (!headerSize || !parentSize) return false;
                        return [parentSize[0], parentSize[1] - headerSize[1]];
                    }, [options.header.size, this.size]);

                this.add(options.header);
                this.contentNode = this.add({transform : transform, size : size});
            }
            else if (options.footer){
                size = Stream.lift(function(footerSize, parentSize){
                    if (!footerSize) return false;
                    return [parentSize[0], parentSize[1] - footerSize[1]];
                }, [options.footer.size, this.size]);

                this.contentNode = this.add({size : size});
            }

            if (options.footer){
                transform = options.footer.size.map(function(size){
                   return Transform.translateY(-size[1]);
                });

                this.add({align : [0, 1], transform : transform}).add(options.footer);
            }

            if (options.content) this.addContent(options.content);
        },
        /*
         * Set the content. Can be used to reset the content as well.
         *
         * @method addContent
         * @param content {Surface|View} Either a surface or view to act as content
         */
        addContent : function(content){
            this.options.content = content;
            this.contentNode.add(content);
        }
    });

    module.exports = HeaderFooterLayout;
}); 
