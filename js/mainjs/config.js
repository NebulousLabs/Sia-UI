import fs from 'fs'
import Path from 'path'
import { app } from 'electron'

// The default settings
const defaultConfig = {
	homePlugin:  'Overview',
	siad: {
		path: Path.join(app.getAppPath(), '../Sia/siad'),
		datadir: Path.join(app.getAppPath(), '../Sia'),
		detached: false,
	},
	closeToTray: process.platform === 'win32' || process.platform === 'darwin' ? true : false,
	width:       800,
	height:      600,
	x:           0,
	y:           0,
}

/**
 * Holds all config.json related logic
 * @module configManager
 */
export default function configManager(filepath) {
	let config

	try {
		// TODO: write load() function instead of global require
		const data = fs.readFileSync(filepath)
		config = JSON.parse(data)
	} catch (err) {
		config = defaultConfig
	}

	/**
	 * Gets or sets a config attribute
	 * @param {object} key - key to get or set
	 * @param {object} value - value to set config[key] as
	 */
	config.attr = function(key, value) {
		if (value !== undefined) {
			config[key] = value
		}
		if (config[key] === undefined) {
			config[key] = null
		}
		return config[key]
	}

	/**
	 * Writes the current config to defaultConfigPath
	 * @param {string} path - UI's defaultConfigPath
	 */
	config.save = function() {
		fs.writeFileSync(filepath, JSON.stringify(config, null, '\t'))
	}

	/**
	 * Sets config to what it was on disk
	 */
	config.reset = function() {
		config = configManager(filepath)
	}

	// Save to disk immediately when loaded
	config.save()
	// Return the config object with the above 3 member functions
	return config
}

