import React from 'react'
import UploadList from '../containers/uploadlist.js'
import DownloadList from '../containers/downloadlist.js'

const FileTransfers = ({actions}) => {
	const onCloseClick = () => actions.hideFileTransfers()
	return (
		<div className="file-transfers">
			<div className="close-button" onClick={onCloseClick}>
				<i className="fa fa-times fa-2x"></i>
			</div>
			<h3> Downloads </h3>
			<DownloadList />
			<h3> Uploads </h3>
			<UploadList />
		</div>
	)
}

export default FileTransfers
