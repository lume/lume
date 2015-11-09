###Getting Started
This repository is for the codebase itself. The best way to get started with SamsaraJS is to
clone the [base scaffolding repository](https://github.com/dmvaldman/samsara-base) and follow the
install instructions there. Here are some other links to get your started.

| Resources      ||
| -------------- | ------------- |
| Documentation  | [samsaraJS.org/docs](http://www.samsaraJS.org/docs)  |
| Examples       | [samsaraJS.org/examples](http://www.samsaraJS.org/examples)  |
| Questions?     | [SamsaraJS Google Group](https://groups.google.com/forum/#!forum/samsarajs) |

We'll be adding more "higher level" documentation soon!

###WHAT?
SamsaraJS is a JavaScript library for making user interfaces on the mobile and desktop web. 
The target audience is web developers looking to build complex, gesture-based interactions 
for their application.

####Examples (with source code):

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
 
SamsaraJS is unique in that it is allows for many parts of an interface to animate in unison. 
This kind of dependency management is hard to do, and we believe it means rethinking some 
current practices. We provides a library for making this easier, maintainable and fast.
 
SamsaraJS has no dependencies, and was made to play nicely with other frameworks. We move rectangles 
around the screen -- what you do inside those rectangles is up to you. Samsara doesn’t include any 
support for routing, server syncing, templating and data-binding; there are plenty of other great tools 
for that. If we don’t play nicely with your tools, that’s our fault. Let us know and we will do our 
best to improve.
 
###HOW?
Samsara takes an approach to layout called functional reactive programming (specifically, we ascribe 
the the philosophy of Berkeley’s [subjective idealism](https://gist.github.com/dmvaldman/f957dd9a8ed3f6edf35d)). 
We think of layout and user input as streams of continuously changing data. You can, for instance, 
subscribe the opacity of a nav bar to the transition of a hamburger menu to a touch gesture of a user. 
Developing an interface in Samsara is nothing more than creating, modifying, and piping streams. At the 
end of these streams we export style properties (opacity, transform and size) to the DOM.
 
###WHY?
We believe that layout should be decoupled from content (HTML) and style (CSS). The [vision](Section 3.4 http://dev.w3.org/html5/html-design-principles/)
for HTML was to markup content and structure, not presentation. Instead of nesting layout in HTML, 
in SamsaraJS you nest layout primitives in JavaScript. Internally, Samsara will flatten this nested 
structure before it reaches the DOM. The usefulness of CSS is for discrete interactions, 
like point and click. SamsaraJS was designed for point and move, and translating motion into layout.
 
The purpose of Samsara is not only to mimic the interactions of the native world on the web, 
but to free the creativity of web developers to invent new interactions, where previously they were 
curtailed by performance and complexity. In the native world there are the Android, iOS and Windows 
design guides. On the web there are no rules. We’re excited to see what you build.

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
