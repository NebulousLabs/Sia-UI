import React, { PropTypes } from 'react'
import FileBrowser from '../containers/filebrowser.js'
import AllowanceDialog from '../containers/allowancedialog.js'

const FilesApp = ({unlocked, showAllowanceDialog}) => (
	<div className="app">
		{showAllowanceDialog ? <AllowanceDialog /> : null}
		{unlocked ? <FileBrowser /> : <div className="unlock-dialog"><h3>You must unlock your wallet you can upload files!</h3></div>}
	</div>
)

FilesApp.propTypes = {
	unlocked: PropTypes.bool.isRequired,
	showAllowanceDialog: PropTypes.bool.isRequired,
}

export default FilesApp
