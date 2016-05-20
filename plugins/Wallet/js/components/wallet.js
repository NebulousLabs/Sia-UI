import React, { PropTypes } from 'react';

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
		<div className="address-list">
		</div>
		<div className="transaction-history">
		</div>
	</div>
);

Wallet.propTypes = {
	confirmedbalance: PropTypes.number.isRequired,
	unconfirmedbalance: PropTypes.number.isRequired
};

export default Wallet;