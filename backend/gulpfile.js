const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
// const browserSync = require('browser-sync').create();

gulp.task('sass', function(done) {
  // stream
  gulp.src('./sass/style.scss') //タスクで処理するソースの指定
    .pipe(sassGlob()) // Sassの@importにおけるglobを有効にする
    .pipe(sass()) //処理させるモジュールを指定
    .pipe(gulp.dest('./public/css/')); //保存先を指定

  console.log('sass compileしました！');
  done();
});

gulp.task('watch', function(done) {
  gulp.watch('./sass/**/*.scss', gulp.task('sass'));
  //watch task
  console.log('watch startしました！');
  done();
});

// gulp.task('browserSync', function() {
//   browserSync.init({
//     proxy: "http://localhost/",
//     port: 3000,
//   });
// });

//defaultタスクは、タスク名を指定しなかったとき（gulpと打った時）に実行されるタスクです
gulp.task('default', gulp.series( gulp.parallel('sass', /*'browserSync',*/ 'watch')));