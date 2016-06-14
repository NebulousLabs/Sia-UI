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
	const onBackClick = () => actions.hideFileView()
	return (
		<div className="file-view">
			<div className="back-bar" onClick={onBackClick}>
				<i className="fa fa-backward"></i>
				<span>Back</span>
			</div>
			<div className="file-view-info">
				<h3> {filename} </h3>
				<h5> {siapath} </h5>
				<div> Size: {filesize} </div>
				<div> Available to Download: {available ? 'Yes' : 'No'} </div>
				<div onClick={onDownloadClick} className="download-button">
					<i className="fa fa-cloud-download fa-2x"></i>
					<div> Download </div>
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
