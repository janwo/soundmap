var gulp = require('gulp'),
plugins = require('gulp-load-plugins')();

var config = {};
// Paths of original files.
config.src = './src/';
config.bower = config.src + '/vendor';
config.src_img = config.src + '/img';
config.src_js = config.src + '/js';
config.src_scss = config.src + '/scss';
config.src_fonts = config.src + '/fonts';

// Paths of compiled files.
config.dst = './dst/';
config.dst_img = config.dst + '/img';
config.dst_js = config.dst + '/js';
config.dst_css = config.dst + '/css';
config.dst_fonts = config.dst + '/fonts';

// Gulp settings.
config.uglify = {
	preserveComments: 'some'
};
config.minifyCss = {
	keepSpecialComments: '*'
};

// Plugins.
config.plugin_srcs = {
	scripts: [
		config.bower + '/owl-carousel2/dist/owl.carousel.js',
		config.bower + '/modernizr/modernizr.js',
		config.bower + '/jquery-placeholder/jquery.placeholder.js',
		config.bower + '/jquery.cookie/jquery.cookie.js',
		config.bower + '/foundation/js/foundation.js',
		config.bower + '/fastclick/lib/fastclick.js'
	],
	styles: [
		config.bower + '/animate-css/animate.css',
		config.bower + '/fontawesome/css/font-awesome.css',
		config.bower + '/owl-carousel2/dist/assets/owl.carousel.css'
	],
	fonts: [
		config.bower + '/fontawesome/fonts/**.*'
	]
};

// Styles.
gulp.task('styles', function() {
return plugins.rubySass(config.src_scss + '/*', { style: 'expanded' })
	.on('error', function (err) {
		console.error('Error!', err.message);
		this.emit('end');
	})
	.pipe(plugins.autoprefixer('> 5%', 'last 1 version'))
	/*.pipe(plugins.sourcemaps.init())
	.pipe(plugins.minifyCss(config.minifyCss))
	 .pipe(plugins.sourcemaps.write())*/
	.pipe(plugins.rename({ suffix: '.min' }))
	.pipe(gulp.dest(config.dst_css));
});

// Plugin styles.
gulp.task('plugin-styles', function () {
	return gulp.src(config.plugin_srcs.styles)
		.pipe(plugins.concat('plugins.css'))
		/*.pipe(plugins.sourcemaps.init())
		.pipe(plugins.minifyCss(config.minifyCss))
		.pipe(plugins.sourcemaps.write())*/
		.pipe(plugins.rename({ suffix: '.min' }))
		.pipe(gulp.dest(config.dst_css));
});

// Scripts.
gulp.task('scripts',function(){
	return gulp.src(config.src_js + '/*.js')
		.pipe(plugins.concat('app.js'))
		/*.pipe(plugins.sourcemaps.init())
		.pipe(plugins.uglify(config.uglify))*/
		.pipe(plugins.stripDebug())
		/*.pipe(plugins.sourcemaps.write())*/
		.pipe(plugins.rename({ suffix: '.min' }))
		.pipe(gulp.dest(config.dst_js));
});

// Plugin scripts.
gulp.task('plugin-scripts', function() {
	gulp.src(config.plugin_srcs.scripts)
		.pipe(plugins.concat("plugins.js"))
		/*.pipe(plugins.sourcemaps.init())
		.pipe(plugins.uglify(config.uglify))
		.pipe(plugins.sourcemaps.write())*/
		.pipe(plugins.rename({ suffix: '.min' }))
		.pipe(gulp.dest( config.dst_js ))
});

// Fonts.
gulp.task('fonts', function () {
	return gulp.src([config.src_fonts + '/*'])
		.pipe(gulp.dest(config.dst_fonts));
});

// Plugin fonts.
gulp.task('plugin-fonts', function () {
	return gulp.src(config.plugin_srcs.fonts)
		.pipe(gulp.dest(config.dst_fonts));
});

// Images.
gulp.task('images', function () {
	return gulp.src(config.src_img + '/**/**.*')
		.pipe(plugins.cache(plugins.imagemin({
			progressive: true,
			svgoPlugins: [{removeComments: false}],
			multipass: true
		})))
		.pipe(gulp.dest(config.dst_img));
});

// Watch.
gulp.task('watch', function() {
	// Trigger gulp.
	gulp.watch(config.src_scss + '/**/*', ['styles']);
	gulp.watch(config.src_js + '/**/*', ['scripts']);
	gulp.watch(config.src_img + '/**', ['images']);
	gulp.watch(config.src_fonts + '/**', ['fonts']);

	// Trigger reloading.
	plugins.livereload.listen();
	gulp.watch('**/*.php').on('change', plugins.livereload.changed);
	gulp.watch(config.dst_css + '/*.css').on('change', plugins.livereload.changed);
	gulp.watch(config.dst_js + '/*.js').on('change', plugins.livereload.changed);
	gulp.watch(config.dst_img + '/**').on('change', plugins.livereload.changed);
	gulp.watch(config.dst_fonts + '/**').on('change', plugins.livereload.changed);
});

// Default task.
gulp.task('default', ['styles', 'scripts', 'images', 'fonts', 'plugins']);

// Plugin task.
gulp.task('plugins', ['plugin-styles', 'plugin-scripts', 'plugin-fonts']);

