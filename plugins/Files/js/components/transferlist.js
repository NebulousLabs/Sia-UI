import PropTypes from 'prop-types'
import React from 'react'
import { List } from 'immutable'
import Transfer from './transfer.js'

const defaultTransferClick = () => () => {}

const TransferList = ({transfers, onTransferClick = defaultTransferClick}) => {
	const transferComponents = transfers.map((transfer, key) => (
		<Transfer key={key} status={transfer.status} name={transfer.name} progress={transfer.progress} onClick={onTransferClick(transfer)} />
	))
	return (
		<ul className="transfer-list">
			{transferComponents}
		</ul>
	)
}

TransferList.propTypes = {
	transfers: PropTypes.instanceOf(List).isRequired,
	onTransferClick: PropTypes.func,
}

export default TransferList
