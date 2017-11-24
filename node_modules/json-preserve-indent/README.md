# json-preserve-indent

[![Build Status](https://travis-ci.org/boennemann/json-preserve-indent.svg?branch=master)](https://travis-ci.org/boennemann/json-preserve-indent)
[![Coverage Status](https://coveralls.io/repos/boennemann/json-preserve-indent/badge.svg?branch=master&service=github)](https://coveralls.io/github/boennemann/json-preserve-indent?branch=master)
[![Dependency Status](https://david-dm.org/boennemann/json-preserve-indent/master.svg)](https://david-dm.org/boennemann/json-preserve-indent/master)
[![devDependency Status](https://david-dm.org/boennemann/json-preserve-indent/master/dev-status.svg)](https://david-dm.org/boennemann/json-preserve-indent/master#info=devDependencies)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![NPM](https://nodei.co/npm/json-preserve-indent.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/json-preserve-indent/)

> read from, write to and return a JSON string, minimizing diffs and preserving indents/fileending

```js
var jsonPreserveIndent = require('json-preserve-indent')

var thing = jsonPreserveIndent('{\n\t"foo": {\n\t\t"bar": "baz"\n\t}\n}\n')

thing.get('foo.bar')
// baz
thing.set('foo.bar', 'boo')
thing.format()
// {\n\t"foo": {\n\t\t"bar": "boo"\n\t}\n}\n
```

Based on [json-file-plus](https://www.npmjs.com/package/json-file-plus), but without the filesystem parts.
