import React, { PropTypes } from 'react'
import TransferList from './transferlist.js'
import { List } from 'immutable'

const DownloadList = ({downloads, onDownloadClick}) => (
	<div className="downloads">
		<h3> Downloads </h3>
		<TransferList transfers={downloads} onTransferClick={onDownloadClick} />
	</div>
)

DownloadList.propTypes = {
	downloads: PropTypes.instanceOf(List).isRequired,
	onDownloadClick: PropTypes.func,
}

export default DownloadList
