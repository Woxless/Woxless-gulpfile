const gulp = require('gulp');

const live = require('gulp-connect');
const concat = require('gulp-concat');
const autoprefix = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const stripcommentcss = require('gulp-strip-css-comments');

const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');
const useref = require('gulp-useref');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const path = {
    html: './src/index',
    styles: './src/styles/**/*',
    scripts: './src/scripts/**/*',
    images: './src/images/**/*'
};

gulp.task('liveserver', () => {
    live.server({
        root: './build',
        port: 8080,
        livereload: true
    });
});

gulp.task('css', () => {
    return gulp.src(path.styles + '.css')
        .pipe(concat('styles.css'))
        .pipe(autoprefix({
            grid: true,
            cascade: false
        }))
        .pipe(stripcommentcss())
        .pipe(cssmin())
        .pipe(gulp.dest('./build/styles'))
        .pipe(live.reload());
});

gulp.task('scss', () => {
    return gulp.src(path.styles + '.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(autoprefix({
            grid: true,
            cascade: false
        }))
        .pipe(stripcommentcss())
        .pipe(cssmin())
        .pipe(gulp.dest('./build/styles'))
        .pipe(live.reload())
        .pipe(gulp.dest('./build/styles'))
        .pipe(live.reload());
});

gulp.task('img', () => {
    return gulp.src(path.images)
        .pipe(imagemin())
        .pipe(gulp.dest('./build/images'));
});

gulp.task('scripts', () => {
    return gulp.src(path.scripts + '.js')
        .pipe(concat('scripts.js'))
        .pipe(babel({presets: ['@babel/preset-env']}))
        .pipe(uglify())
        .pipe(gulp.dest('./build/scripts'))
        .pipe(live.reload());
});

gulp.task('html', () => {
    return gulp.src(path.html + '.html')
        .pipe(useref())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./build'))
        .pipe(live.reload());
});

gulp.task('liveserver:watch', () => {
    gulp.watch(path.html + '.html', gulp.series('html'));
    gulp.watch(path.styles + '.css', gulp.series('css'));
    gulp.watch(path.styles + '.scss', gulp.series('scss'));
    gulp.watch(path.scripts + '.js', gulp.series('scripts'));
    gulp.watch(path.images, gulp.series('img'));
});

gulp.task('default', gulp.parallel('liveserver', 'liveserver:watch'));