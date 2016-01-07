define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');

    var Tab = View.extend({
        defaults: {
            src: '',
            title: '',
            height : 26
        },
        initialize: function (options) {
            this.title = new Surface({
                size: [undefined, options.height],
                content: options.title,
                classes: ['title'],
                properties: {
                    lineHeight: options.height + 'px'
                }
            });

            this.close = new Surface({
                size: [40, options.height],
                content: '×',
                classes: ['close'],
                properties: {
                    lineHeight: options.height - 2 + 'px'
                }
            });

            this.close.on('click', function () {
                this.emit('close');
            }.bind(this));

            //this.content = new Surface({
            //    tagName : 'img',
            //    classes: ['tab'],
            //    margins: [0, options.height/2],
            //    attributes : {
            //        src : options.src
            //    }
            //});

            this.content = new Surface({
                classes : ['tab'],
                margins : [0, options.height/2],
                properties: {
                    backgroundImage: 'url(' + options.src + ')',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top'
                }
            });

            this.content.on('click', function(){
                this.emit('select');
            }.bind(this));

            this.add(this.title);
            this.add(this.close);
            this.add({transform : Transform.translateY(options.height)})
                .add(this.content);
        },
        remove : function(){
            this.content.remove();
            this.title.remove();
            this.close.remove();
        }
    });

    module.exports = Tab;
});
