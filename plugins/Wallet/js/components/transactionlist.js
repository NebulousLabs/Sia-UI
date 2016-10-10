import React, { PropTypes } from 'react'
import { List } from 'immutable'

const TransactionList = ({transactions}) => {
	if (transactions.size === 0) {
		return (
			<div className="transaction-list">
				<h3> No recent transactions </h3>
			</div>
		)
	}
	const transactionComponents = transactions.map((txn, key) => {
		let valueData = ''
		if (txn.transactionsums.totalSiacoin.abs().gt(0)) {
			valueData += txn.transactionsums.totalSiacoin.round(4).toString() + ' SC '
		}
		if (txn.transactionsums.totalSiafund.abs().gt(0)) {
			valueData += txn.transactionsums.totalSiafund.round(4).toString() + ' SF '
		}
		if (txn.transactionsums.totalMiner.abs().gt(0)) {
			valueData += txn.transactionsums.totalMiner.round(4).toString() + ' SC (miner) '
		}
		if (valueData === '') {
			valueData = '0 SC'
		}
		return (
			<tr key={key}>
				<td>{txn.confirmationtimestamp.toString()}</td>
				<td>{valueData}</td>
				<td className="txid">{txn.transactionid}</td>
				<td>{txn.confirmed ? <i className="fa fa-check-square confirmed-icon"> Confirmed </i> : <i className="fa fa-clock-o unconfirmed-icon"> Unconfirmed </i>}</td>
			</tr>
		)
	})
	return (
		<div className="transaction-list">
			<h2> Recent Transactions </h2>
			<table className="pure-table transaction-table">
				<thead>
					<tr>
						<th>Timestamp</th>
						<th>Net Value</th>
						<th>Transaction ID</th>
						<th>Confirmation Status</th>
					</tr>
				</thead>
				<tbody>
					{transactionComponents}
				</tbody>
			</table>
		</div>
	)
}

TransactionList.propTypes = {
	transactions: PropTypes.instanceOf(List).isRequired,
}

export default TransactionList
