// Helper functions for the Files sagas.
import { List, Map } from 'immutable'
import BigNumber from 'bignumber.js'
import Path from 'path'
import fs from 'fs'

export const sendError = (e) => {
	SiaAPI.showError({
		title: 'Sia-UI Files Error',
		content: e.toString(),
	})
}

// siadCall: promisify Siad API calls.  Resolve the promise with `response` if the call was successful,
// otherwise reject the promise with `err`.
export const siadCall = (uri) => new Promise((resolve, reject) => {
	SiaAPI.call(uri, (err, response) => {
		if (err) {
			reject(err)
		} else {
			resolve(response)
		}
	})
})

// return a list of files filtered with path.
// ... it's ls.
export const ls = (files, path) => {
	let fileList = files.filter((file) => file.uploadprogress >= 100)
	fileList = fileList.filter((file) => file.siapath.indexOf(path) !== -1)
	let parsedFiles = Map()
	fileList.forEach((file) => {
		let type = 'file'
		const relativePath = file.siapath.substring(path.length, file.siapath.length)
		let filename = Path.basename(relativePath)
		let uploadprogress = Math.floor(file.uploadprogress)
		if (relativePath.indexOf('/') !== -1) {
			type = 'directory'
			filename = relativePath.split('/')[0]
			uploadprogress = ''
		}
		parsedFiles = parsedFiles.set(filename, {
			size: file.filesize,
			name: filename,
			siapath: file.siapath,
			available: file.available,
			uploadprogress: uploadprogress,
			type,
		})
	})
	return parsedFiles.toList().sortBy((file) => file.name)
}

// recursively version of readdir
const readdirRecursive = (path, files) => {
	const dirfiles = fs.readdirSync(path)
	let filelist
	if (typeof files === 'undefined') {
		filelist = List()
	} else {
		filelist = files
	}
	dirfiles.forEach((file) => {
		const filepath = Path.join(path, file)
		const stat = fs.statSync(filepath)
		if (stat.isDirectory()) {
			filelist = readdirRecursive(filepath, filelist)
		} else if (stat.isFile()) {
			filelist = filelist.push(filepath)
		}
	})
	return filelist
}

// Parse a response from `/renter/downloads`
// return a list of file downloads
export const parseDownloads = (since, downloads) => {
	let parsedDownloads = List(downloads).filter((download) => Date.parse(download.starttime) > since)
	parsedDownloads = parsedDownloads.map((download) => ({
		siapath: download.siapath,
		name: Path.basename(download.siapath),
		progress: Math.floor((download.received / download.filesize) * 100),
		destination: download.destination,
		type: 'download',
		starttime: download.starttime,
	}))
	return parsedDownloads.sortBy((download) => -download.starttime)
}

// Parse a list of files from `/renter/files`
// return a list of file uploads
export const parseUploads = (files) => {
	let parsedUploads = List(files).filter((file) => file.uploadprogress < 100)
	parsedUploads = parsedUploads.map((upload) => ({
		siapath: upload.siapath,
		name: Path.basename(upload.siapath),
		progress: Math.floor(upload.uploadprogress),
		type: 'upload',
	}))
	return parsedUploads.sortBy((upload) => upload.name).sortBy((upload) => -upload.progress)
}

// Search `files` for `text`, excluding directories not in `path`
export const searchFiles = (files, text, path) => {
	let matchingFiles = List(files).filter((file) => file.siapath.indexOf(path) !== -1)
	matchingFiles = matchingFiles.filter((file) => file.uploadprogress >= 100)
	matchingFiles = matchingFiles.filter((file) => file.siapath.toLowerCase().indexOf(text.toLowerCase()) !== -1)
	return matchingFiles.map((file) => ({
		size: file.filesize,
		name: Path.basename(file.siapath),
		siapath: file.siapath,
		available: file.available,
		type: 'file',
		uploadprogress: Math.floor(file.uploadprogress).toString(),
	}))
}

const bytesPerGB = new BigNumber('1000000000')

// Compute the estimated price given a List of hosts, size to store, and duration.
// `duration` is in blocks, size is in GB.
// returns a `BigNumber` representing the average number of Siacoins per GB per duration
export const estimatedStoragePriceGBSC = (hosts, size, duration) => {
	const nhosts = 36
	let storagePrices = List(hosts).map((host) => new BigNumber(host.storageprice))

	// Take the 36 cheapest hosts from the list
	storagePrices = storagePrices.sort((p1, p2) => {
		if (p2.greaterThan(p1)) {
			return -1
		}
		if (p2.lessThan(p1)) {
			return 1
		}
		return 0
	}).take(nhosts)

	// Sum and average the storage prices
	const averagePricePerByteBlockH = storagePrices.reduce((sum, price) => sum.add(price), new BigNumber(0)).dividedBy(4)
	const averagePricePerGBBlockH = averagePricePerByteBlockH.times(bytesPerGB)
	const averagePricePerGBBlockSC = SiaAPI.hastingsToSiacoins(averagePricePerGBBlockH)

	return averagePricePerGBBlockSC.times(size).times(duration)
}
