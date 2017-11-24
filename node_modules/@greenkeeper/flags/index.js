var url = require('url')

var _ = require('lodash')
var nerfDart = require('nerf-dart')
var nopt = require('nopt')

var rc = require('@greenkeeper/rc')

// Available flags and their type definitions
var types = {
  api: String,
  help: Boolean,
  organization: String,
  postpublish: Boolean,
  private: Boolean,
  slug: String,
  version: Boolean,
  admin: Boolean,
  loglevel: [
    'error',
    'http',
    'info',
    'silent',
    'silly',
    'verbose',
    'warn'
  ]
}

// Flag objects from different sources
// 1. defaults flags
// 2. rcfile flags
// 3. nerfDarted rcfile flags (i.e. scoped by api endpoint)
// 4. cli flags

var defaults = {
  api: 'https://api.greenkeeper.io/',
  postpublish: true
}

var rcFlags = rc.get()

var cliFlags = nopt(types, {
  h: '--help',
  usage: '--help',
  v: '--version',
  s: ['--loglevel', 'silent'],
  d: ['--loglevel', 'info'],
  dd: ['--loglevel', 'verbose'],
  ddd: ['--loglevel', 'silly'],
  silent: ['--loglevel', 'silent'],
  verbose: ['--loglevel', 'verbose'],
  quiet: ['--loglevel', 'warn']
})

var api = url.parse(cliFlags.api || rcFlags.api || defaults.api).format()
var prefix = nerfDart(api)

var nerfDartFlags = _(rcFlags)
.pickBy(function (flag, flagName) {
  return flagName.slice(0, prefix.length) === prefix
})
.mapKeys(function (flag, flagName) {
  return flagName.replace(prefix, '')
})
.value()

var flags = module.exports = _.assign({}, defaults, rcFlags, nerfDartFlags, cliFlags)
nopt.clean(flags, types)

flags.api = api
flags._rc = rc
