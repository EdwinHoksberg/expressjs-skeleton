'use strict';
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    argv = require('yargs').argv;

/**
 * Combines all css files together.
 * Depending on the production flag, also minifies or creates a sourcemap.
 */
gulp.task('css', function() {
    if (argv.production) {
        return gulp.src('public/css/**/*.scss')
            .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
            .pipe(gulp.dest('public/css'));
    } else {
        return gulp.src('public/css/**/*.scss')
            .pipe(sourcemaps.init())
                .pipe(sass().on('error', sass.logError))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('public/css'));
    }
});

/**
 * Combines all javascript files together.
 * Depending on the production flag, also minifies or creates a sourcemap.
 */
gulp.task('js', function() {
    var files = [
        'public/js/vendor/jquery.min.js',
        'public/js/vendor/bootstrap.min.js',
        'public/js/vendor/**/*.js',
        'public/js/modules/**/*.js',
        'public/js/views/**/*.js'
    ];

    if (argv.production) {
        return gulp.src(files)
                .pipe(concat('app.js'))
                .pipe(uglify())
            .pipe(gulp.dest('public/js'));
    } else {
        return gulp.src(files)
            .pipe(sourcemaps.init())
                .pipe(concat('app.js'))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('public/js'));
    }
});

/**
 * Watches the javascript and css folders for changes.
 * If there was a change, the appropriate task will be executed.
 */
gulp.task('watch', function () {
    gulp.watch('public/css/**/*.scss', ['css']);
    gulp.watch('public/js/**/!(app.js)/*.js', ['js']);
});

/**
 * Copies the project files to the public directory, ready for use.
 */
gulp.task('install', function() {
    // copying javascript
    gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('public/js/vendor'));
    gulp.src('node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js')
        .pipe(gulp.dest('public/js/vendor'));

    // copying fonts
    gulp.src('node_modules/bootstrap-sass/assets/fonts/bootstrap/*.*')
        .pipe(gulp.dest('public/fonts/bootstrap'));

    // start js and css tasks
    gulp.start('js', 'css');
});

/**
 * The default task executes the css and js task.
 */
gulp.task('default', ['css', 'js']);
