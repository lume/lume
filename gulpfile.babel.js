/*eslint-env node */

"use strict";

import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import browserSync from "browser-sync";
import runSequence from "run-sequence";
import del from "del";

const plugins = gulpLoadPlugins();

gulp.task("lint", () => {
  return gulp.src(["src/**/*.js"])
    .pipe(plugins.cached("js")) //Process only changed files
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failOnError());
});

// BrowserSync Server
gulp.task("serve", [/* "lint" */], () => {
  browserSync.init([
    "src/**/*.js",
    "src/**/*.html"
  ], {
    notify: false,
    server: {
      baseDir: ["src"]
    },
    port: 3000,
    browser: [],
    tunnel: false
  });

  //gulp.watch("src/**/*.js", [/* "lint" */]);
});

// Default
gulp.task("default", ["serve"]);

// Delete dist Directory
gulp.task("clean", del.bind(null, ["dist"]));

// Bundle with jspm
gulp.task("bundle", [/* "lint" */], plugins.shell.task([
  "jspm bundle main dist/bundle.js"
]));

// Uglify the bundle
gulp.task("uglify", () => {
  return gulp.src("dist/bundle.js")
    .pipe(plugins.sourcemaps.init({
      loadMaps: true
    }))
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write("."))
    .pipe(gulp.dest("dist/min"))
    .on("error", plugins.util.log);
});

gulp.task("gzip-size", () => {
  return gulp.src("dist/min/bundle.js").pipe(plugins.size({title: "build", gzip: true}));
});

gulp.task("build", () => {
  runSequence(
    "clean",
    "bundle",
    "uglify",
    "gzip-size"
  )
});
