import React, { PropTypes } from 'react'
import ProgressBar from './progressbar.js'
import { List } from 'immutable'

const TransferList = ({transfers}) => {
	const transferComponents = transfers.map((transfer, key) => (
		<li key={key}>
			<div className="transfer-info">
				<div className="transfername">{transfer.name}</div>
				<ProgressBar progress={transfer.progress} />
			</div>
		</li>
	))
	return (
		<ul className="transfer-list">
			{transferComponents}
		</ul>
	)
}

TransferList.propTypes = {
	transfers: PropTypes.instanceOf(List).isRequired,
}

export default TransferList
