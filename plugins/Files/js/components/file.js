import React, { PropTypes } from 'react'
import Path from 'path'

const File = ({filename, siapath, filesize, available, actions}) => {
	const onDownloadClick = () => {
		const downloadpath = SiaAPI.openFile({
			title: 'Where should we download this file?',
			properties: ['openDirectory', 'createDirectories'],
		})
		actions.downloadFile(siapath, Path.join(downloadpath[0], Path.basename(siapath)))
	}
	const onDeleteClick = () => {
		actions.deleteFile(siapath)
		actions.hideFileView()
	}
	const onBackClick = () => actions.hideFileView()
	return (
		<div className="file-view">
			<div className="back-bar" onClick={onBackClick}>
				<i className="fa fa-backward"></i>
				<span>Back</span>
			</div>
			<div className="file-view-detail">
				<h3> {filename} </h3>
				<div> Size: {Math.floor(filesize/1000000)} MB</div>
				<div className="file-buttons">
					<div onClick={onDownloadClick} className="download-button">
						<i className="fa fa-cloud-download fa-4x"></i>
						<div> Download </div>
					</div>
					<div onClick={onDeleteClick} className="delete-button">
						<i className="fa fa-trash fa-4x"></i>
						<div> Delete </div>
					</div>
				</div>
			</div>
		</div>
	)
}

File.propTypes = {
	filename: PropTypes.string.isRequired,
	siapath: PropTypes.string.isRequired,
	filesize: PropTypes.number.isRequired,
	available: PropTypes.bool.isRequired,
}

export default File
