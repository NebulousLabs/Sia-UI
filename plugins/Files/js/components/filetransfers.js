import PropTypes from 'prop-types'
import React from 'react'
import { List } from 'immutable'
import UploadList from './uploadlist.js'
import DownloadList from './downloadlist.js'
import { shell } from 'electron'

const FileTransfers = ({uploads, downloads, actions}) => {
	const onCloseClick = () => actions.hideFileTransfers()
	const onDownloadClick = (download) => () => shell.showItemInFolder(download.destination)
	const onDownloadsClearClick = () => {
		actions.clearDownloads()
		actions.getDownloads()
	}
	return (
		<div className="file-transfers">
			<div className="close-button" onClick={onCloseClick}>
				<i className="fa fa-times fa-2x" />
			</div>
			{downloads.size === 0 && uploads.size === 0 ? (
				<h3 style={{marginTop: '50px'}}> No file transfers in progress. </h3>
				) : null
			}
			{downloads.size > 0 ? <DownloadList downloads={downloads} onClearClick={onDownloadsClearClick} onDownloadClick={onDownloadClick} /> : null}
			{uploads.size > 0 ? <UploadList uploads={uploads} /> : null}
		</div>
	)
}

FileTransfers.propTypes = {
	uploads: PropTypes.instanceOf(List).isRequired,
	downloads: PropTypes.instanceOf(List).isRequired,
}

export default FileTransfers
