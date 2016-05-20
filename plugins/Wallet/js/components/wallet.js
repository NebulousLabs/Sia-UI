import React, { PropTypes } from 'react';

const Wallet = ({confirmedbalance, unconfirmedbalance, }) => (
	<div className="wallet">
		<div className="balance-info">
			<div className="confirmed-balance">
				{confirmedbalance}
			</div>
			<div className="unconfirmed-balance">
				{unconfirmedbalance}
			</div>
		</div>
		<div className="address-list">
		</div>
		<div className="transaction-history">
		</div>
	</div>
);

Wallet.propTypes = {
	confirmedbalance: PropTypes.string.isRequired,
	unconfirmedbalance: PropTypes.string.isRequired
};

export default Wallet;