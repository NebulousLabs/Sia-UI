/* eslint-disable react/no-danger */
import PropTypes from 'prop-types'
import React from 'react'
import { List } from 'immutable'
import CoinIcon from '../../../../assets/siaLogoOnboarding.svg'

const TransactionList = ({ transactions, ntransactions, actions, filter }) => {
	if (transactions.size === 0) {
		return (
			<div className="transaction-list transaction-list--empty">
				<div className="transaction-list__empty-logo">
					<span dangerouslySetInnerHTML={{__html: CoinIcon}} />
				</div>
				<h2 className="transaction-list__empty-title"> No recent transactions </h2>
			</div>
		)
	}
	const prettyTimestamp = (timestamp) => {
		const pad = (n) => String('0' + n).slice(-2)

		const yesterday = new Date()
		yesterday.setHours(yesterday.getHours() - 24)
		if (timestamp > yesterday) {
			return (
				'Today at ' +
				pad(timestamp.getHours()) +
				':' +
				pad(timestamp.getMinutes())
			)
		}
		return (
			timestamp.getFullYear() +
			'-' +
			pad(timestamp.getMonth() + 1) +
			'-' +
			pad(timestamp.getDate()) +
			' ' +
			pad(timestamp.getHours()) +
			':' +
			pad(timestamp.getMinutes())
		)
	}
	const transactionComponents = transactions
		.take(ntransactions)
		.filter((txn) => {
			if (!filter) {
				return true
			}
			return txn.transactionsums.totalSiacoin.abs().gt(0) || txn.transactionsums.totalSiafund.abs().gt(0) || txn.transactionsums.totalMiner.abs().gt(0)
		})
		.map((txn, key) => {
			let valueData = ''
			if (txn.transactionsums.totalSiacoin.abs().gt(0)) {
				valueData +=
					txn.transactionsums.totalSiacoin
						.round(4)
						.toNumber()
						.toLocaleString() + ' SC '
			}
			if (txn.transactionsums.totalSiafund.abs().gt(0)) {
				valueData +=
					txn.transactionsums.totalSiafund
						.round(4)
						.toNumber()
						.toLocaleString() + ' SF '
			}
			if (txn.transactionsums.totalMiner.abs().gt(0)) {
				valueData +=
					txn.transactionsums.totalMiner.round(4).toNumber().toLocaleString() +
					' SC (miner) '
			}
			if (valueData === '') {
				valueData = '0 SC'
			}
			return (
				<tr key={key}>
					<td className="tx-confirmation-status">
						{txn.confirmed
							? <i className="fa fa-check-square confirmed-icon" />
							: <i className="fa fa-clock-o unconfirmed-icon" />}
					</td>
					<td>
						{txn.confirmed
							? prettyTimestamp(txn.confirmationtimestamp)
							: 'Not Confirmed'}
					</td>
					<td>{valueData}</td>
					<td className="txid">{txn.transactionid}</td>
				</tr>
			)
		})
	const onMoreClick = () => actions.showMoreTransactions()
	const onToggleFilter = () => actions.toggleFilter()
	return (
		<div className="transaction-list">
			<div className="transaction-header">
				<h2>Recent Transactions </h2>
				<div className="filter-toggle">
					<label htmlFor="hide-small-transactions">
						<input
							id="hide-small-transactions"
							type="checkbox"
							onClick={onToggleFilter}
							checked={filter}
						/>
						<span>Hide 0 SC Transactions</span>
					</label>
				</div>
			</div>
			<table className="transaction-table">
				<thead>
					<tr>
						<th />
						<th>Date</th>
						<th>Net Value</th>
						<th>Transaction ID</th>
					</tr>
				</thead>
				<tbody>
					{transactionComponents}
				</tbody>
			</table>
			{transactions.size > ntransactions
				? <div className="load-more">
					<button className="button load-more-button" onClick={onMoreClick}>
						More Transactions
					</button>
				</div>
				: null}
		</div>
	)
}

TransactionList.propTypes = {
	transactions: PropTypes.instanceOf(List).isRequired,
	ntransactions: PropTypes.number.isRequired,
	filter: PropTypes.bool.isRequired,
}

export default TransactionList
