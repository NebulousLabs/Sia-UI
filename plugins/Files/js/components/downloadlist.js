import React, { PropTypes } from 'react'
import TransferList from './transferlist.js'
import { List } from 'immutable'

const DownloadList = ({downloads}) => (
	<div className="downloads">
		<h3> Downloads </h3>
		<TransferList transfers={downloads} />
	</div>
)

DownloadList.propTypes = {
	downloads: PropTypes.instanceOf(List).isRequired,
}

export default DownloadList
