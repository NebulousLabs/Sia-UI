import React from 'react'
import request from 'request'
import semver from 'semver'
import { shell } from 'electron'
import UpdateComponent from './updatecomponent.js'

const getReleases = (url) => new Promise((resolve, reject) => {
	request({
		url,
		json: true,
		headers: {
			'User-Agent': 'Sia-UI',
		},
	}, (err, response, body) => {
		if (err) {
			reject(err)
		} else {
			resolve(body)
		}
	})
})

const openReleasesPage = () => {
	shell.openExternal('https://github.com/NebulousLabs/Sia-UI/releases')
}

// Update is a container that takes the current UI version as its first argument
// and returns a rendered UpdateComponent that either shows a checkbox and 'up to date'
// or an update icon with a link to the new version, if the current version is behind.
const Update = async (currentVersion) => {
	const checkVersion = async () => {
		const releases = await getReleases('https://api.github.com/repos/NebulousLabs/Sia-UI/releases')
		if (semver.gt(releases[0].tag_name, currentVersion)) {
			return false
		}
		return true
	}
	const uptodate = await checkVersion()
	if (!uptodate) {
		return <UpdateComponent onClick={openReleasesPage} />
	}
	return (
		<div></div>
	)
}

export default Update
