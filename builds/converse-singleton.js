"use strict";

// Converse.js (A browser based XMPP chat client)
// http://conversejs.org
//
// Copyright (c) 2012-2017, JC Brand <jc@opkode.com>
// Licensed under the Mozilla Public License (MPLv2)
//
/*global Backbone, define, window, document, JSON */

/* converse-singleton
/* ******************
 *
 * A non-core plugin which ensures that only one chat, private or group, is
 * visible at any one time. All other ongoing chats are hidden and kept in the
 * background.
 *
 * This plugin makes sense in mobile or fullscreen chat environments.
 */
(function (root, factory) {
    define(["converse-core", "converse-chatview"], factory);
})(undefined, function (converse) {
    "use strict";

    var _converse$env = converse.env,
        _ = _converse$env._,
        Strophe = _converse$env.Strophe;


    function hideChat(view) {
        if (view.model.get('id') === 'controlbox') {
            return;
        }
        view.model.save({ 'hidden': true });
        view.hide();
    }

    converse.plugins.add('converse-singleton', {
        // It's possible however to make optional dependencies non-optional.
        // If the setting "strict_plugin_dependencies" is set to true,
        // an error will be raised if the plugin is not found.
        //
        // NB: These plugins need to have already been loaded via require.js.
        optional_dependencies: ['converse-muc', 'converse-controlbox', 'converse-rosterview'],

        overrides: {
            // overrides mentioned here will be picked up by converse.js's
            // plugin architecture they will replace existing methods on the
            // relevant objects or classes.
            //
            // new functions which don't exist yet can also be added.

            ChatBoxes: {
                createChatBox: function createChatBox(jid, attrs) {
                    /* Make sure new chat boxes are hidden by default.
                     */
                    attrs = attrs || {};
                    attrs.hidden = true;
                    return this.__super__.createChatBox.call(this, jid, attrs);
                }
            },

            RoomsPanel: {
                parseRoomDataFromEvent: function parseRoomDataFromEvent(ev) {
                    /* We set hidden to false for rooms opened manually by the
                     * user. They should always be shown.
                     */
                    var result = this.__super__.parseRoomDataFromEvent.apply(this, arguments);
                    if (_.isUndefined(result)) {
                        return;
                    }
                    result.hidden = false;
                    return result;
                }
            },

            ChatBoxViews: {
                showChat: function showChat(attrs, force) {
                    /* We only have one chat visible at any one
                     * time. So before opening a chat, we make sure all other
                     * chats are hidden.
                     */
                    var _converse = this.__super__._converse;

                    var chatbox = this.getChatBox(attrs, true);
                    var hidden = _.isUndefined(attrs.hidden) ? chatbox.get('hidden') : attrs.hidden;
                    if ((force || !hidden) && _converse.connection.authenticated) {
                        _.each(_converse.chatboxviews.xget(chatbox.get('id')), hideChat);
                        chatbox.save({ 'hidden': false });
                    }
                    return this.__super__.showChat.apply(this, arguments);
                }
            },

            ChatBoxView: {
                _show: function _show(focus) {
                    /* We only have one chat visible at any one
                     * time. So before opening a chat, we make sure all other
                     * chats are hidden.
                     */
                    if (!this.model.get('hidden')) {
                        _.each(this.__super__._converse.chatboxviews.xget(this.model.get('id')), hideChat);
                        return this.__super__._show.apply(this, arguments);
                    }
                }
            },

            RosterContactView: {
                openChat: function openChat(ev) {
                    /* We only have one chat visible at any one
                     * time. So before opening a chat, we make sure all other
                     * chats are hidden.
                     */
                    _.each(this.__super__._converse.chatboxviews.xget('controlbox'), hideChat);
                    this.model.save({ 'hidden': false });
                    return this.__super__.openChat.apply(this, arguments);
                }
            }
        }
    });
});
//# sourceMappingURL=converse-singleton.js.map