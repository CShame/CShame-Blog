var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var px2rem = require('gulp-px3rem');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var autoprefixer = require('gulp-autoprefixer');

gulp.task('default', ['dev']);


gulp.task('dev', ['allJs','allNodeJs', 'allCss']);

gulp.task('allNodeJs', function (done) {
  // gulp.src(['./www/src/app/app.js', './www/src/app/services.js', './www/src/*/**/*.js'])
  //     .pipe(sourcemaps.init())
  //     .pipe(concat('all.js'))
  //     .pipe(rename({ suffix: '.min' }))   //rename压缩后的文件
  //     .pipe(ngAnnotate({ add: true }))
  //     .pipe(uglify())
  //     .pipe(sourcemaps.write())
  //     .pipe(gulp.dest('./www/dist/'))
  //     .on('end', done);

  gulp.src(['./config/default.js', './lib/mongo.js', './middlewares/**/*.js', './models/**/*.js', './routes/**/*.js'])
    .pipe(ngAnnotate({ add: true }))
    .pipe(sourcemaps.init())
    .pipe(concat('allnode.js'))
    // .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'))
    .on('end', done);
});

gulp.task('allJs', function (done) {
  gulp.src(['./public/js/common/**/*.js'])
    .pipe(ngAnnotate({ add: true }))
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    // .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'))
    .on('end', done);
});

gulp.task('allCss', function (done) {
  gulp.src(['./public/css/**/*.css'])
    .pipe(concat('all.css'))
    .pipe(rename({suffix: '.min'}))   //rename压缩后的文件
    .pipe(autoprefixer({
      browsers: ['IOS >= 8', 'Android >= 4.2'],
      cascade: true,
      remove: true
    }))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest('./dist/'))
    .on('end', done);
});
