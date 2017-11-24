"use strict";

// Converse.js (A browser based XMPP chat client)
// http://conversejs.org
//
// Copyright (c) 2012-2017, Jan-Carel Brand <jc@opkode.com>
// Licensed under the Mozilla Public License (MPLv2)
//
/*global define */

(function (root, factory) {
    define(["converse-core", "strophe.vcard"], factory);
})(undefined, function (converse) {
    "use strict";

    var _converse$env = converse.env,
        Strophe = _converse$env.Strophe,
        _ = _converse$env._,
        moment = _converse$env.moment,
        sizzle = _converse$env.sizzle;


    converse.plugins.add('converse-vcard', {

        overrides: {
            // Overrides mentioned here will be picked up by converse.js's
            // plugin architecture they will replace existing methods on the
            // relevant objects or classes.
            //
            // New functions which don't exist yet can also be added.

            RosterContacts: {
                createRequestingContact: function createRequestingContact(presence) {
                    var _converse = this.__super__._converse;

                    var bare_jid = Strophe.getBareJidFromJid(presence.getAttribute('from'));
                    _converse.getVCard(bare_jid, _.partial(_converse.createRequestingContactFromVCard, presence), function (iq, jid) {
                        _converse.log("Error while retrieving vcard for " + jid, Strophe.LogLevel.ERROR);
                        _converse.createRequestingContactFromVCard(presence, iq, jid);
                    });
                }
            }
        },

        initialize: function initialize() {
            /* The initialize function gets called as soon as the plugin is
             * loaded by converse.js's plugin machinery.
             */
            var _converse = this._converse;

            _converse.api.settings.update({
                use_vcards: true
            });

            _converse.createRequestingContactFromVCard = function (presence, iq, jid, fullname, img, img_type, url) {
                var bare_jid = Strophe.getBareJidFromJid(jid);
                if (!fullname) {
                    var nick_el = sizzle("nick[xmlns=\"" + Strophe.NS.NICK + "\"]", presence);
                    fullname = nick_el.length ? nick_el[0].textContent : bare_jid;
                }
                var user_data = {
                    jid: bare_jid,
                    subscription: 'none',
                    ask: null,
                    requesting: true,
                    fullname: fullname,
                    image: img,
                    image_type: img_type,
                    url: url,
                    vcard_updated: moment().format()
                };
                _converse.roster.create(user_data);
                _converse.emit('contactRequest', user_data);
            };

            _converse.onVCardError = function (jid, iq, errback) {
                var contact = _.get(_converse.roster, jid);
                if (contact) {
                    contact.save({ 'vcard_updated': moment().format() });
                }
                if (errback) {
                    errback(iq, jid);
                }
            };

            _converse.onVCardData = function (jid, iq, callback) {
                var vcard = iq.querySelector('vCard'),
                    img_type = _.get(vcard.querySelector('TYPE'), 'textContent'),
                    img = _.get(vcard.querySelector('BINVAL'), 'textContent'),
                    url = _.get(vcard.querySelector('URL'), 'textContent'),
                    fullname = _.get(vcard.querySelector('FN'), 'textContent');

                if (jid) {
                    var contact = _converse.roster.get(jid);
                    if (contact) {
                        contact.save({
                            'fullname': fullname || _.get(contact, 'fullname', jid),
                            'image_type': img_type,
                            'image': img,
                            'url': url,
                            'vcard_updated': moment().format()
                        });
                    }
                }
                if (callback) {
                    callback(iq, jid, fullname, img, img_type, url);
                }
            };

            _converse.getVCard = function (jid, callback, errback) {
                /* Request the VCard of another user.
                 *
                 * Parameters:
                 *    (String) jid - The Jabber ID of the user whose VCard
                 *      is being requested.
                 *    (Function) callback - A function to call once the VCard is
                 *      returned.
                 *    (Function) errback - A function to call if an error occured
                 *      while trying to fetch the VCard.
                 */
                if (!_converse.use_vcards) {
                    if (callback) {
                        callback(null, jid);
                    }
                } else {
                    _converse.connection.vcard.get(_.partial(_converse.onVCardData, jid, _, callback), jid, _.partial(_converse.onVCardError, jid, _, errback));
                }
            };

            /* Event handlers */
            _converse.on('addClientFeatures', function () {
                if (_converse.use_vcards) {
                    _converse.connection.disco.addFeature(Strophe.NS.VCARD);
                }
            });

            var updateVCardForChatBox = function updateVCardForChatBox(chatbox) {
                if (!_converse.use_vcards || chatbox.model.get('type') === 'headline') {
                    return;
                }
                _converse.api.waitUntil('rosterInitialized').then(function () {
                    var jid = chatbox.model.get('jid'),
                        contact = _converse.roster.get(jid);
                    if (contact && !contact.get('vcard_updated')) {
                        _converse.getVCard(jid, function (iq, jid, fullname, image, image_type, url) {
                            chatbox.model.save({
                                'fullname': fullname || jid,
                                'url': url,
                                'image_type': image_type,
                                'image': image
                            });
                        }, function () {
                            _converse.log("updateVCardForChatBox: Error occured while fetching vcard", Strophe.LogLevel.ERROR);
                        });
                    }
                }).catch(_.partial(_converse.log, _, Strophe.LogLevel.FATAL));
            };
            _converse.on('chatBoxInitialized', updateVCardForChatBox);

            var onContactAdd = function onContactAdd(contact) {
                if (!contact.get('vcard_updated')) {
                    // This will update the vcard, which triggers a change
                    // request which will rerender the roster contact.
                    _converse.getVCard(contact.get('jid'));
                }
            };
            _converse.on('initialized', function () {
                _converse.roster.on("add", onContactAdd);
            });

            _converse.on('statusInitialized', function fetchOwnVCard() {
                if (_converse.xmppstatus.get('fullname') === undefined) {
                    _converse.getVCard(null, // No 'to' attr when getting one's own vCard
                    function (iq, jid, fullname) {
                        _converse.xmppstatus.save({ 'fullname': fullname });
                    });
                }
            });
        }
    });
});
//# sourceMappingURL=converse-vcard.js.map