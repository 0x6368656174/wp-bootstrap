'use strict';

import gulp from 'gulp';
import del from 'del';
import sass from 'gulp-sass';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import tsify from "tsify";
import autoprefixer from 'gulp-autoprefixer';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import buffer from 'vinyl-buffer';

const dist = './wp-content/themes/project-theme/dist';

// JS
const jsPath = './wp-content/themes/project-theme/src/js/';
gulp.task('js:clean', () => {
    return del(`${dist}/js-bundle.js`);
});
gulp.task('js', ['js:clean'], () => {
    return browserify({
        basedir: '.',
        debug: true,
        entries: [`${jsPath}/bundle.js`]
    })
        .transform('babelify', {
            presets: ['env']
        })
        .bundle()
        .pipe(source('js-bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dist));
});
gulp.task('js:watch', () => {
    gulp.watch([jsPath], ['js']);
});

// TS
const tsPath = './wp-content/themes/project-theme/src/ts/';
gulp.task('ts:clean', () => {
    return del(`${dist}/ts-bundle.js`);
});
gulp.task('ts', ['ts:clean'], () => {
    return browserify({
        basedir: '.',
        debug: true,
        entries: [`${tsPath}/bundle.ts`]
    })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['env'],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source('ts-bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dist));
});
gulp.task('ts:watch', () => {
    gulp.watch([tsPath], ['ts']);
});

// SCC
const scssPath = './wp-content/themes/project-theme/src/scss/**/*.scss';
gulp.task('scss:clean', () => {
    return del(`${dist}/bundle.css`);
});
gulp.task('scss', ['scss:clean'], () => {
    return gulp.src(scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist));
});
gulp.task('scss:watch', () => {
    gulp.watch([scssPath], ['sass']);
});

gulp.task('default', ['js', 'ts', 'scss']);
gulp.task('clean', ['js:clean', 'ts:clean', 'scss:clean']);
gulp.task('watch', ['js:watch', 'ts:watch', 'scss:watch']);
