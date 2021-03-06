"use strict";

// Converse.js (A browser based XMPP chat client)
// http://conversejs.org
//
// Copyright (c) 2012-2017, Jan-Carel Brand <jc@opkode.com>
// Licensed under the Mozilla Public License (MPLv2)
//
/*global define */

/* This is a Converse.js plugin which add support for application-level pings
 * as specified in XEP-0199 XMPP Ping.
 */
(function (root, factory) {
    define(["converse-core", "strophe.ping"], factory);
})(undefined, function (converse) {
    "use strict";
    // Strophe methods for building stanzas

    var _converse$env = converse.env,
        Strophe = _converse$env.Strophe,
        _ = _converse$env._;


    converse.plugins.add('converse-ping', {
        initialize: function initialize() {
            /* The initialize function gets called as soon as the plugin is
             * loaded by converse.js's plugin machinery.
             */
            var _converse = this._converse;


            _converse.api.settings.update({
                ping_interval: 180 //in seconds
            });

            _converse.ping = function (jid, success, error, timeout) {
                // XXX: We could first check here if the server advertised that
                // it supports PING.
                // However, some servers don't advertise while still keeping the
                // connection option due to pings.
                //
                // var feature = _converse.disco_entities[_converse.domain].features.findWhere({'var': Strophe.NS.PING});
                _converse.lastStanzaDate = new Date();
                if (_.isNil(jid)) {
                    jid = Strophe.getDomainFromJid(_converse.bare_jid);
                }
                if (_.isUndefined(timeout)) {
                    timeout = null;
                }
                if (_.isUndefined(success)) {
                    success = null;
                }
                if (_.isUndefined(error)) {
                    error = null;
                }
                if (_converse.connection) {
                    _converse.connection.ping.ping(jid, success, error, timeout);
                    return true;
                }
                return false;
            };

            _converse.pong = function (ping) {
                _converse.lastStanzaDate = new Date();
                _converse.connection.ping.pong(ping);
                return true;
            };

            _converse.registerPongHandler = function () {
                if (!_.isUndefined(_converse.connection.disco)) {
                    _converse.connection.disco.addFeature(Strophe.NS.PING);
                }
                _converse.connection.ping.addPingHandler(_converse.pong);
            };

            _converse.registerPingHandler = function () {
                _converse.registerPongHandler();
                if (_converse.ping_interval > 0) {
                    _converse.connection.addHandler(function () {
                        /* Handler on each stanza, saves the received date
                         * in order to ping only when needed.
                         */
                        _converse.lastStanzaDate = new Date();
                        return true;
                    });
                    _converse.connection.addTimedHandler(1000, function () {
                        var now = new Date();
                        if (!_converse.lastStanzaDate) {
                            _converse.lastStanzaDate = now;
                        }
                        if ((now - _converse.lastStanzaDate) / 1000 > _converse.ping_interval) {
                            return _converse.ping();
                        }
                        return true;
                    });
                }
            };

            var onConnected = function onConnected() {
                // Wrapper so that we can spy on registerPingHandler in tests
                _converse.registerPingHandler();
            };
            _converse.on('connected', onConnected);
            _converse.on('reconnected', onConnected);
        }
    });
});
//# sourceMappingURL=converse-ping.js.map