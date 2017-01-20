var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

// gulp.task('log', function() {
//   gutil.log('Workflows are awesome');
// });

var coffeeSources = ['components/coffee/tagline.coffee'];
// var coffeeSources = ['components/coffee/*.coffee'];  // any coffee files
var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js',
];
var sassSources = ['components/sass/style.scss'];
var htmlSources = ['builds/development/*.html'];
var jsonSources = ['builds/development/js/*.json'];

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    // bare: true    no safety wrapper
    .pipe(coffee({ bare: true })
    .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

// Could run the coffee task before the js task
// gulp.task('js', ['coffee'], function() {
gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
    .pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    // check out gulp-compass on npm for options
    .pipe(compass({
      comments: true,
      css: 'builds/development/css',
      sass: 'components/sass',
      image: 'builds/development/images',
      style: 'expanded'
    }))
    .on('error', gutil.log)
    // .pipe(gulp.dest('builds/development/css'))
    .pipe(connect.reload())

});

gulp.task('connect', function() {
  connect.server({
    root: 'builds/development/',
    livereload: true
  })
});

gulp.task('html', function() {
  gulp.src(htmlSources)
    .pipe(connect.reload())
});

gulp.task('json', function() {
  gulp.src(jsonSources)
    .pipe(connect.reload())
});

gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*scss', ['compass']);
  gulp.watch(htmlSources, ['html']);
  gulp.watch(jsonSources, ['json']);
});

gulp.task('all', ['coffee', 'js', 'compass']);

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);
