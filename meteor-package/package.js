Package.describe({
  name: 'infamous:motor',
  version: '0.0.0',
  summary: 'A rendering engine for the web.',
  git: 'https://github.com/infamous/motor.git'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2-rc.7');

  // TODO
  api.use([
    'rocket:module@0.8.2'
  ], 'client');

  api.add_files([
    'entry.js',
    'npm.json',
  ], 'client');

  api.export('motor');
});
