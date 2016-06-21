import React, { PropTypes } from 'react'
import TransferList from './transferlist.js'
import { List } from 'immutable'

const UploadList = ({uploads}) => (
	<div className="uploads">
		<h3> Uploads </h3>
		<TransferList transfers={uploads} />
	</div>
)

UploadList.propTypes = {
	uploads: PropTypes.instanceOf(List).isRequired,
}

export default UploadList
