import React, { PropTypes } from 'react';
import { List } from 'immutable';

const TransactionList = ({transactions}) => {
	const transactionComponents = transactions.map((transaction, key) => (
		<div key={key} className="transaction">
			<div className="currency">Currency Type: {transaction.currency}</div>
			<div className="value">Net Value: {transaction.value}</div>
			<div className="txnid">Transaction ID: {transaction.transactionid}</div>
			<div className="time">Timestamp: {transaction.confirmationtimestamp}</div>
		</div>
	));
	return (
		<div className="transaction-list">
			<span>Transactions</span>
			{transactionComponents}
		</div>
	);
}

TransactionList.propTypes = {
	transactions: PropTypes.instanceOf(List),
};

export default TransactionList;
