var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;


// If we've set up a NODE environment variable, we'll use it.
// Otherwise, we'll use 'development'
// In Terminal, we would run:
// NODE_ENV=production gulp
// If that doesn't work, change 'development' to 'production' below
env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}


// gulp.task('log', function() {
//   gutil.log('Workflows are awesome');
// });

coffeeSources = ['components/coffee/tagline.coffee'];
// var coffeeSources = ['components/coffee/*.coffee'];  // any coffee files
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js',
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

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
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    // check out gulp-compass on npm for options
    .pipe(compass({
      comments: true,
      css: outputDir + 'css',
      sass: 'components/sass',
      image: outputDir + 'images',
      style: sassStyle
    }))
    .on('error', gutil.log)
    // .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())

});

gulp.task('connect', function() {
  connect.server({
    root: outputDir,
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
