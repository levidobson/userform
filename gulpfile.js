// usage:
// gulp: start watching files
// gulp rebuild: rebuild everything and start watching files
// gulp standard: check js style

var assign = require('lodash').assign;
var babel = require('gulp-babel');
var babelify = require('babelify');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var buffer = require('vinyl-buffer');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gutil = require('gulp-util');
var open = require('gulp-open');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var child_process = require('child_process');
var reactify = require('reactify');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');

// environment variables
var inProduction = gutil.env.type === 'production'; // run gulp --type production
process.env.NODE_ENV = inProduction ? 'production' : 'development';
process.env.APP_PORT = 8000;
process.env.APP_HOST = 'localhost';

// project paths
var paths = {
  source: {
    backendJs: 'src/backend/**/*.js',
    backendYaml: 'src/backend/config/**/*.yaml',
    backendViews: 'src/backend/views/**/*.html',
    frontendApp: 'src/frontend/js/script.js',
    frontendJs: 'src/frontend/js/*.js',
    scss: 'src/frontend/scss/styles.scss'
  },
  build: {
    backendApp: 'build/backend/server.js',
    backendJs: 'build/backend',
    backendYaml: 'build/backend/config',
    backendViews: 'build/backend/views',
    frontendJs: 'build/frontend/js',
    css: 'build/frontend/css'
  }
};

// module to handle process start and restart
var processes = (function () {
  
  var procs = {};
  
  var startProc = function (procName, params, triggerStr, cb) {
    var callback = cb;
    var procId = procName + params.toString();
    var proc = procs[procId];
    if (proc) {
      proc.kill();
    }
    procs[procId] = proc = child_process.spawn(procName, params, {stdio: ['ipc']});
    proc.on('close', function (code) {
      if (code === 8) {
        gutil.log('Error detected, waiting for changes...');
      }
    });
    proc.stdout.on('data', function (data) {
      var str = data.toString();
      gutil.log(str);
      
      // call callback to indicate startup is done if triggerStr is received
      if (str.indexOf(triggerStr) !== -1) {
        if (callback) {
          callback();
          callback = null;
        }
      }
    });
    proc.stderr.on('data', function (data) {
      var str = data.toString();
      gutil.log(str);
      
      // call callback if an error occurred on startup, triggerStr might not be received
      if (callback) {
        callback();
        callback = null;
      }
    });
  };
  
  var killAll = function () {
    Object.keys(procs).forEach(function (procId) {
      procs[procId].kill();
    });
  };
  
  // clean up
  process.on('exit', function() {
    killAll();
  });  
  
  return {
    startProc: startProc
  };
})();

// browserify: use watchify to ensure faster builds with transpiling to es5
var customOpts = {
  entries: [paths.source.frontendApp],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var browserifyChain = browserify(opts).transform(babelify, {optional: ['runtime']}).transform(reactify);
if (inProduction) { // only minify in production mode
  browserifyChain = browserifyChain.plugin('minifyify', {map: 'bundle.js.map', output: paths.build.frontendJs + '/bundle.js.map'});
}
var watchFrontendJs = watchify(browserifyChain);
watchFrontendJs.on('update', bundleWithBrowserify); // on any dep update, runs the bundler
watchFrontendJs.on('log', gutil.log); // output build logs to terminal

// html: copy to build
gulp.task('copy-views', function() {
  return gulp.src(paths.source.backendViews)
    .pipe(gulp.dest(paths.build.backendViews));
});

// yaml: copy to build
gulp.task('copy-yaml', function() {
  return gulp.src(paths.source.backendYaml)
    .pipe(gulp.dest(paths.build.backendYaml));
});

// css: build scss
gulp.task('build-scss', function() {
  return gulp.src(paths.source.scss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.build.css));
});

// js: run standardjs to lint and check style
gulp.task('standard', function() {
  processes.startProc('node', ['node_modules/standard/bin/cmd.js', paths.source.frontendJs, paths.source.backendJs]);
});

// frontend js: transpile to es5 & bundle & minify
gulp.task('build-js-frontend', bundleWithBrowserify);
function bundleWithBrowserify() {
  return watchFrontendJs.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(paths.build.frontendJs))
    .pipe(browserSync.stream());
}

// backend js: transpile to es5 & copy to build folder
gulp.task('build-js-backend', function() {
  return gulp.src(paths.source.backendJs)
    .pipe(sourcemaps.init())
    .pipe(babel({optional: ['runtime']}))
    .on('error', function(e) {
      gutil.log(e);
      this.emit('end');
    })
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.build.backendJs));
});

// launch node
var startBackend = function(cb) {
  processes.startProc('node', [paths.build.backendApp], 'Server started.', cb);
};

// reload the browser
var reloadBrowser = function() {
  browserSync.reload({
    stream: false
  });
};

// tasks that ensure js tasks are completed before restarting backend or reloading browsers
gulp.task('watch-scss', ['build-scss'], reloadBrowser);
gulp.task('watch-views', ['copy-views'], reloadBrowser);
gulp.task('init-all-backend', ['copy-views', 'copy-yaml', 'build-scss', 'build-js-frontend', 'build-js-backend'], startBackend);

// rebuild backend js on change, then restart server and reload browsers
gulp.task('init-backend', ['build-js-backend'], startBackend);
gulp.task('watch-backend-js', ['init-backend'], reloadBrowser);

// copy swagger yaml on change, then restart server and reload browsers
gulp.task('init-backend-yaml', ['copy-yaml'], startBackend);
gulp.task('watch-yaml', ['init-backend-yaml'], reloadBrowser);

var startWatch = function() {
  
  browserSync.init({
    proxy: 'http://' + process.env.APP_HOST + ':' + process.env.APP_PORT
  });
  
  gulp.watch(paths.source.scss, ['watch-scss']);
  gulp.watch(paths.source.backendViews, ['watch-views']);
  gulp.watch(paths.source.backendYaml, ['watch-yaml']);
  gulp.watch(paths.source.backendJs, ['watch-backend-js']);
};

// main task: watch & start browsersync
gulp.task('start-backend-and-watchify', ['build-js-frontend'], startBackend);
gulp.task('default', ['start-backend-and-watchify'], startWatch);
gulp.task('rebuild', ['init-all-backend'], startWatch);
