// Helper functions for the Files sagas.
import { List, Map } from 'immutable'
import BigNumber from 'bignumber.js'
import Path from 'path'
import fs from 'fs'

export const blockMonth = 4320
export const allowanceMonths = 3
export const allowanceHosts = 24
export const allowancePeriod = blockMonth*allowanceMonths
export const ncontracts = 24
export const baseRedundancy = 6
export const baseFee = 240
export const siafundRate = 0.12

export const sendError = (e) => {
	SiaAPI.showError({
		title: 'Sia-UI Files Error',
		content: e.message,
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

// totalSpending takes an allowance, and a list of contracts returned from the
// API and returns the total that the user has spent out of their allowance,
// including fees. Allowance should be a bignumber of SC.
export const totalSpending = (allowance, contracts) => {
	const totalRenterPayouts = contracts.reduce((sum, contract) => sum.plus(SiaAPI.hastingsToSiacoins(contract.renterfunds)), new BigNumber(0))
	let spending = allowance.minus(totalRenterPayouts)
	if (spending.lt(0)) {
		spending = new BigNumber(0)
	}
	return spending
}

// Take a number of bytes and return a sane, human-readable size.
export const readableFilesize = (bytes) => {
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
	let readableunit = 'B'
	let readablesize = bytes
	for (const unit in units) {
		if (readablesize < 1000) {
			readableunit = units[unit]
			break
		}
		readablesize /= 1000
	}
	return readablesize.toFixed().toString() + ' ' + readableunit
}

// return a list of files filtered with path.
// ... it's ls.
export const ls = (files, path) => {
	const fileList = files.filter((file) => file.available)
	                      .filter((file) => file.siapath.indexOf(path) !== -1)
	let parsedFiles = Map()
	fileList.forEach((file) => {
		let type = 'file'
		const relativePath = Path.relative(path, file.siapath)
		let filename = Path.basename(relativePath)
		if (parsedFiles.has(filename)) {
			return
		}
		const uploadprogress = Math.floor(file.uploadprogress)
		let siapath = file.siapath
		let filesize = readableFilesize(file.filesize)
		if (relativePath.indexOf('/') !== -1) {
			type = 'directory'
			filename = relativePath.split('/')[0]
			siapath = Path.join(path, filename) + '/'
			const subfiles = files.filter((subfile) => subfile.siapath.indexOf(siapath) !== -1)
			const totalFilesize = subfiles.reduce((sum, subfile) => sum + subfile.filesize, 0)
			filesize = readableFilesize(totalFilesize)
		}
		parsedFiles = parsedFiles.set(filename, {
			size: filesize,
			name: filename,
			siapath: siapath,
			available: file.available,
			uploadprogress: uploadprogress,
			type,
		})
	})
	return parsedFiles.toList().sortBy((file) => file.name)
}

// recursive version of readdir
export const readdirRecursive = (path, files) => {
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

// avgHostMetric computes the average of the metric given by `metric` on the
// list of `hosts`.
const avgHostMetric = (hosts, metric) =>
	hosts.reduce((sum, host) => sum.add(host[metric]), new BigNumber(0))
	     .dividedBy(hosts.size)

// avgStorageCost returns the average storage cost from a list of hosts given a
// period (blocks) and redundancy.
const avgStorageCost = (hosts, period, redundancy) =>
	avgHostMetric(hosts, 'storageprice')
	             .times(period)
	             .plus(avgHostMetric(hosts, 'uploadbandwidthprice'))
							 .times(redundancy)
	             .plus(avgHostMetric(hosts, 'downloadbandwidthprice'))

// Compute an estimated amount of storage from an amount of funds (Hastings)
// and a list of hosts.
export const estimatedStorage = (funds, hosts) => {
	const validHosts = List(hosts).take(28)
	const avgStorage = avgStorageCost(validHosts, allowancePeriod, baseRedundancy)

	let fee = SiaAPI.siacoinsToHastings(baseFee)
	fee = fee.plus(avgHostMetric(validHosts, 'contractprice').times(ncontracts))
	fee = fee.plus(funds.minus(fee).times(siafundRate))

	return '~' + readableFilesize(Math.max(0, funds.minus(fee).dividedBy(avgStorage).toNumber().toPrecision(1)))
}

// Parse a response from `/renter/downloads`
// return a list of file downloads
export const parseDownloads = (downloads) =>
	List(downloads)
		.map((download) => ({
			siapath: download.siapath,
			name: Path.basename(download.siapath),
			progress: Math.floor((download.received / download.filesize) * 100),
			destination: download.destination,
			type: 'download',
			starttime: download.starttime,
		}))
		.sortBy((download) => -download.starttime)

// Parse a list of files and return the total filesize
export const totalUsage = (files) => readableFilesize(files.reduce((sum, file) => sum + file.filesize, 0))

// Parse a list of files from `/renter/files`
// return a list of file uploads
export const parseUploads = (files) => List(files)
.filter((file) => file.uploadprogress < 100)
.map((upload) => ({
	siapath: upload.siapath,
	name: Path.basename(upload.siapath),
	progress: upload.available ? 100 : Math.floor(upload.uploadprogress),
	type: 'upload',
}))
.sortBy((upload) => upload.name)
.sortBy((upload) => -upload.progress)

// Search `files` for `text`, excluding directories not in `path`
export const searchFiles = (files, text, path) => {
	let matchingFiles = List(files).filter((file) => file.siapath.indexOf(path) !== -1)
	matchingFiles = matchingFiles.filter((file) => file.available)
	matchingFiles = matchingFiles.filter((file) => file.siapath.toLowerCase().indexOf(text.toLowerCase()) !== -1)
	return matchingFiles
}

