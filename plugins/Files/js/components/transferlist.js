import React, { PropTypes } from 'react'
import { List } from 'immutable'

const TransferList = ({transfers}) => {
	const fileTransfers = transfers.map((transfer, key) => (
		<li key={key}>
			<div className="completed">{transfer.completed}</div>
			<div className="type">{transfer.type}</div>
			<div className="filename">{transfer.name}</div>
			<div className="progress">{transfer.progress}</div>
		</li>
	))
	return (
		<div className="transfer-list">
			<ul>
				{fileTransfers}
			</ul>
		</div>
	)
}

TransferList.propTypes = {
	transfers: PropTypes.instanceOf(List).isRequired,
}

export default TransferList