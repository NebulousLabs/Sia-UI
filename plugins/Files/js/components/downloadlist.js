import PropTypes from 'prop-types'
import React from 'react'
import TransferList from './transferlist.js'
import { List } from 'immutable'

const DownloadList = ({downloads, onDownloadClick, onClearClick}) => (
	<div className="downloads">
		<h3> Downloads </h3>
		<TransferList transfers={downloads} onTransferClick={onDownloadClick} />
		<button onClick={onClearClick} className="clear-downloads">Clear Downloads</button>
	</div>
)

DownloadList.propTypes = {
	downloads: PropTypes.instanceOf(List).isRequired,
	onDownloadClick: PropTypes.func,
	onClearClick: PropTypes.func,
}

export default DownloadList
