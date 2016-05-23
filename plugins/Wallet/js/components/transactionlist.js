import React, { PropTypes } from 'react';
import { List } from 'immutable';

const TransactionHistory = ({transactions}) => {
	const transactionComponents = transactions.map((transaction, key) => (
		<div key={key} className="transaction">
			<div className="currency"{transaction.currency}></div>
			<div className="value">{transaction.value}</div>
			<div className="txnid">{transaction.id}</div>
			<div className="time">{transaction.time}</div>
		</div>
	));
	return (
		<div className="transaction-list">
			{transactionComponents}
		</div>
	);
}

TransactionHistory.propTypes = {
	transactions: PropTypes.instanceOf(List),
};

export default TransactionHistory;
