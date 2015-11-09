'use strict';
// Plugin Factory namespace to hold plugin creation logic
var Factory = require('./pluginFactory');

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
	var view = new Factory.view(Path.join(plugPath, name, 'index.html'), name);
	/**
	 * Html element for the sidebar button
	 * @member {Object} Plugin~button
	 */
	var button = new Factory.button(Path.join(plugPath, name, 'assets', 'button.png'), name);

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
		* Shows the plugin's view
		* @function Plugin#show
		*/
		show: function() {
			button.classList.add('current');
			view.executeJavaScript('if (typeof start === "function") start();');
			setTimeout(function() {
				view.style.opacity = '1';
				view.style.zIndex= '0';
			}, 170);
		},

		/** 
		* Hides the plugin's view
		* @function Plugin#hide
		*/
		hide: function() {
			button.classList.remove('current');
			view.executeJavaScript('if (typeof stop === "function") stop();');
			setTimeout(function() {
				view.style.opacity = '0';
				view.style.zIndex= '-5';
			}, 170);
		},

		/**
		* For communicating ipc messages with the plugin's webview, while still
		* keeping it private to plugin
		* @function Plugin#sendToView
		* @param {string} channel - ipc channel to communicate over
		* @param {...*} messages - ipc messages sent over channel to view
		*/
		sendToView: function() {
			// https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
			var args = new Array(arguments.length);
			for(var i = 0; i < args.length; ++i) {
				args[i] = arguments[i];
			}
			view.send.apply(view, args);
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
		/**
		* If the webview is loading
		* @function Plugin#isLoading
		*/
		isLoading: function() {
			return view.isLoading();
		},

	};
}
module.exports = Plugin;
