import React, { PropTypes } from 'react'
import { List } from 'immutable'

const FileControls = ({files, actions}) => {
	const onDownloadClick = () => {
		const downloadpath = SiaAPI.openFile({
			title: 'Where should we download?',
			properties: ['openDirectory', 'createDirectories'],
		})
		files.forEach((file) => actions.downloadFile(file.siapath, Path.join(downloadpath[0], Path.basename(file.siapath))))
	}
	const onDeleteClick = () => {
		actions.showDeleteDialog(files)
	}
	return (
		<div className="file-buttons">
			<div onClick={onDownloadClick} className="download-button">
				<i className="fa fa-cloud-download 2x" />
			</div>
			<div onClick={onDeleteClick} className="delete-button">
				<i className="fa fa-trash 2x" />
			</div>
		</div>
	)
}

FileControls.propTypes = {
	files: PropTypes.instanceOf(List).isRequired,
}

export default FileControls

