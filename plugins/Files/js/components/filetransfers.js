import React from 'react'
import UploadList from '../containers/uploadlist.js'
import DownloadList from '../containers/downloadlist.js'

const FileTransfers = ({actions}) => {
	const onCloseClick = () => actions.hideFileTransfers()
	return (
		<div className="transfer-list">
			<div className="close-button" onClick={onCloseClick}>
				<i className="fa fa-times fa-2x"></i>
			</div>
			<DownloadList />
			<UploadList />
		</div>
	)
}

export default FileTransfers
