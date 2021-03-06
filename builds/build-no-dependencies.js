"use strict";

({
    baseUrl: "../",
    name: "almond",
    out: "../dist/converse-no-dependencies.min.js",
    include: ["converse"],
    excludeShallow: ["locales", "text!af", "text!de", "text!en", "text!es", "text!fr", "text!he", "text!hu", "text!id", "text!it", "text!ja", "text!nb", "text!nl", "text!pl", "text!pt_BR", "text!ru", "text!uk", "text!zh"],
    exclude: ["awesomplete", "jquery", "jquery.noconflict", "backbone.browserStorage", "backbone.overview", "moment_with_locales", "strophe", "strophe.disco", "strophe.rsm", "strophe.vcard", "strophe.ping", "otr", "lodash", "lodash.converter", "lodash.noconflict"],
    paths: {
        "converse-bookmarks": "builds/converse-bookmarks",
        "converse-chatview": "builds/converse-chatview",
        "converse-controlbox": "builds/converse-controlbox",
        "converse-core": "builds/converse-core",
        "converse-dragresize": "builds/converse-dragresize",
        "converse-headline": "builds/converse-headline",
        "converse-inverse": "builds/converse-inverse",
        "converse-mam": "builds/converse-mam",
        "converse-minimize": "builds/converse-minimize",
        "converse-muc": "builds/converse-muc",
        "converse-muc-embedded": "builds/converse-muc-embedded",
        "converse-notification": "builds/converse-notification",
        "converse-otr": "builds/converse-otr",
        "converse-ping": "builds/converse-ping",
        "converse-register": "builds/converse-register",
        "converse-roomslist": "builds/converse-roomslist",
        "converse-rosterview": "builds/converse-rosterview",
        "converse-singleton": "builds/converse-singleton",
        "converse-vcard": "builds/converse-vcard",
        "utils": "builds/utils"
    },
    wrap: {
        startFile: "start.frag",
        endFile: "end-no-dependencies.frag"
    },
    mainConfigFile: "config.js"
});
//# sourceMappingURL=build-no-dependencies.js.map