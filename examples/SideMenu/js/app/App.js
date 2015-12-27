define(function(require, exports, module) {
    var View = require('samsara/core/View');
    var GenericInput = require('samsara/inputs/GenericInput');
    var DrawerLayout = require('samsara/layouts/DrawerLayout');

    var NavBar = require('./NavBar');
    var Drawer = require('./Drawer');
    var Content = require('./Content');

    // Defines the App, which contains the navigation bar and drawer layout.
    // Sets up listeners between all the different views.
    // Provides `open` and `close` methods.
    var App = View.extend({
        defaults : {
            navHeightRatio : 0.1,           // percentage of height for nav bar
            drawerLength : 250,             // length to slide content
            drawerVelocityThreshold : 1,    // velocity to toggle a transition
            transitionOpen : true,          // default open transition
            transitionClose : true          // default close transition
        },
        // Events the view listens to in `{channel : handler}` pairs.
        // If the handler is a string, it assumes it is a method on the view.
        // These events come from the nav bar and drawer.
        events : {
            open : "open",
            close : "close"
        },
        // Executed on instantiation. Options are patched by the defaults if unspecified.
        initialize : function(options){
            // Create the navigation bar.
            var navBar = new NavBar();

            // Create the drawer layout.
            var drawerLayout = new DrawerLayout({
                revealLength : options.drawerLength,
                velocityThreshold : options.drawerVelocityThreshold,
                origin : [0,1],
                transitionOpen : options.transitionOpen,
                transitionClose : options.transitionClose
            });

            // Create the drawer.
            var drawer = new Drawer({
                length : options.drawerLength
            });

            // Create the content.
            var content = new Content();

            // Add the drawer and content into the drawerLayout.
            drawerLayout.addDrawer(drawer);
            drawerLayout.addContent(content);

            // The drawerLayout receives events from dragging the content.
            // In particular, it receives `start`, `update` and `end` events.
            drawerLayout.subscribe(content);

            // Additionally, the drawerLayout emits `start`, `update`, and `end` events,
            // the progress data indicating how extended the content is.
            // Other views listen to these and update themselves.
            navBar.subscribe(drawerLayout);  // to fade in/out and shift navItems
            drawer.subscribe(drawerLayout);  // to translate the drawer
            content.subscribe(drawerLayout); // to rotate the hand

            // Listen to events emitted from the navBar and drawer.
            // Specifically, `open` and `close` events.
            this.subscribe(navBar);

            // Create render subtree.
            this.add(
                {
                    proportions : [1, options.navHeightRatio] // proportional size
                })
                .add(navBar);

            this.add(
                {
                    align : [0,1], // align to bottom of screen
                    proportions : [1, 1 - options.navHeightRatio] // proportional size
                })
                .add(drawerLayout);

            // Introduce state so we can call the drawerLayout
            // in the `open` and `close` methods.
            this.drawerLayout = drawerLayout;
        },
        // Open the drawer with a transition.
        open : function(transition){
            transition = transition || this.options.transitionOpen;
            this.drawerLayout.open(transition);
        },
        // Close the drawer with a transition.
        close : function(transition){
            transition = transition || this.options.transitionClose;
            this.drawerLayout.close(transition);
        }
    });

    module.exports = App;
});
