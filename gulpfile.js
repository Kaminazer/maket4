import gulp from 'gulp';
import { deleteAsync } from 'del';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import browserSync from 'browser-sync';

const browserSyncInstance = browserSync.create();
const sassCompiler = gulpSass(sass); //set sass compiler

// remove dist folder
export const clean = async () => {
    const deletedFilePaths = await deleteAsync(['dist/**/*']);
    console.log('Deleted files:\n', deletedFilePaths.join('\n'));
};

// compile scss to css
export const styles = () => {
    return gulp.src('src/scss/style.scss')
        .pipe(sassCompiler().on('error', sassCompiler.logError)) 
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSyncInstance.stream());
};

// minify js
export const scripts = () => {
    return gulp.src('src/js/*.js')
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('src/js'))
        .pipe(browserSyncInstance.stream());
};

// run local server
export const serve = () => {
    browserSyncInstance.init({
        server: './src',
    });

    gulp.watch('src/scss/**/*scss', styles);
    gulp.watch('src/js/**/*.js', scripts);
    gulp.watch('src/index.html').on('change', browserSync.reload);
};

// main build task
export const build = gulp.series(clean, styles, scripts, serve);
export default build;
