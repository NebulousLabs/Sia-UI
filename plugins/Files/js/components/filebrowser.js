import React, { PropTypes } from 'react'
import FileList from '../containers/filelist.js'
import SetAllowanceButton from '../containers/setallowancebutton.js'

const FileBrowser = ({activespending, allocatedspending}) => (
	<div className="file-browser">
		<div className="files-toolbar">
			<div className="allowance-info">
				<span>Active Storage Spending: {activespending}</span>
				<span>Available Storage Spending: {allocatedspending}</span>
			</div>
			<SetAllowanceButton />
		</div>
		<FileList />
	</div>
)

FileBrowser.propTypes = {
	activespending: PropTypes.string,
	allocatedspending: PropTypes.string,
}

export default FileBrowser
