'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    argv = require('yargs').argv;

/**
 * Combines all css files together.
 * Depending on the production flag, also minifies or creates a sourcemap.
 */
gulp.task('sass', function() {
    if (argv.production) {
        return gulp.src('resources/sass/**/*.scss')
            .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
            .pipe(gulp.dest('public/css'))
            .pipe(notify({message: '[PROD] Compiled SASS!', onLast: true}));
    } else {
        return gulp.src('resources/sass/**/*.scss')
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('public/css'))
            .pipe(notify({message: '[DEV] Compiled SASS!', onLast: true}));
    }
});

/**
 * Combines all javascript files together.
 * Depending on the production flag, also minifies or creates a sourcemap.
 */
gulp.task('js', function() {
    // These files will be included first
    var files = [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
    ];

    if (argv.production) {
        return gulp.src(files.concat(['resources/js/modules/**/*.js', 'resources/js/views/**/*.js']))
            .pipe(concat('app.js'))
            .pipe(uglify())
            .pipe(gulp.dest('public/js'))
            .pipe(notify({message: '[PROD] Compiled JS!', onLast: true}));
    } else {
        return gulp.src(files.concat(['resources/js/modules/**/*.js', 'resources/js/views/**/*.js']))
            .pipe(sourcemaps.init())
            .pipe(concat('app.js'))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('public/js'))
            .pipe(notify({message: '[DEV] Compiled JS!', onLast: true}));
    }
});

/**
 * Watches the javascript and css folders for changes.
 * If there was a change, the appropriate task will be executed.
 */
gulp.task('watch', function () {
    gulp.watch('resources/sass/**/*.scss', ['sass']);
    gulp.watch('resources/js/**/!(app.js)/*.js', ['js']);
});

/**
 * The default task executes the css and js task.
 */
gulp.task('default', ['sass', 'js']);