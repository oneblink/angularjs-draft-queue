'use strict'

const path = require('path')

const gulp = require('gulp')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const del = require('del')
const pump = require('pump')

const KarmaServer = require('karma').Server

// rollup specific
const rollup = require('rollup').rollup
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const eslint = require('rollup-plugin-eslint')
const htmltemplate = require('rollup-plugin-html')

const DEST = 'dist'
const ENTRY_POINT = 'src/draft-queue-module.js'
const FILENAME = 'bm-angularjs-draft-queue.js'
const MODULE_FORMAT = 'umd'
const MODULE_NAME = 'bmDraftQueue'

const makeBundle = function(entry, destFilename) {

  const plugins = [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    eslint({
      exclude: []
    }),
    htmltemplate(),
    babel(
      {
        // exclude: 'node_modules/**'
      }
    )
  ]

  return rollup({ entry, plugins }).then(function(bundle) {
    const bundleOpts = {
      format: MODULE_FORMAT,
      moduleName: MODULE_NAME,
      dest: `${DEST}/${destFilename}`
    }

    return bundle.write(bundleOpts)
  })
}

const minifiedName = (strings, filename) =>
  filename.replace(/\.js$/, '.min.js')

const minify = function(fileName) {
  return () => pump([
        gulp.src(`${DEST}/${fileName}`),
        rename(minifiedName`${fileName}`),
        uglify({ preserveComments: 'license' }),
        gulp.dest(DEST)
      ]
    )
}

/* ///////////////////// gulp tasks */

gulp.task('clean', () => {
  return del(DEST)
})

const karmaFiles = [
  'node_modules/angular/angular.js',
  'node_modules/angular-mocks/angular-mocks.js',
  'node_modules/localforage/dist/localforage.js',
  'node_modules/angular-localforage/dist/angular-localForage.js',
  `dist/${FILENAME}`,
  'test/unit/*.js'
]

gulp.task('test', ['build-prod'], done => {
  new KarmaServer({
      configFile: path.join(__dirname, './karma.conf.js'),
      singleRun: false,
      files: karmaFiles
    },
    done
  ).start()
})

gulp.task('test-single-run', ['build-prod', 'minify'], done => {
  new KarmaServer(
    {
      configFile: path.join(__dirname, './karma.conf.js'),
      singleRun: true,
      autoWatch: false,
      files: karmaFiles
    },
    done
  ).start()
})

gulp.task('minify', ['build-prod'], minify(FILENAME))

gulp.task('build-prod', ['clean'], () => {
  return makeBundle(ENTRY_POINT, FILENAME)
})

gulp.task('default', ['clean', 'build', 'test-single-run'], () => {})

gulp.task('build', ['clean', 'build-prod', 'minify'])
