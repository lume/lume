# famin - famously minimal

Copyright (c) 2015 Gadi Cohen released under MIT license

## Project goal

A high quality rendering Engine, designed for real world use.  Built
in tandem with high quality, reuseable components, to ensure relevance.

## Coding Goals

* https://hackpad.com/Famous-Stuff-akPoyPRvt9o

* Avoid high traffic anonymous functions.  e.g. for updates, pass
  an existing function, with optional context/this and data/args.

* Avoid use of ES6 features (e.g. set/map) for high traffic calls.
  This will often run with the polyfill which I don't think is optimized.

* Comments!  Especially for anything that might not be obvious.

* TODO: CI browser testing of different browsers and versions

Maybe:

* Comments to justify every use of `new` and maybe [], {}.
  New objects should come from a pool/factory and recycled.

* `Trash` class for non-recyclable stuff, to keep a ref, track
  how much garbage we're creating, and avoid browser garbage
  collection until idle time (which the browser is meant to do
  anyway, except when it doesn't).

## Boilerplate

Found https://github.com/brianium/es6-boilerplate which looks awesome,
using browserify, babel, jest.

* `npm i` - install deps (before building/testing)
* `npm run build` - build to `dist/`
* `npm run dev` - file watcher (rebuild on change)
* `npm test`

## Disclaimers

This is my first time using ES6, ES6 modules, browserify, etc.  All my
experience is with Meteor (before that, PHP; I skipped node.js before
using Meteor).

I'm not opinionated with anything regarding the above, neither style
nor library choices - I just picked what I found quickly and made sense.
