import PropTypes from 'prop-types'
import React from 'react'
import FileList from '../containers/filelist.js'
import FileTransfers from '../containers/filetransfers.js'
import DragOverlay from './dragoverlay.js'

const FileBrowser = ({dragging, dragUploadEnabled, showFileTransfers, actions}) => {
	const onDragOver = (e) => {
		if (!dragUploadEnabled) {
			return
		}
		e.preventDefault()
		actions.setDragging()
	}
	const onDrop = (e) => {
		if (!dragUploadEnabled) {
			return
		}
		e.preventDefault()
		actions.setNotDragging()
		// Convert file list into a list of file paths.
		actions.showUploadDialog(Array.from(e.dataTransfer.files, (file) => file.path))
	}
	const onDragLeave = (e) => {
		if (!dragUploadEnabled) {
			return
		}
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
				{dragging ? <DragOverlay /> : null}
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
	dragUploadEnabled: PropTypes.bool.isRequired,
}

export default FileBrowser
