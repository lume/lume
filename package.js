Package.describe({
  summary: 'motor.js',
  version: '0.0.0',
  name: 'infamous:motor',
  git: 'https://github.com/infamous/motor.git'
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@1.2-rc.7');

  // TODO
  api.use([
    'rocket:module' // TODO: configure npm.json.
  ],['client']);

  api.add_files([
    'entry.js', // TODO: a single file imports motor.js from NPM, and export a global var for Meteor packages depending on this.
  ], 'client');

  api.export('Motor');
});
