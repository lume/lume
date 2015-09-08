Package.describe({
  summary: 'Infamous',
  version: '0.0.1',
  name: 'infamous:engine',
  git: 'https://github.com/infamous/engine.git'
});

Package.on_use(function (api) {
  api.export('Infamous');
  api.export('THREE');
  api.versionsFrom('METEOR@1.0');

  api.use([
    'jquery',
    'underscore',
    'infinitedg:tween',
    'grigio:babel'
  ],['client']);

  api.add_files([

    // Hybrid UI
    'export.js',

    // Lib
    'lib/three.js',
    'lib/TrackballControls.js',

    // Engine
    'src/engine/Utility.es6.js',
    'src/engine/Curve.es6.js',
    'src/engine/Node.es6.js',
    'src/engine/Sprite.es6.js',
    'src/engine/Camera.es6.js',
    'src/engine/Scene.es6.js',

    //Styles
    'src/styles/engine.css'

  ], 'client');

});