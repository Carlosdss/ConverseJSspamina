"use strict";

// Converse.js (A browser based XMPP chat client)
// http://conversejs.org
//
// Copyright (c) 2012-2017, Jan-Carel Brand <jc@opkode.com>
// Licensed under the Mozilla Public License (MPLv2)
//

/* This is a Converse.js plugin which add support for XEP-0030: Service Discovery */

/*global Backbone, define, window, document */
(function (root, factory) {
    define(["converse-core", "sizzle", "strophe.disco"], factory);
})(undefined, function (converse, sizzle) {
    var _converse$env = converse.env,
        Backbone = _converse$env.Backbone,
        Promise = _converse$env.Promise,
        Strophe = _converse$env.Strophe,
        b64_sha1 = _converse$env.b64_sha1,
        _ = _converse$env._;


    converse.plugins.add('converse-disco', {
        initialize: function initialize() {
            /* The initialize function gets called as soon as the plugin is
             * loaded by converse.js's plugin machinery.
             */
            var _converse = this._converse;


            function onDiscoItems(stanza) {
                _.each(stanza.querySelectorAll('query item'), function (item) {
                    if (item.getAttribute("node")) {
                        // XXX: ignore nodes for now.
                        // See: https://xmpp.org/extensions/xep-0030.html#items-nodes
                        return;
                    }
                    var jid = item.getAttribute('jid');
                    var entities = _converse.disco_entities;
                    if (_.isUndefined(entities.get(jid))) {
                        entities.create({ 'jid': jid });
                    }
                });
            }

            // Promises exposed by this plugin
            _converse.api.promises.add('discoInitialized');

            _converse.DiscoEntity = Backbone.Model.extend({
                /* A Disco Entity is a JID addressable entity that can be queried
                * for features.
                *
                * See XEP-0030: https://xmpp.org/extensions/xep-0030.html
                */
                idAttribute: 'jid',

                initialize: function initialize() {
                    this.features = new Backbone.Collection();
                    this.features.browserStorage = new Backbone.BrowserStorage[_converse.storage](b64_sha1("converse.features-" + this.get('jid')));
                    this.features.on('add', this.onFeatureAdded);

                    this.identities = new Backbone.Collection();
                    this.identities.browserStorage = new Backbone.BrowserStorage[_converse.storage](b64_sha1("converse.identities-" + this.get('jid')));
                    this.fetchFeatures();
                },
                onFeatureAdded: function onFeatureAdded(feature) {
                    _converse.emit('serviceDiscovered', feature);
                },
                fetchFeatures: function fetchFeatures() {
                    if (this.features.browserStorage.records.length === 0) {
                        this.queryInfo();
                    } else {
                        this.features.fetch({ add: true });
                        this.identities.fetch({ add: true });
                    }
                },
                queryInfo: function queryInfo() {
                    _converse.connection.disco.info(this.get('jid'), null, this.onInfo.bind(this));
                },
                queryForItems: function queryForItems() {
                    if (_.isEmpty(this.identities.where({ 'category': 'server' }))) {
                        // Don't fetch features and items if this is not a
                        // server or a conference component.
                        return;
                    }
                    _converse.connection.disco.items(this.get('jid'), null, onDiscoItems);
                },
                onInfo: function onInfo(stanza) {
                    var _this = this;

                    _.forEach(stanza.querySelectorAll('identity'), function (identity) {
                        _this.identities.create({
                            'category': identity.getAttribute('category'),
                            'type': stanza.getAttribute('type'),
                            'name': stanza.getAttribute('name')
                        });
                    });
                    if (stanza.querySelector('feature[var="' + Strophe.NS.DISCO_ITEMS + '"]')) {
                        this.queryForItems();
                    }
                    _.forEach(stanza.querySelectorAll('feature'), function (feature) {
                        _this.features.create({
                            'var': feature.getAttribute('var'),
                            'from': stanza.getAttribute('from')
                        });
                    });
                    this.trigger('featuresDiscovered');
                }
            });

            _converse.DiscoEntities = Backbone.Collection.extend({
                model: _converse.DiscoEntity,

                initialize: function initialize() {
                    this.browserStorage = new Backbone.BrowserStorage[_converse.storage](b64_sha1("converse.disco-entities-" + _converse.bare_jid));
                    this.fetchEntities().then(_.partial(_converse.emit, 'discoInitialized'), _.partial(_converse.emit, 'discoInitialized')).catch(_.partial(_converse.log, _, Strophe.LogLevel.FATAL));
                },
                fetchEntities: function fetchEntities() {
                    var _this2 = this;

                    return new Promise(function (resolve, reject) {
                        _this2.fetch({
                            add: true,
                            success: function (collection) {
                                if (collection.length === 0 || !collection.get(_converse.domain)) {
                                    this.create({ 'jid': _converse.domain });
                                }
                                resolve();
                            }.bind(_this2),
                            error: function error() {
                                reject(new Error("Could not fetch disco entities"));
                            }
                        });
                    });
                }
            });

            function addClientFeatures() {
                /* The strophe.disco.js plugin keeps a list of features which
                 * it will advertise to any #info queries made to it.
                 *
                 * See: http://xmpp.org/extensions/xep-0030.html#info
                 */

                // See http://xmpp.org/registrar/disco-categories.html
                _converse.connection.disco.addIdentity('client', 'web', 'Converse.js');

                _converse.connection.disco.addFeature(Strophe.NS.BOSH);
                _converse.connection.disco.addFeature(Strophe.NS.CHATSTATES);
                _converse.connection.disco.addFeature(Strophe.NS.DISCO_INFO);
                _converse.connection.disco.addFeature(Strophe.NS.ROSTERX); // Limited support
                if (_converse.message_carbons) {
                    _converse.connection.disco.addFeature(Strophe.NS.CARBONS);
                }
                _converse.emit('addClientFeatures');
                return this;
            }

            function initializeDisco() {
                addClientFeatures();
                _converse.disco_entities = new _converse.DiscoEntities();
            }
            _converse.api.listen.on('reconnected', initializeDisco);
            _converse.api.listen.on('connected', initializeDisco);

            _converse.api.listen.on('beforeTearDown', function () {
                if (_converse.disco_entities) {
                    _converse.disco_entities.each(function (entity) {
                        entity.features.reset();
                        entity.features.browserStorage._clear();
                    });
                    _converse.disco_entities.reset();
                    _converse.disco_entities.browserStorage._clear();
                }
            });
        }
    });
});
//# sourceMappingURL=converse-disco.js.map