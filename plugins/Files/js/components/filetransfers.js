import React, { PropTypes } from 'react'
import { List } from 'immutable'
import UploadList from './uploadlist.js'
import DownloadList from './downloadlist.js'

const FileTransfers = ({uploads, downloads, actions}) => {
	const onCloseClick = () => actions.hideFileTransfers()
	return (
		<div className="file-transfers">
			<div className="close-button" onClick={onCloseClick}>
				<i className="fa fa-times fa-2x"></i>
			</div>
			{uploads.size > 0 ? <UploadList uploads={uploads} /> : null}
			{downloads.size > 0 ? <DownloadList downloads={downloads} /> : null}
		</div>
	)
}

FileTransfers.propTypes = {
	uploads: PropTypes.instanceOf(List).isRequired,
	downloads: PropTypes.instanceOf(List).isRequired,
}

export default FileTransfers
