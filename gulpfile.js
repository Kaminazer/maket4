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

export const html = () => {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
};

// compile scss to css
export const styles = () => {
    return gulp.src('src/scss/main.scss')
        .pipe(sassCompiler().on('error', sassCompiler.logError)) 
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSyncInstance.stream());
};

// minify js
export const scripts = () => {
    return gulp.src('src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSyncInstance.stream());
};

// copy assets
export const assets = () => {
    return gulp.src('src/assets/**/*')
        .pipe(gulp.dest('dist/assets'));
};

// run local server
export const serve = () => {
    browserSyncInstance.init({
        server: './dist'
    });

    gulp.watch('src/scss/**/*scss', styles);
    gulp.watch('src/js/**/*.js', scripts);
    gulp.watch('src/assets/**/*', assets);
    gulp.watch('src/index.html', gulp.series('html'));
    gulp.watch('dist/*.html').on('change', browserSyncInstance.reload);
};

// main build task
export const build = gulp.series(clean, html, styles, scripts, assets, serve);
export default build;
