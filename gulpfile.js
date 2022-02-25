//list dependences
const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass')); // This is different from the video since gulp-sass no longer includes a default compiler. Install sass as a dev dependency `npm i -D sass` and change this line from the video.
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const imagewebp = require('gulp-webp');
const browserSync = require('browser-sync');
const minifyHtml = require('gulp-minify-html');
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const gulpEslint = require('gulp-eslint');

const _src = "src";
const dist = "dist";
//create functions

//server
function compilehtml() {
  return src(`${_src}/**/*.html`)
    .pipe(minifyHtml())
    .pipe(dest(dist))
}
//scss
const scssOptions = {
  /**
   * outputStyle (Type : String , Default : nested)
   * CSS의 컴파일 결과 코드스타일 지정
   * Values : nested, expanded, compact, compressed
  */
  outputStyle : "expanded",
  /** 
   * indentType (>= v3.0.0 , Type : String , Default : space)
   * 컴파일 된 CSS의 "들여쓰기" 의 타입
   * Values : space , tab
  */
  indentType : "tab",
  /**
   * indentWidth (>= v3.0.0, Type : Integer , Default : 2)
   * 컴파일 된 CSS의 "들여쓰기" 의 갯수\
  */
  indentWidth : 1, // outputStyle 이 nested, expanded 인 경우에 사용
  /**
   * precision (Type : Integer , Default : 5)
   * 컴파일 된 CSS 의 소수점 자리수.
  */
  precision: 6,
  /** 
  * sourceComments (Type : Boolean , Default : false)
  * 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시.
  */ sourceComments: true
};

function compilescss() {
  return src(`${_src}/scss/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass(scssOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(prefix('last 2 versions'))
    .pipe(minify())
    .pipe(dest(`${dist}/css`))
}

// js
function jsmin() {
  return src(`${_src}/js/*.js`)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    // .pipe(gulpEslint())
    // .pipe(gulpEslint.format())
    // .pipe(gulpEslint.failOnError())
    .pipe(terser())
    .pipe(dest(`${dist}/js`))
}

//images
function optimizeimg() {
  return src(`${_src}/images/*`)
    .pipe(imagemin([
      imagemin.mozjpeg({quality: 80, progressive: true}),
      imagemin.optipng({optimizationLevel: 2}),
      imagemin.gifsicle(),
      imagemin.svgo()
    ]))
    .pipe(dest(`${dist}/images`))
}

//webp images
function webpImage() {
  return src(`${_src}/images/*`)
    .pipe(imagewebp())
    .pipe(dest(`${dist}/images`))
}
//create watchtask
function watchTask() {
  browserSync.init({
    server: {
      baseDir: dist
    }
  })
  watch(`${dist}/*.html`).on('change', browserSync.reload)
  watch(`${dist}/js/**/*.js`).on('change', browserSync.reload)
  watch(`${dist}/css/**/*.css`).on('change', browserSync.reload)
  watch(`${_src}/**/*.html`, compilehtml)
  watch(`${_src}/scss/*.scss`, compilescss)
  watch(`${_src}/js/*.js`, jsmin)
  watch(`${_src}/images/*`, optimizeimg)
  watch(`${_src}/images/*`, webpImage)
}

//default gulp
exports.default = series(
  compilehtml,
  compilescss,
  jsmin,
  optimizeimg,
  webpImage,
  watchTask,
)