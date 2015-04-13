var gulp = require('gulp');
var react = require('gulp-react');
var rimraf = require('gulp-rimraf');
var eslint = require('gulp-eslint');
var karma = require('karma').server;

gulp.task('lint', function () {
  return gulp.src(['src/**/*.jsx'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('clean-lib', function () {
  return gulp.src(['./lib/**/*.js'], {read: false}).pipe(rimraf());
});

gulp.task('jsx-compile', ['clean-lib'], function () {
  return gulp.src('src/**/*.jsx')
    .pipe(react({harmony: true}))
    .pipe(gulp.dest('./lib'));
});

gulp.task('watch', ['jsx-compile'], function () {
    gulp.watch('src/**/*.jsx', ['jsx-compile']);
});

gulp.task('test', ['jsx-compile'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  });
});

gulp.task('default', ['watch']);
