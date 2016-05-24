import React, { PropTypes } from 'react';
import { List } from 'immutable';

const TransactionList = ({transactions}) => {
	const transactionComponents = transactions.map((transaction, key) => (
		<div key={key} className="transaction">
			<div className="currency">{transaction.currency}</div>
			<div className="value">{transaction.value}</div>
			<div className="txnid">{transaction.transactionid}</div>
			<div className="time">{transaction.confirmationtimestamp}</div>
		</div>
	));
	return (
		<div className="transaction-list">
			{transactionComponents}
		</div>
	);
}

TransactionList.propTypes = {
	transactions: PropTypes.instanceOf(List),
};

export default TransactionList;
