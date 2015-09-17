Package.describe({
  summary: 'motor.js',
  version: '0.0.0',
  name: 'infamous:motor',
  git: 'https://github.com/infamous/motor.git'
});

Package.on_use(function (api) {
  api.export('Motor');
  api.export('THREE');
  api.versionsFrom('METEOR@1.0');

  api.use([
    'jquery',
    'underscore',
    'infinitedg:tween',
    'grigio:babel'
  ],['client']);

  api.add_files([

    'export.js',

    // Lib
    'lib/three.js',
    'lib/TrackballControls.js', // TODO, TrackballControls can be part of the Motor.js NPM library.

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
