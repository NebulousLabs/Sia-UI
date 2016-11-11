import fs from 'fs'
import { readdirRecursive } from './utils.js'

const siadir = SiaAPI.config.siad.datadir

// parseLogs takes a sia directory and an array of log name filters to match,
// and returns a concatenated, sorted log string composed of every log that
// matched inside the sia directory.
export const parseLogs = (datadir, namefilters = ['.log']) =>
	readdirRecursive(datadir)
		.filter((file) => namefilters.reduce((matches, filtername) => matches || file.includes(filtername), false))
		.map((log) => fs.readFileSync(log, 'utf8'))
		.join('')
		.split('\n').sort().join('\n')

// updateLogFilters updates the log plugin's state using the set of filters
// passed in to `filters`.
export const updateLogFilters = (state, filters) =>
	state.set('logFilters', filters)
	     .set('logText', parseLogs(siadir, filters))

// addLogFilters adds an array of filters.
export const addLogFilters = (state, filters) =>
	updateLogFilters(state, state.get('logFilters').union(filters))

// removeLogFilters removes an array of filters.
export const removeLogFilters = (state, filters) =>
	updateLogFilters(state, state.get('logFilters').subtract(filters))

