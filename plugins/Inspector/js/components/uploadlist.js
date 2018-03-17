import PropTypes from 'prop-types'
import React from 'react'
import TransferList from './transferlist.js'
import { List } from 'immutable'

const UploadList = ({uploads, onUploadClick}) => (
	<div className="uploads">
		<h3> Uploads </h3>
		<TransferList transfers={uploads} onTransferClick={onUploadClick} />
	</div>
)

UploadList.propTypes = {
	uploads: PropTypes.instanceOf(List).isRequired,
	onUploadClick: PropTypes.func,
}

export default UploadList
