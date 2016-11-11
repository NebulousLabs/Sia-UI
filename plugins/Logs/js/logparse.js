import fs from 'fs'
import { readdirRecursive } from './utils.js'

// parseLogs takes a List of log files and returns a single string representing
// the concatenation of each log filtered with `filter`.
export const parseLogs = (logs) =>
	logs.map((log) => fs.readFileSync(log, 'utf8'))
			.join('')
			.split('\n').sort().join('\n')

// findLogs takes a siadirectory and returns a list of logfiles inside the
// directory.
export const findLogs = (siadir, namefilters = ['.log']) =>
	readdirRecursive(siadir)
		.filter((file) => namefilters.reduce((matches, filtername) => matches || file.includes(filtername), false))
