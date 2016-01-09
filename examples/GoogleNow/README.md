This is the logo for [SamsaraJS](http://samsaraJS.org). 

Try resizing the page, you'll notice the logo itself resizes while still animating. 
Behold the power of streams!

## Installation

Open `index.html` in your browser. That's it!

To view this demo on a mobile device, go to [goo.gl/p4HQiv](http://goo.gl/p4HQiv)

## Documentation

If you open `docs/main.html` in your browser you will see pretty documentation, rendered with [docco](https://jashkenas.github.io/docco/).

##Bundling

If you'd like to bundle the application into a single JavaScript file, run the following:
 
```
	npm install
	npm run build
```

This will create a `build` directory with a bundled `app.js` and minified `app.min.js` files. Keep in mind
you will need to copy over other assets, such as images, fonts, CSS and the index.html file.