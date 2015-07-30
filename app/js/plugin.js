"use strict";
var Factory = require("./pluginFactory");

/**
 * Constructs the webview and button from a plugin folder
 * @class Plugin
 * @param {string} plugPath - The directory of this plugin
 * @param {string} name - The name of the plugin.
 */
function Plugin(plugPath, name) {
	/**
	 * Html element for the webview
	 * @member {Object} Plugin~view
	 */
	var view = new Factory.view(Path.join(plugPath, name, "index.html"), name);
	/**
	 * Html element for the sidebar button
	 * @member {Object} Plugin~button
	 */
	var button = new Factory.button(Path.join(plugPath, name, "assets", "button.png"), name);

	return {
		/**
		* Name of the Plugin
		* @member {string} Plugin#name
		*/
		name: name,
		/**
		* Function executed upon the sidebar button being clicked
		* @member {transition} Plugin#transition
		*/
		transition: function(transition) {
			button.onclick = transition;
		},

		/**
		* Used to interact with the view element in an easy manner.
		* @function Plugin#on
		* @param {string} event - webview event to listen for
		* @param {Object} listener - function to execute upon the event firing
		*/
		on: function(event, listener) {
			view.addEventListener(event, listener);
		},

		/** 
		* Shows the plugin"s view
		* @function Plugin#show
		*/
		show: function() {
			button.classList.add("current");
			view.executeJavaScript('if (typeof init === "function") init();');
			setTimeout(function() {
				view.style.display = "";
			}, 250);
		},

		/** 
		* Hides the plugin"s view
		* @function Plugin#hide
		*/
		hide: function() {
			button.classList.remove("current");
			view.executeJavaScript('if (typeof kill === "function") kill();');
			setTimeout(function() {
				view.style.display = "none";
			}, 250);
		},

		/**
		* For communicating ipc messages with the plugin"s webview, while still
		* keeping it private to plugin
		* @function Plugin#sendToView
		* @param {string} channel - ipc channel to communicate over
		* @param {...*} messages - ipc messages sent over channel to view
		*/
		sendToView: function() {
			view.send.apply(view, [].slice.call(arguments));
		},

		/**
		* Opens or closes the webviews devtools for detailed output viewing
		* @function Plugin#toggleDevTools
		*/
		toggleDevTools: function() {
			if (view.isDevToolsOpened()) {
				view.closeDevTools();
			} else {
				view.openDevTools();
			}
			return;
		},
	};
}
module.exports = Plugin;
