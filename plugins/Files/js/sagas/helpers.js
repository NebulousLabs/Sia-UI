// Helper functions for the Files sagas.
import { List, Map } from 'immutable'
import BigNumber from 'bignumber.js'

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

// Parse the response from `/renter/files`.
// Return a Set of files and directories in the current `path`.
// This works similarly to `ls`.
export const parseFiles = (files, path) => {
	const fileList = List(files).filter((file) => file.siapath.indexOf(path) !== -1)
	let parsedFiles = Map()
	fileList.forEach((file) => {
		let type = 'file'
		const relativePath = file.siapath.substring(path.length, file.siapath.length)
		let filename = relativePath.substring(relativePath.lastIndexOf('/') + 1, relativePath.length)
		if (relativePath.indexOf('/') !== -1) {
			type = 'directory'
			filename = relativePath.split('/')[0]
		}
		parsedFiles = parsedFiles.set(filename, {
			size: file.filesize,
			name: filename,
			type,
		})
	})
	return parsedFiles.toList().sortBy((file) => file.name)
}

export const searchFiles = (files, text, path) => {
	const matchingFiles = List(files).filter((file) => file.siapath.indexOf(path) !== -1 && file.siapath.toLowerCase().indexOf(text.toLowerCase()) !== -1)
	return matchingFiles.map((file) => ({size: file.filesize, name: file.siapath, type: 'file'}))
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
