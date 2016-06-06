import React, { PropTypes } from 'react'

const FileBrowser = ({activespending, allocatedspending}) => (
	<div className="file-browser">
		<div className="files-toolbar">
			<span>Active Storage Spending: {activespending}</span>
			<span>Available Storage Spending: {allocatedspending}</span>
		</div>
		<FileList />
	</div>
)

FileBrowser.propTypes = {
	activespending: PropTypes.string,
	allocatedspending: PropTypes.string,
}

export default FileBrowser
