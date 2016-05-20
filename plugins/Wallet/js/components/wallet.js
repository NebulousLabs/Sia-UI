import React, { PropTypes } from 'react';
import TransactionHistory from '../containers/transactionhistory.js';
import AddressList from '../containers/addresslist.js';

const Wallet = ({confirmedbalance, unconfirmedbalance, }) => (
	<div className="wallet">
		<div className="balance-info">
			<div className="confirmed-balance">
				Confirmed Balance: {confirmedbalance} SC
			</div>
			<div className="unconfirmed-balance">
				Unconfirmed Balance: {unconfirmedbalance} SC
			</div>
		</div>
		<AddressList />
		<TransactionHistory />
	</div>
);

Wallet.propTypes = {
	confirmedbalance: PropTypes.number.isRequired,
	unconfirmedbalance: PropTypes.number.isRequired
};

export default Wallet;