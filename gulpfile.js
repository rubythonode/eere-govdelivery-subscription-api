var gulp = require('gulp')
  //, concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , sourcemaps = require('gulp-sourcemaps')
  //, jshint = require('gulp-jshint')
  , rename = require('gulp-rename')
  , clean = require('gulp-clean')
  , usemin = require('gulp-usemin')
  , cssmin = require('gulp-cssmin')
  , livereload = require('gulp-livereload')
  , ghPages = require('gulp-gh-pages')
  , runSequence = require('run-sequence')
  , babel = require('gulp-babel')
  , eslint = require('gulp-eslint')


// Watch Our Files
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/**/*', ['build']).on('change', livereload.changed)
    //gulp.watch('dist/**/*').on('change', livereload.changed)
});


// gulp.task('html', function() {
//     return gulp.src(['dist/index.html'])
//     .pipe(livereload());
// });

gulp.task('babel', function() {
    return gulp.src('src/client/js/app.es6.js')
        .pipe(babel({presets: ['es2015']}))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('src/client/js'))
})

gulp.task('usemin', function() {
    return gulp.src('src/index.html')
        .pipe(usemin({
            //assetsDir: 'public',
            css: [cssmin(), 'concat'],
            js:  [uglify()]
        }))
        .pipe(gulp.dest('dist'));
});

// lint js
// gulp.task('jshint', function() {
//     return gulp.src('src/client/js/*.js')
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// })

//
gulp.task('lint', function () {
    return gulp.src(['src/client/*.es6.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
})

// Concat & Minify JS
gulp.task('uglify', function(){
  return gulp.src('src/client/js/app.js')
        //.pipe(concat('app.js'))
        .pipe(sourcemaps.init())
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        //.pipe(uglify( {compress: {drop_debugger:false} }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/client/js'))
})


gulp.task('cssmin', function () {
    return gulp.src('src/client/css/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min.css'}))
        .pipe(gulp.dest('dist/client/css'));
})


// remove anything in dist
gulp.task('clean', function() {
    return gulp.src(['dist/*'], {read: false})
        .pipe(clean())
})

gulp.task('clean-es5', function () {
    return gulp.src('src/client/js/app.js', {read: false})
        .pipe(clean())
})

gulp.task('gh-pages', function() {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
})

gulp.task('deploy', function(cb){
    runSequence('build', ['gh-pages'], cb)
})

gulp.task('build', function(cb){
    runSequence('clean', 'lint','babel', 'usemin', 'clean-es5', cb)
})

