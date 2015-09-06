'use strict';

var lib = 'lib';

module.exports = {
  lib: lib,
  main: lib + '/main.js',
  dist: 'dist',
  watch: {
    paths: ['js'].reduce(function(paths, ext) {
      return paths.concat([lib + '/**/*.' + ext, lib + '/*.' + ext]);
    }, [])
  }
};
