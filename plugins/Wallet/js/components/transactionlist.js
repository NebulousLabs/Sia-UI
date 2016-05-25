import React, { PropTypes } from 'react';
import { List } from 'immutable';

const TransactionList = ({transactions}) => {
	const transactionComponents = transactions.map((transaction, key) => (
		<div key={key} className="transaction">
			<div className="confirmed">{transaction.confirmed ? "Confirmed" : "Unconfirmed" }</div>
			<div className="value">{transaction.value}</div>
			<div className="txnid">{transaction.transactionid}</div>
		</div>
	));
	return (
		<div className="transaction-list">
			<span>Recent Transactions</span>
			{transactionComponents}
		</div>
	);
}

TransactionList.propTypes = {
	transactions: PropTypes.instanceOf(List),
};

export default TransactionList;
