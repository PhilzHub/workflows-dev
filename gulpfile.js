var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee');

// gulp.task('log', function() {
//   gutil.log('Workflows are awesome');
// });

var coffeeSources = ['components/coffee/tagline.coffee'];
// var coffeeSources = ['components/coffee/*.coffee'];  // any coffee files

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    // bare: true    no safety wrapper
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});
