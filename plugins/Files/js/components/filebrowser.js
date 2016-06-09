import React, { PropTypes } from 'react'
import FileList from '../containers/filelist.js'
import SetAllowanceButton from '../containers/setallowancebutton.js'
import SearchButton from '../containers/searchbutton.js'
import UploadDialog from '../containers/uploaddialog.js'
import UploadButton from '../containers/uploadbutton.js'
import DragOverlay from './dragoverlay.js'

const FileBrowser = ({activespending, allocatedspending, dragging, showUploadDialog, actions}) => {
	const onDragOver = (e) => {
		e.preventDefault()
		actions.setDragging()
	}
	const onDrop = (e) => {
		e.preventDefault()
		actions.setNotDragging()
		actions.showUploadDialog(e.dataTransfer.files[0].path)
	}
	return (
		<div className="file-browser" onDragOver={onDragOver} onDrop={onDrop}>
			{showUploadDialog ? <UploadDialog /> : null}
			{dragging ? <DragOverlay /> : null}
			<div className="files-toolbar">
				<div className="allowance-info">
					<div>Active Storage Spending: {activespending} SC</div>
					<div>Available Storage Spending: {allocatedspending} SC</div>
				</div>
				<div className="buttons">
					<SearchButton />
					<UploadButton />
					<SetAllowanceButton />
				</div>
			</div>
			<FileList />
		</div>
	)
}

FileBrowser.propTypes = {
	activespending: PropTypes.string,
	allocatedspending: PropTypes.string,
}

export default FileBrowser
