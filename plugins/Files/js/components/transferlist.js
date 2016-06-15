import React, { PropTypes } from 'react'
import { List } from 'immutable'

const TransferList = ({transfers}) => {
	const transferComponents = transfers.map((transfer, key) => (
		<li key={key}>
			<div className="filename">{transfer.name}</div>
			<div className="transfer-state">{transfer.state}</div>
			<div className="progress">{transfer.progress}%</div>
		</li>
	))
	return (
		<div className="transfer-list">
			<ul>
				{transferComponents}
			</ul>
		</div>
	)
}

TransferList.propTypes = {
	transfers: PropTypes.instanceOf(List).isRequired,
}

export default TransferList
