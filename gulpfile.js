const gulp = require("gulp"),
	babelify = require("babelify"),
	browserify = require("browserify"),
	source = require("vinyl-source-stream"),
	del = require("del"),
	browserSync = require("browser-sync");


const paths = {
	scripts: {
		src: "./network/*.js",
		dest: "./network/dist/"
	}
};

const clean = () => del(["dist"]);

function scripts() {
	return browserify({
		entries: ["./network/index.js"]
	})
		.transform(
			babelify.configure({
				presets: ["es2015"]
			})
		)
		.bundle()
		.pipe(source("main.bundle.js"))
		.pipe(gulp.dest("./network/dist"))
		.pipe(browserSync.stream());
}


const watch = () => gulp.watch(paths.scripts.src, gulp.series(scripts));
const dev = gulp.series(clean, scripts, watch);
dev();
