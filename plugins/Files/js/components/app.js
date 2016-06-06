import React, { PropTypes } from 'react'
import FileBrowser from '../containers/filebrowser.js'
import AllowanceDialog from '../containers/allowancedialog.js'

const FilesApp = ({unlocked, showAllowanceDialog}) => {
	let fileBrowserContent
	if (!unlocked) {
		fileBrowserContent = (
			<div className="unlock-dialog">
				You must unlock your wallet you can upload files!
			</div>
		)
	} else {
		fileBrowserContent = (
			<FileBrowser />
		)
	}
	return (
		<div className="app">
			{showAllowanceDialog ? <AllowanceDialog /> : null }
			{fileBrowserContent}
		</div>
	)
}

FilesApp.propTypes = {
	unlocked: PropTypes.bool.isRequired,
	showAllowanceDialog: PropTypes.bool.isRequired,
}

export default FilesApp
