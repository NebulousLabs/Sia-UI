import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Transfer from './transfer.js'

const TransferList = ({transfers, onTransferClick = () => {}}) => {
	const transferComponents = transfers.map((transfer, key) => {
		let infotext = ''
		if (transfer.type === 'download') {
			infotext = 'Click to open ' + transfer.name + ' in your filesystem.'
		}
		return (
			<Transfer key={key} name={transfer.name} progress={transfer.progress} infotext={infotext} onClick={onTransferClick(transfer)} />
		)
	})
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
