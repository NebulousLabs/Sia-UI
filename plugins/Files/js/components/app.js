import React, { PropTypes } from 'react'
import FileBrowser from '../containers/filebrowser.js'

const FilesApp = ({unlocked}) => {
	let filesContent
	if (!unlocked) {
		filesContent = (
			<div className="unlock-dialog">
				You must unlock your wallet you can upload files!
			</div>
		)
	} else {
		fileContent = (
			<FileBrowser />
		)
	}
	return (
		<div className="app">
			{filesContent}
		</div>
	)
}

FilesApp.propTypes = {
	unlocked: PropTypes.bool.isRequired,
}

export default FilesApp
