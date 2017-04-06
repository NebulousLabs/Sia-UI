import fs from 'graceful-fs'
import { readdirRecursive } from './utils.js'

const siadir = SiaAPI.config.siad.datadir

const fileSize = (logpath) => fs.statSync(logpath).size

// cleanLog removes partial lines.
export const cleanLog = (logtext) => logtext.slice(logtext.indexOf('\n') + 1, logtext.lastIndexOf('\n') + 1)

// readLog takes a log path and returns a string representing the log data.
export const readLog = (logpath, nbytes) => {
	const len = (() => {
		const bytes = nbytes || fileSize(logpath)
		return Math.min(bytes, fileSize(logpath))
	})()
	const startPos = Math.max(0, fileSize(logpath) - len)
	const buf = new Buffer(len)
	const fd = fs.openSync(logpath, 'r')

	try {
		fs.readSync(fd, buf, 0, len, startPos)
	} catch (e) {
		console.error(`error reading ${logpath}: ${e.toString()}`)
	}

	return cleanLog(buf.toString())
}

// matchingLogs takes an array of filename filters and returns an array of logs
// matching the filters.
const matchingLogs = (namefilters, datadir) =>
	readdirRecursive(datadir)
		.filter((file) => namefilters.reduce((matches, filtername) => matches || file.includes(filtername), false))

// parseLogs takes a sia directory and an array of log name filters to match,
// and returns a concatenated, sorted log string composed of every log that
// matched inside the sia directory.
export const parseLogs = (datadir, nbytes, namefilters = ['.log']) => {
	const logFiles = matchingLogs(namefilters, datadir)
	const unsortedLogLines = logFiles.map((log) => readLog(log, nbytes))

	// only sort lines if more than one logfile is matched
	if (logFiles.size > 1) {
		return unsortedLogLines.join('').split('\n').sort().join('\n')
	}

	return unsortedLogLines.join('')
}

// updateLogFilters updates the log plugin's state using the set of filters
// passed in to `filters`.
export const updateLogFilters = (state, size, filters) =>
	state.set('logFilters', filters)
	     .set('logSize', size)
	     .set('logText', parseLogs(siadir, size, filters))

// addLogFilters adds an array of filters.
export const addLogFilters = (state, filters) =>
	updateLogFilters(state, state.get('logSize'), state.get('logFilters').union(filters))

// removeLogFilters removes an array of filters.
export const removeLogFilters = (state, filters) => {
	// no-op if remnoval results in no filters
	const newFilters = state.get('logFilters').subtract(filters)
	if (newFilters.size === 0) {
		return state
	}
	return updateLogFilters(state, state.get('logSize'), newFilters)
}

