var _ = require('lodash')

module.exports = function (raw) {
  var rawJSON = String(raw)
  var ending = _.get(rawJSON.match(/}(\s*)$/), 1)
  var indent = _.get(rawJSON.match(/^[ \t]+/m), 0)

  var data = JSON.parse(rawJSON)

  return {
    data: data,
    get: _.bind(_.get, _, data),
    set: _.bind(_.set, _, data),
    format: function () {
      return JSON.stringify(data, null, indent) + ending
    }
  }
}
