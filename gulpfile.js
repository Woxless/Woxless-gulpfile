const gulp = require('gulp');

const autoprefix = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const cssstrip = require('gulp-strip-css-comments')
const minimize = require('gulp-cssmin');
const imgmin = require('gulp-imagemin');
const inject = require('gulp-inject');

const useref = require('gulp-useref');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const connect = require('gulp-connect');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');

function server() {
    connect.server({
        root: './build',
        port: 9999,
        livereload: true
    })
}

function htmls() {
    return gulp.src('./*.html')
        .pipe(useref())
        .pipe(gulp.dest('./build'))
        .pipe(connect.reload());
}

function styles() {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssstrip())
        .pipe(autoprefix())
        .pipe(minimize())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./build/css'))
        .pipe(connect.reload());
};

function images() {
    return gulp.src('./src/img/**/*')
        .pipe(imgmin())
        .pipe(gulp.dest('./build/img'))
};

function javascripts() {
    return gulp.src('./src/js/**/*.js')
        .pipe(concat('scripts.js'))
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
        .pipe(connect.reload());
}

function watcher() {
    gulp.watch('./src/sass/**/*.scss', gulp.series('styles'));
    gulp.watch('./src/img/**/*', gulp.series('images'));
    gulp.watch('./src/js/**/*.js', gulp.series('javascripts'));
    gulp.watch('./*.html', gulp.series('htmls'));
};

gulp.task('server', server);
gulp.task('watcher', watcher);

gulp.task('htmls', htmls);
gulp.task('styles', styles);
gulp.task('images', images);
gulp.task('javascripts', javascripts);

gulp.task('default', gulp.parallel('htmls', 'styles', 'images', 'javascripts', 'server', 'watcher'));