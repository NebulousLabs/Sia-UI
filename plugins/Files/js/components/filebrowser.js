import React, { PropTypes } from 'react'
import FileList from '../containers/filelist.js'
import SetAllowanceButton from '../containers/setallowancebutton.js'
import SearchButton from '../containers/searchbutton.js'

const FileBrowser = ({activespending, allocatedspending}) => (
	<div className="file-browser">
		<div className="files-toolbar">
			<div className="allowance-info">
				<div>Active Storage Spending: {activespending} SC</div>
				<div>Available Storage Spending: {allocatedspending} SC</div>
			</div>
			<div className="buttons">
				<SearchButton />
				<SetAllowanceButton />
			</div>
		</div>
		<FileList />
	</div>
)

FileBrowser.propTypes = {
	activespending: PropTypes.string,
	allocatedspending: PropTypes.string,
}

export default FileBrowser
