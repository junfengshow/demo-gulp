// ---------------------------------------------------------
// node 侧用到的方法
const fs = require('fs')
// ---------------------------------------------------------
// gulp 侧用到的方法
const { series, src, dest, watch } = require('gulp') 
// ---------------------------------------------------------
// 使用gulp-babel进行js的转换
const gulpBabel = require('gulp-babel')
// 使用gulp-rev对资源文件加hash
const rev = require('gulp-rev')
// 对html替换成加了hash的文件名
const revCollector = require('gulp-rev-collector')
// 清除目标文件夹下的文件
const gulpClean = require('gulp-clean')
// web 服务
const connect = require('gulp-connect')
// 使用webpack进行打包 也可以选择browserify等其它工具
const webpackStream = require('webpack-stream')
// 命名并输出文件系统
const named = require('vinyl-named')
// 中html插入js、css、html等
const gulpInject = require('gulp-inject')
// 链接插件
const concat = require('gulp-concat')
const through2 = require('through2');

// ---------------------------------------------------------
// 处理js
function scriptsTask () {
  // 文件内import进去的文件也需要使用babel进行转换
  // 故而将babel的配置移入到webpack中
  return src('./src/main.js')
  // babel 转换
  // .pipe(gulpBabel({
  //   plugins: ['@babel/plugin-proposal-class-properties'],
  //   presets: ['@babel/preset-react', '@babel/preset-env']
  // }))
  // 先进性命名、如果不命名webpack会将各个文件合并成一个文件
  .pipe(named())
  // 使用webpack进行打包
  .pipe(webpackStream({
    mode: 'development',
    output: {
      filename: '[name].js'
    },
    plugins: [],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-proposal-class-properties'],
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      ]
    }
  }))
  // rev生成带hash文件 
  // .pipe(rev())
  // 输出生成的带hash的js文件
  .pipe(dest('dist'))
  // 生成json文件
  // .pipe(rev.manifest({
  //   merge: false,
  //   path: 'js-manifest.json'
  // }))
  // 输出json文件到对应文件夹
  // .pipe(dest('rev'));
}

// ---------------------------------------------------------
// 处理样式
function cssTask () {
  return src('./src/**/*.css')
  .pipe(concat('style.css'))
  .pipe(rev())
  .pipe(dest('dist'))
  // 生成json文件
  .pipe(rev.manifest({
    merge: false,
    path: 'css-manifest.json'
  }))
  // 输出json文件到对应文件夹
  .pipe(dest('rev'));
}

// ---------------------------------------------------------
// 删除文件
function cleanTask (cb) {
  let resultArray = []
  if (fs.existsSync('dist')) {
    resultArray.push('dist/**/*.*')
  }
  if (fs.existsSync('rev')) {
    resultArray.push('rev/**/*.*')
  }
  // 如果目标文件夹都不在直接return否则会报错 -- 文件不存在 
  if (resultArray.length === 0) {
    return cb()
  }
  return src(resultArray).pipe(gulpClean({ allowEmpty: true }))
}

// ---------------------------------------------------------
// 根据集合替换文件名称
function collectorTask () {
  return series(
  // step 1: 先在html中插入引入的js
  function () {
    const sources = src(['./src/main.js', './src/style.css'])
    return src('./src/*.html').pipe(gulpInject(sources, {
      relative: true
    })).pipe(dest('dist'))
  }, 
  // step 2: 然后使用插件对已经加过hash的文件进行替换
  function () {
    return src(['./rev/*.json', './dist/*.html']).pipe(revCollector({
      replaceReved: true,
      allowEmpty: true
    }))
    .pipe(dest('dist'))
    .pipe(connect.reload())
  })
}

// ---------------------------------------------------------
// 启动服务
function webServer (cb) {
  connect.server({
    livereload: true,
    root: ['dist']
  })
}

// ---------------------------------------------------------
// 设置监听
watch(['src/**/*.js', 'src/**/*.css'], null, series(scriptsTask, cssTask, collectorTask()))

exports.default = series(cleanTask, scriptsTask, cssTask, collectorTask(), webServer)
