import PropTypes from 'prop-types'
import React from 'react'
import { List } from 'immutable'

const TransactionList = ({ transactions, ntransactions, actions, filter }) => {
  if (transactions.size === 0) {
    return (
      <div className='transaction-list'>
        <h3> No recent transactions </h3>
      </div>
    )
  }
  const prettyTimestamp = timestamp => {
    const pad = n => String('0' + n).slice(-2)

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
    .filter(txn => {
      if (!filter) {
        return true
      }
      return (
        txn.transactionsums.totalSiacoin.abs().gt(0) ||
        txn.transactionsums.totalSiafund.abs().gt(0) ||
        txn.transactionsums.totalMiner.abs().gt(0)
      )
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
          txn.transactionsums.totalMiner
            .round(4)
            .toNumber()
            .toLocaleString() + ' SC (miner) '
      }
      if (valueData === '') {
        valueData = '0 SC'
      }
      return (
        <tr key={key}>
          <td>
            {txn.confirmed
              ? prettyTimestamp(txn.confirmationtimestamp)
              : 'Not Confirmed'}
          </td>
          <td>{valueData}</td>
          <td className='txid'>{txn.transactionid}</td>
          <td>
            {txn.confirmed ? (
              <i className='fa fa-check-square confirmed-icon'> Confirmed </i>
            ) : (
              <i className='fa fa-clock-o unconfirmed-icon'> Unconfirmed </i>
            )}
          </td>
        </tr>
      )
    })
  const onMoreClick = () => actions.showMoreTransactions()
  const onToggleFilter = () => actions.toggleFilter()
  return (
    <div className='transaction-list'>
      <div className='transaction-header'>
        <h2> Recent Transactions </h2>
        <div className='filter-toggle'>
          <input type='checkbox' onClick={onToggleFilter} checked={filter} />Hide
          0SC Transactions
        </div>
      </div>
      <table className='pure-table transaction-table'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Net Value</th>
            <th>Transaction ID</th>
            <th>Confirmation Status</th>
          </tr>
        </thead>
        <tbody>{transactionComponents}</tbody>
      </table>
      {transactions.size > ntransactions ? (
        <div className='load-more'>
          <button className='load-more-button' onClick={onMoreClick}>
            More Transactions
          </button>
        </div>
      ) : null}
    </div>
  )
}

TransactionList.propTypes = {
  transactions: PropTypes.instanceOf(List).isRequired,
  ntransactions: PropTypes.number.isRequired,
  filter: PropTypes.bool.isRequired
}

export default TransactionList
