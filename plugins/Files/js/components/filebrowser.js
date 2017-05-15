import PropTypes from 'prop-types'
import React from 'react'
import FileList from '../containers/filelist.js'
import SetAllowanceButton from '../containers/setallowancebutton.js'
import SearchButton from '../containers/searchbutton.js'
import UploadDialog from '../containers/uploaddialog.js'
import UploadButton from '../containers/uploadbutton.js'
import DeleteDialog from '../containers/deletedialog.js'
import RenameDialog from '../containers/renamedialog.js'
import TransfersButton from '../containers/transfersbutton.js'
import FileTransfers from '../containers/filetransfers.js'
import UsageStats from '../containers/usagestats.js'
import ContractorStatus from '../containers/contractorstatus.js'
import DragOverlay from './dragoverlay.js'

const FileBrowser = ({dragging, settingAllowance, showRenameDialog, showUploadDialog, showDeleteDialog, showFileTransfers, actions}) => {
	const onDragOver = (e) => {
		e.preventDefault()
		actions.setDragging()
	}
	const onDrop = (e) => {
		e.preventDefault()
		actions.setNotDragging()
		// Convert file list into a list of file paths.
		actions.showUploadDialog(Array.from(e.dataTransfer.files, (file) => file.path))
	}
	const onDragLeave = (e) => {
		e.preventDefault()
		actions.setNotDragging()
	}
	const onKeyDown = (e) => {
		// Deselect all files when ESC is pressed.
		if (e.keyCode === 27) {
			actions.deselectAll()
		}
	}
	return (
		<div className="file-browser-container">
			<div className="file-browser" onKeyDown={onKeyDown} tabIndex="1" onDragOver={onDragOver} onMouseLeave={onDragLeave} onDrop={onDrop}>
				{showRenameDialog ? <RenameDialog /> : null}
				{showUploadDialog ? <UploadDialog /> : null}
				{showDeleteDialog ? <DeleteDialog /> : null}
				{dragging ? <DragOverlay /> : null}
				<div className="files-toolbar">
					<UsageStats />
					<ContractorStatus />
					<div className="buttons">
						{!settingAllowance ? <SetAllowanceButton /> : null}
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
	dragging: PropTypes.bool.isRequired,
	settingAllowance: PropTypes.bool.isRequired,
	showRenameDialog: PropTypes.bool.isRequired,
	showUploadDialog: PropTypes.bool.isRequired,
	showDeleteDialog: PropTypes.bool.isRequired,
	showFileTransfers: PropTypes.bool.isRequired,
}

export default FileBrowser
