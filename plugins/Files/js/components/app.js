import PropTypes from 'prop-types'
import React from 'react'
import FileBrowser from '../containers/filebrowser.js'
import AllowanceDialog from '../containers/allowancedialog.js'

const FilesApp = ({showAllowanceDialog}) => (
	<div className="app">
		{showAllowanceDialog ? <AllowanceDialog /> : null}
		<FileBrowser />
	</div>
)

FilesApp.propTypes = {
	showAllowanceDialog: PropTypes.bool.isRequired,
}

export default FilesApp
