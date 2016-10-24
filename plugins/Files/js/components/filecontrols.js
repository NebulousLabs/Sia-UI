import React, { PropTypes } from 'react'
import { Set } from 'immutable'
import Path from 'path'

const FileControls = ({files, actions}) => {
	const onDownloadClick = () => {
		const downloadpath = SiaAPI.openFile({
			title: 'Where should we download?',
			properties: ['openDirectory', 'createDirectories'],
		})
		files.forEach((file) => {
			actions.downloadFile(file, Path.join(downloadpath[0], Path.basename(file.siapath)))
		})
	}
	const onDeleteClick = () => {
		actions.showDeleteDialog(files.map((file) => file.siapath).toList())
	}
	return (
		<div className="file-controls">
			{files.size} {files.size === 1 ? ' item' : ' items' } selected
			<div onClick={onDownloadClick} className="download-button">
				<i className="fa fa-cloud-download fa-2x" />
			</div>
			<div onClick={onDeleteClick} className="delete-button">
				<i className="fa fa-trash fa-2x" />
			</div>
		</div>
	)
}

FileControls.propTypes = {
	files: PropTypes.instanceOf(Set).isRequired,
}

export default FileControls

