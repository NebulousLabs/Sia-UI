// This module handles the construction of Sia-UI plugins.
import { List } from 'immutable'
import Path from 'path'
const remote = require('electron').remote
const fs = remote.require('fs')

// Create an icon element for a plugin button.
const createButtonIconElement = (path) => {
	const i = document.createElement('img')
	i.src = path
	i.className = 'pure-u icon'
	return i
}

// Create a text element for a plugin button.
const createButtonTextElement = (name) => {
	const t = document.createElement('div')
	t.innerText = name
	t.className = 'pure-u text'
	return t
}

// Construct a plugin view element from a plugin path and title
// use webview.preload to inject SiaAPI into the plugin's global namespace.
const createPluginElement = (markupPath, title) => {
	const elem = document.createElement('webview')
	elem.id = title + '-view'
	elem.className = 'webview'
	elem.src = markupPath
	// This is enabled for legacy plugin support.
	elem.nodeintegration = true
	elem.preload = Path.join('file://', Path.resolve('js/rendererjs/pluginapi.js'))
	return elem
}

// Set a plugin as the visible plugin
export const setCurrentPlugin = (pluginName) => {
	const currentElements = document.querySelectorAll('.current')
	for (const elem in currentElements) {
		if (typeof currentElements[elem].classList !== 'undefined') {
			currentElements[elem].classList.remove('current')
		}
	}
	const viewElem = document.getElementById(pluginName + '-view')
	if (viewElem !== null) {
		viewElem.classList.add('current')
	}
	const buttonElem = document.getElementById(pluginName + '-button')
	if (buttonElem !== null) {
		buttonElem.classList.add('current')
	}
}

// Construct a plugin button element from an icon path and title
const createPluginButtonElement = (iconPath, title) => {
	const elem = document.createElement('div')
	elem.id = title + '-button'
	elem.className = 'pure-u-1-1 button'
	elem.appendChild(createButtonIconElement(iconPath))
	elem.appendChild(createButtonTextElement(title))
	// On click, set all other buttons and plugins to non-current except this one.
	elem.onclick = () => setCurrentPlugin(title)
	return elem
}

// Get the name of a plugin from its path.
export const getPluginName = (pluginPath) => pluginPath.substring(pluginPath.lastIndexOf('/') + 1)

// loadPlugin constructs plugin view and plugin button elements
// and adds these elements to the main UI's mainbar/sidebar.
// Returns the plugin's main view element.
export const loadPlugin = (pluginPath) => {
	const name = getPluginName(pluginPath)
	const markupPath = Path.join(pluginPath, 'index.html')
	const iconPath = Path.join(pluginPath, 'assets', 'button.png')

	const viewElement = createPluginElement(markupPath, name)
	const buttonElement = createPluginButtonElement(iconPath, name)

	document.getElementById('sidebar').appendChild(buttonElement)
	document.getElementById('mainbar').appendChild(viewElement)

	return viewElement
}

// Scan a folder at `path` for plugins.
// Return a list of folder paths that have a valid plugin structure.
export const scanFolder = (path) => {
	let pluginFolders = List()
	const unsanitizedFolders = fs.readdirSync(path)
	for (const p in unsanitizedFolders) {
		const pluginPath = Path.join(path, unsanitizedFolders[p])
		try {
			fs.statSync(Path.join(pluginPath, '/index.html'))
		} catch (e) {
			console.error(e)
			continue
		}
		pluginFolders = pluginFolders.push(pluginPath)
	}
	return pluginFolders
}
