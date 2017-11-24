'use strict';

define(['lodash', 'lodash.converter', 'converse-core'], function (_, lodashConverter, converse) {
    var fp = lodashConverter(_.runInContext());
    converse.env.fp = fp;
    return fp;
});
//# sourceMappingURL=lodash.fp.js.map