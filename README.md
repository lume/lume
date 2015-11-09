###Getting Started
This repository is for the codebase itself. The best way to get started with SamsaraJS is to
clone the [base scaffolding repo](https://github.com/dmvaldman/samsara-base) and follow the
install instructions there. Here are some other links to get your started.

| Resources      ||
| -------------- | ------------- |
| Guide          | [samsaraJS.org/docs](http://www.samsaraJS.org/docs)  |
| Examples       | [samsaraJS.org/examples](http://www.samsaraJS.org/examples)  |
| Reference Docs | [samsaraJS.org/docs](http://www.samsaraJS.org/reference_docs)  |
| Questions      | [SamsaraJS Google Group](https://groups.google.com/forum/#!forum/samsarajs) |

###WHAT?
Samsara is a JavaScript library for doing dynamic layout. It provides a language for positioning, orienting and sizing DOM elements and animating these properties over time. This is all Samsara does, but it has its strong opinions. Everything in Samsara — from the user input to the rendering pipeline — is a stream. Building a user interface is nothing more than composing streams.

####Examples:

1. **JSNavigationController**
A simple web version of iOS's UINavigationController. You can drag the blue area, or click on the
nav buttons to transition the screens.
[[demo]](http://samsara-navigation-controller.s3-website-us-west-2.amazonaws.com)
[[source]](https://github.com/dmvaldman/JSNavigationController)

2. **SamsaraJS logo**
The SamsaraJS logo.
[[demo]](http://samsara-logo.s3-website.eu-central-1.amazonaws.com)
[[source]](https://github.com/dmvaldman/samsara-base)

3. **Accordion**
A playful UI for scrolling by folding and unfolding an accordion.
[[demo]](http://samsara-accordion.s3-website.eu-central-1.amazonaws.com)
 
SamsaraJS has no dependencies, and was made to play nicely with other frameworks. We move rectangles 
around the screen — what you do inside those rectangles is up to you. Samsara doesn’t include any 
support for routing, server syncing, templating and data-binding; there are plenty of other great tools 
for that. If we don’t play nicely with your tools, that’s our fault. Let us know and we will do our 
best to improve. Integrations with React.js and Backbone.js is in the pipeline.
 
###HOW?
Samsara takes an approach to called functional reactive programming. We think of layout and user input as streams of continuously changing data. You can, for instance, subscribe the opacity of a nav bar to the transition of a hamburger menu to a touch gesture of a user. Developing an interface in Samsara is nothing more than creating, modifying, and joining streams. At the end of these streams, SamsaraJS exports style properties (opacity, transform and size) to the DOM.
 
###WHY?
I created SamsaraJS because I believe that we can do so much more with our user interfaces. Until recently, a “point and click” ethos dominated user interaction with CSS and HTML defining the language. We can evolve this ethos to “point and move”. SamsaraJS is made for interfaces where the connection between the user and the application evolve in lock-step.

###Talks
[![Talk](http://i.imgur.com/tGbmVk4.png)](https://www.youtube.com/watch?v=biJXpv-6XVY)
[JSConf EU 2015 Berlin, Germany](https://www.youtube.com/watch?v=biJXpv-6XVY)

###Roadmap
- [ ] Ability to remove render tree nodes (surface.remove(), layoutNode.remove(), etc)
- [ ] Physics engine
- [ ] Backbone.js & React.js integration
- [ ] Scrollview
- [ ] 3D Camera
- [ ] More layouts
