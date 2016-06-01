import { webFrame } from 'electron'
/**
 * Creates the image element for a button
 * @param {string} path - The path to the icon.
 * @private
 * @returns {Object} - The button image element
 */
function icon(path) {
	var i = document.createElement('img')
	i.src = path
	i.className = 'pure-u icon'
	return i
}

/**
 * Creates the text element for a button
 * @param {string} name - The name of the plugin.
 * @private
 * @returns {Object} - The button text element
 */
function text(name) {
	var t = document.createElement('div')
	t.innerText = name
	t.className = 'pure-u text'
	return t
}

/**
 * Gives plugin.js the functions to make its components
 * @module PluginFactory
 */
module.exports = {
	/**
	 * Creates the webview to be put on the mainbar
	 * @param {string} markupPath - The directory of the index.html
	 * @param {string} name - The name of the plugin.
	 * @returns {Object} - The webview element
	 */
	view: function view(markupPath, name) {
		// Make webview element
		var v = document.createElement('webview')
		v.id = name + '-view'
		v.className = 'webview'
		v.src = markupPath

		// Turn nodeintegration on so plugins can use electron & node libraries
		v.nodeintegration = 'on'

		// Have all plugins displaying UI's zoom by default
		v.addEventListener('dom-ready', () => {
			var zoomCode = 'require("electron").webFrame.setZoomFactor(' + webFrame.getZoomFactor() + ');'
			v.executeJavaScript(zoomCode)
		})

		// Start loading the view to the mainbar
		document.getElementById('mainbar').appendChild(v)
		return v
	},
	/**
	 * Creates the button to be put on the sidebar
	 * @param {string} iconPath - The directory of the button.png
	 * @param {string} name - The name of the plugin.
	 * @returns {Object} - The button element
	 */
	button: function button(iconPath, name) {
		// Make button elements and combine
		var b = document.createElement('div')
		b.appendChild(icon(iconPath))
		b.appendChild(text(name))

		// Set inner values
		b.id = name + '-button'
		b.className = 'pure-u-1-1 button'

		// Add the button to the sidebar
		document.getElementById('sidebar').appendChild(b)
		return b
	},
}
