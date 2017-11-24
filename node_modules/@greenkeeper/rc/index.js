var fs = require('fs')
var path = require('path')

var _ = require('lodash')
var envPaths = require('env-paths')
var home = require('os-homedir')
var mkdirp = require('mkdirp')

var config

exports.get = function (name) {
  return name
    ? config[name]
    : config
}

exports.set = function (name, value) {
  config[name] = value
  exports._save()
}

exports.unset = function (name) {
  delete config[name]
  exports._save()
}

exports.replace = function (newConfig) {
  config = newConfig
  exports._save()
}

exports.merge = function (newConfig) {
  _.merge(config, newConfig)
  exports._save()
}

exports._save = function () {
  fs.writeFileSync(exports.getPath(), JSON.stringify(config, null, 2))
}

exports.getPath = _.memoize(function () {
  var configDir = envPaths('greenkeeper', {suffix: ''}).config
  mkdirp.sync(configDir)
  return path.join(configDir, '.greenkeeperrc')
})

var readConfig = _.flow(fs.readFileSync, JSON.parse)
try {
  // If config exists at the old path use and migrate it
  var oldPath = path.join(home(), '.greenkeeperrc')
  config = readConfig(oldPath)
  exports._save()
  fs.unlinkSync(oldPath)
} catch (e) {
  try {
    // Use XDG environment variable and fallback to OS default
    config = readConfig(exports.getPath())
  } catch (e) {
    // No prior config
    config = {}
  }
}
