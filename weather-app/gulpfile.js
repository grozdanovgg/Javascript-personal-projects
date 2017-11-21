const gulp = require('gulp');
const del = require('del');
const shell = require('gulp-shell');

gulp.task('clean', () => {
    return del('dist');
});

gulp.task('buildWatch', shell.task(['ng build --watch']));

gulp.task('server', shell.task(['nodemon server/app.js']));

gulp.task('run', gulp.parallel('buildWatch', 'server'));

gulp.task('default', gulp.series('clean', 'run'));