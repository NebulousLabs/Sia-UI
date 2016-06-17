import React, { PropTypes } from 'react'
import FileList from '../containers/filelist.js'
import SetAllowanceButton from '../containers/setallowancebutton.js'
import SearchButton from '../containers/searchbutton.js'
import UploadDialog from '../containers/uploaddialog.js'
import UploadButton from '../containers/uploadbutton.js'
import DeleteDialog from '../containers/deletedialog.js'
import TransfersButton from '../containers/transfersbutton.js'
import FileTransfers from '../containers/filetransfers.js'
import DragOverlay from './dragoverlay.js'

const FileBrowser = ({activespending, allocatedspending, dragging, showUploadDialog, showDeleteDialog, showFileTransfers, actions}) => {
	const onDragOver = (e) => {
		e.preventDefault()
		actions.setDragging()
	}
	const onDrop = (e) => {
		e.preventDefault()
		actions.setNotDragging()
		actions.showUploadDialog(e.dataTransfer.files[0].path)
	}
	const onDragLeave = (e) => {
		e.preventDefault()
		actions.setNotDragging()
	}
	return (
		<div className="file-browser-container">
			<div className="file-browser" onDragOver={onDragOver} onMouseLeave={onDragLeave} onDrop={onDrop}>
				{showUploadDialog ? <UploadDialog /> : null}
				{showDeleteDialog ? <DeleteDialog /> : null}
				{dragging ? <DragOverlay /> : null}
				<div className="files-toolbar">
					<div className="allowance-info">
						<div>Active Storage Spending: {activespending} SC</div>
						<div>Available Storage Spending: {allocatedspending} SC</div>
					</div>
					<div className="buttons">
						<SetAllowanceButton />
						<SearchButton />
						<UploadButton />
						<TransfersButton />
					</div>
				</div>
				<FileList />
			</div>
			{showFileTransfers ? <FileTransfers /> : null}
		</div>
	)
}

FileBrowser.propTypes = {
	activespending: PropTypes.string,
	allocatedspending: PropTypes.string,
	dragging: PropTypes.bool.isRequired,
	showUploadDialog: PropTypes.bool.isRequired,
	showDeleteDialog: PropTypes.bool.isRequired,
	showFileTransfers: PropTypes.bool.isRequired,
}

export default FileBrowser
