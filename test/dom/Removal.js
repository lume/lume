define(function(require) {
    var Transform = require('samsara/core/Transform');
    var Surface = require('samsara/dom/Surface');
    var ContainerSurface = require('samsara/dom/ContainerSurface');
    var Context = require('samsara/dom/Context');
    var View = require('samsara/core/View');

    var surfaceClass = '.samsara-surface';
    var contextClass = '.samsara-context';
    var containerClass = '.samsara-container';

    QUnit.module('DOM Removal');

    QUnit.test('Remove Surface', function(assert){
        var context = new Context();
        var mountElement = document.createElement('div');
        var surface = new Surface();

        // mount context
        context.add(surface);
        context.mount(mountElement);

        // remove surface
        surface.remove();
        var surfaceEl = mountElement.querySelector(surfaceClass);
        assert.notOk(surfaceEl instanceof Node);

        // add surface
        context.add(surface);
        surfaceEl = mountElement.querySelector(surfaceClass);
        assert.ok(surfaceEl instanceof Node);
    });

    QUnit.test('Remove Branch', function(assert) {
        var context = new Context();
        var mountElement = document.createElement('div');
        var surface = new Surface();

        // Create branch
        var centerNode = context.add({align : [.5, .5]});
        centerNode.add(surface);

        // add
        context.add(centerNode);
        context.mount(mountElement);
        var surfaceEl = mountElement.querySelector(surfaceClass);
        assert.ok(surfaceEl instanceof Node);

        // remove
        centerNode.remove();
        surfaceEl = mountElement.querySelector(surfaceClass);
        assert.notOk(surfaceEl instanceof Node);

        // add again
        context.add(centerNode);
        var surfaceEl = mountElement.querySelector(surfaceClass);
        assert.ok(surfaceEl instanceof Node);

        // check surfaces have been correctly recycled
        var surfaces = mountElement.querySelectorAll(surfaceClass);
        assert.ok(surfaces.length === 1);
    });

    QUnit.test('Remove Context', function(assert) {
        var context = new Context();
        var mountElement = document.createElement('div');
        var surface = new Surface();

        // Mount context
        context.add(surface);
        context.mount(mountElement);

        // remove context
        context.remove();
        var surfaceEl = mountElement.querySelector(surfaceClass);
        assert.notOk(surfaceEl instanceof Node);

        // remount context
        context.mount(mountElement);
        var surfaceEl = mountElement.querySelector(surfaceClass);
        assert.ok(surfaceEl instanceof Node);
    });

    QUnit.test('Remove Container', function(assert) {
        var context = new Context();
        var mountElement = document.createElement('div');
        var surface = new Surface();

        // create container
        var container = new ContainerSurface();
        container.add(surface);
        context.add(container);

        // mount context
        context.mount(mountElement);

        container.remove();
        var containerEl = mountElement.querySelector(containerClass);
        assert.notOk(containerEl instanceof Node);

        context.add(container);;
        var containerEl = mountElement.querySelector(containerClass);
        assert.ok(containerEl instanceof Node);
    });

    QUnit.test('Remove Container Children', function(assert) {
        var context = new Context();
        var mountElement = document.createElement('div');

        var surface1 = new Surface({classes : ['test1']});
        var surface2 = new Surface({classes : ['test2']});

        // create container
        var container = new ContainerSurface();
        container.add(surface1);
        container.add(surface2);

        // mount context
        context.add(container);
        context.mount(mountElement);

        // assert both elements are in the DOM
        var surface1El = mountElement.querySelector('.test1');
        var surface2El = mountElement.querySelector('.test2');
        assert.ok(surface1El instanceof Node);
        assert.ok(surface2El instanceof Node);

        // remove surface1
        surface1.remove();
        var surface1El = mountElement.querySelector('.test1');
        assert.notOk(surface1El instanceof Node);

        // remove surface2
        surface2.remove();
        var surface2El = mountElement.querySelector('.test2');
        assert.notOk(surface1El instanceof Node);

        // add surface1
        container.add(surface1);
        var surface1El = mountElement.querySelector('.test1');
        assert.ok(surface1El instanceof Node);

        // remove surface2
        container.add(surface2);
        var surface2El = mountElement.querySelector('.test2');
        assert.ok(surface1El instanceof Node);

        // check total number of surfaces in container is 2
        var surfaces = container._currentTarget.querySelectorAll(surfaceClass);
        assert.ok(surfaces.length == 2);
    });

    QUnit.test('Remove View', function(assert) {
        // create the View
        var MyView = View.extend({
            initialize : function(){
                var surface = new Surface();
                this.add(surface);
            }
        });

        var myView = new MyView();

        // mount the context
        var context = new Context();
        var mountElement = document.createElement('div');
        context.add(myView);
        context.mount(mountElement);

        myView.remove();
        var surfaceEl = mountElement.querySelector(surfaceClass);
        assert.notOk(surfaceEl instanceof Node);

        context.add(myView);
        var surfaceEl = mountElement.querySelector(surfaceClass);
        assert.ok(surfaceEl instanceof Node);
    });
});