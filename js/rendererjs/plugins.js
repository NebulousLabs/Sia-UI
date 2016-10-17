// This module handles the construction of Sia-UI plugins.
import { List } from 'immutable'
import Path from 'path'
import fs from 'fs'
import { remote } from 'electron'

const devtoolsShortcut = 'Ctrl+Shift+P'

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
	elem.preload = './dist/pluginapi.js'
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
	remote.globalShortcut.unregister(devtoolsShortcut)
	remote.globalShortcut.register(devtoolsShortcut, () => {
		viewElem.openDevTools()
	})
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
export const getPluginName = (pluginPath) => Path.basename(pluginPath)

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

// unloadPlugins removes the mainbar and the sidebar from the document.
export const unloadPlugins = () => {
	const mainbar = document.getElementById('mainbar')
	const sidebar = document.getElementById('sidebar')
	mainbar.parentNode.removeChild(mainbar)
	sidebar.parentNode.removeChild(sidebar)
}

// Scan a folder at `path` for plugins.
// Return a list of folder paths that have a valid plugin structure.
export const scanFolder = (path) => {
	let pluginFolders = List(fs.readdirSync(path))
	pluginFolders = pluginFolders.map((folder) => Path.join(path, folder))
	pluginFolders = pluginFolders.filter((pluginPath) => {
		const markupPath = Path.join(pluginPath, 'index.html')
		try {
			fs.statSync(markupPath)
			return true
		} catch (e) {
			console.error('plugin ' + pluginPath + ' has an invalid structure')
		}
		return false
	})
	return pluginFolders
}

// Scan a folder at path and return an ordered list of plugins.
// The plugin specified by `homePlugin` is always moved to the top of the list,
// if it exists.
export const getOrderedPlugins = (path, homePlugin) => {
	let plugins = scanFolder(path)

	// Push the Terminal plugin to the bottom
	plugins = plugins.sort((p1) => {
		if (getPluginName(p1) === 'Terminal') {
			return 1
		}
		return 0
	})

	// Push the About plugin to the bottom
	plugins = plugins.sort((p1) => {
		if (getPluginName(p1) === 'About') {
			return 1
		}
		return 0
	})

	// Push the home plugin to the top
	plugins = plugins.sort((p1) => {
		if (getPluginName(p1) === homePlugin) {
			return -1
		}
		return 0
	})

	return plugins
}

