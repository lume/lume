const gulp = require('gulp')
const babel = require('gulp-babel')
const buble = require('gulp-buble')
const babelConfig = require('./babel.config')
const bubleConfig = require('./buble.config')

function transpile() {
    return gulp.src('src/**/*.js')
        .pipe(babel(babelConfig))
        .pipe(buble(bubleConfig))
}

gulp.task('build-cjs', () =>
    transpile()
        .pipe(babel({
            plugins: [
                'transform-es2015-modules-commonjs',
                'add-module-exports',
            ],
        }))
        // TODO source maps
        .pipe(gulp.dest('./'))
)

gulp.task('build-amd', () =>
    transpile()
        .pipe(babel({
            plugins: [ 'transform-es2015-modules-amd' ],
        }))
        // TODO source maps
        .pipe(gulp.dest('./'))
)

gulp.task('build-umd', () =>
    transpile()
        .pipe(babel({
            plugins: [
                // opposite order from build-cjs
                'add-module-exports',
                'transform-es2015-modules-umd',
            ],
        }))
        // TODO source maps
        .pipe(gulp.dest('./'))
)
