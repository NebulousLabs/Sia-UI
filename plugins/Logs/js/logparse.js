import fs from 'fs'
import { readdirRecursive } from './utils.js'

const siadir = SiaAPI.config.siad.datadir

const fileSize = (logpath) =>
	fs.statSync(logpath).size

// cleanLog removes partial lines.
export const cleanLog = (logtext) =>
	logtext.split('\n').slice(1).join('\n')

const defaultNBytes = 512

// readLog takes a log path and returns a string representing the log data.
export const readLog = (logpath, start = 0, nbytes) => {
	const bytes = nbytes || fileSize(logpath)
	const len = bytes - start
	const buf = new Buffer(len)
	const fd = fs.openSync(logpath, 'r')
	fs.readSync(fd, buf, 0, len, start)

	return cleanLog(buf.toString())
}

// parseLogs takes a sia directory and an array of log name filters to match,
// and returns a concatenated, sorted log string composed of every log that
// matched inside the sia directory.
export const parseLogs = (datadir, namefilters = ['.log']) =>
	readdirRecursive(datadir)
		.filter((file) => namefilters.reduce((matches, filtername) => matches || file.includes(filtername), false))
		.map(readLog)
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

