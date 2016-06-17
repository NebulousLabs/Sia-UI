import React, { PropTypes } from 'react'
import Path from 'path'

const File = ({onClick, icon, filename, filesize, actions}) => {
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
	return (
		<li onClick={onClick}>
			<div className="filename">
				{icon}
				<div className="name">{filename}</div>
			</div>
			<div className="file-info">
				<span className="filesize">{Math.floor(filesize/1000000)} MB</span>
				<div className="file-buttons">
					<div onClick={onDownloadClick} className="download-button">
						<i className="fa fa-cloud-download 2x"></i>
					</div>
					<div onClick={onDeleteClick} className="delete-button">
						<i className="fa fa-trash 2x"></i>
					</div>
				</div>
			</div>
		</li>
	)
}

File.propTypes = {
	onClick: PropTypes.func.isRequired,
	icon: PropTypes.element.isRequired,
	filename: PropTypes.string.isRequired,
	filesize: PropTypes.number.isRequired,
}

export default File
