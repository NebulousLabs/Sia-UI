import fs from 'graceful-fs'
import { List } from 'immutable'
import Path from 'path'

export const readdirRecursive = (dir, files = List()) => {
	const dirfiles = fs.readdirSync(dir)
	let filelist = files
	dirfiles.forEach((file) => {
		const filepath = Path.join(dir, file)
		const stat = fs.statSync(filepath)
		if (stat.isDirectory()) {
			filelist = readdirRecursive(filepath, filelist)
		} else if (stat.isFile()) {
			filelist = filelist.push(filepath)
		}
	})
	return filelist
}

