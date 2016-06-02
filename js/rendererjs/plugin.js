'use strict'

// Plugin Factory namespace to hold plugin creation logic
const Factory = require('./pluginFactory')
// Node module
const Path = require('path')

/**
 * Constructs the webview and button from a plugin folder
 * @class Plugin
 * @param {string} plugPath - The directory of this plugin
 * @param {string} name - The name of the plugin.
 */
function Plugin(plugPath, name) {
	// Html element for the webview
	var view = new Factory.view(Path.join(plugPath, name, 'index.html'), name)
	// Html element for the sidebar button
	var button = new Factory.button(Path.join(plugPath, name, 'assets', 'button.png'), name)

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
			button.onclick = transition
		},

		/**
		 * Used to interact with the view element in an easy manner.
		 * @function Plugin#on
		 * @param {string} event - webview event to listen for
		 * @param {Object} listener - function to execute upon the event firing
		 */
		on: function(event, listener) {
			view.addEventListener(event, listener)
		},

		/**
		 * Shows the plugin's view
		 * @function Plugin#show
		 */
		show: function() {
			button.classList.add('current')
			view.send('shown')
			setTimeout(() => {
				view.classList.add('current')
			}, 170)
		},

		/**
		 * Hides the plugin's view
		 * @function Plugin#hide
		 */
		hide: function() {
			button.classList.remove('current')
			view.send('hidden')
			setTimeout(() => {
				view.classList.remove('current')
			}, 170)
		},

		/**
		 * For communicating ipc messages with the plugin's webview, while still
		 * keeping it private to plugin
		 * @function Plugin#sendToView
		 * @param {string} channel - ipc channel to communicate over
		 * @param {...*} messages - ipc messages sent over channel to view
		 */
		sendToView: function() {
			view.send(...arguments)
		},

		/**
		 * Opens or closes the webviews devtools for detailed output viewing
		 * @function Plugin#toggleDevTools
		 */
		toggleDevTools: function() {
			if (view.isDevToolsOpened()) {
				view.closeDevTools()
			} else {
				view.openDevTools()
			}
		},

		/**
		 * Return if the webview is loading
		 * @function Plugin#isLoading
		 */
		isLoading: function() {
			return view.isLoading()
		},

		/**
		 * Execute javascript in webview page (mostly for testing purposes)
		 * Can only send string javascript
		 * @param {function} fun - function to be executed in view context
		 */
		execute: function(fun) {
			process.nextTick(() => {
				view.executeJavaScript(fun)
			})
		},
	}
}
module.exports = Plugin
