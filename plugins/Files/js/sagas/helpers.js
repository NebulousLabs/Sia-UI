// Helper functions for the Files sagas.
import { List } from 'immutable'

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

// Parse the response from `/renter/files`
export const parseFiles = (files) => {
	const fileList = List(files)
	return fileList.map((file) => ({
		size: file.filesize,
		name: file.siapath,
		available: file.available,
	}))
}
