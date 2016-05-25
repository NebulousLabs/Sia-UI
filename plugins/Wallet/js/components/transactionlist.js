import React, { PropTypes } from 'react';
import { List } from 'immutable';

const TransactionList = ({transactions}) => {
	const transactionComponents = transactions.map((transaction, key) => (
		<tr key={key}>
			<td><i className="fa fa-bank fa-2x"></i></td>
			<td>{transaction.confirmed ? "Confirmed" : "Unconfirmed" }</td>
			<td>{transaction.value} SC</td>
			<td>{transaction.transactionid}</td>
		</tr>
	));
	return (
		<div className="transaction-list">
			<h2> Recent Transactions </h2>
			<table>
				<thead>
				<tr>
				<th></th>
				<th>Confirmation Status</th>
				<th>Net Value</th>
				<th>Transaction ID</th>
				</tr>
				</thead>
				<tbody>
				{transactionComponents}
				</tbody>
			</table>
		</div>
	);
}

TransactionList.propTypes = {
	transactions: PropTypes.instanceOf(List),
};

export default TransactionList;
