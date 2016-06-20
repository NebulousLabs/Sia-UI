import React, { PropTypes } from 'react'
import { List } from 'immutable'
import TransferList from './transferlist.js'

const FileTransfers = ({uploads, downloads, actions}) => {
	const onCloseClick = () => actions.hideFileTransfers()
	let uploadlist
	if (uploads.size > 0) {
		uploadlist = (
			<div className="downloads">
				<h3> Uploads </h3>
				<TransferList transfers={uploads} />
			</div>
		)
	}
	let downloadlist
	if (downloads.size > 0) {
		downloadlist = (
			<div className="uploads">
				<h3> Downloads </h3>
				<TransferList transfers={downloads} />
			</div>
		)
	}
	return (
		<div className="file-transfers">
			<div className="close-button" onClick={onCloseClick}>
				<i className="fa fa-times fa-2x"></i>
			</div>
			{downloadlist}
			{uploadlist}
		</div>
	)
}

FileTransfers.propTypes = {
	uploads: PropTypes.instanceOf(List).isRequired,
	downloads: PropTypes.instanceOf(List).isRequired,
}

export default FileTransfers
