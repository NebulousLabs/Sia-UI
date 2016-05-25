import React, { PropTypes } from 'react';
import TransactionList from '../containers/transactionlist.js';
import SendButton from '../containers/sendbutton.js';
import SendPrompt from '../containers/sendprompt.js';
import ReceiveButton from '../containers/receivebutton.js';
import ReceivePrompt from '../containers/receiveprompt.js';

const Wallet = ({confirmedbalance, unconfirmedbalance, }) => (
	<div className="wallet">
		<div className="wallet-toolbar">
			<div className="confirmed-balance">
				Confirmed Balance: {confirmedbalance} SC
			</div>
			<div className="unconfirmed-balance">
				Unconfirmed Balance: {unconfirmedbalance} SC
			</div>
			<SendButton />
			<ReceiveButton />
		</div>
		<SendPrompt />
		<ReceivePrompt />
		<span>Transactions</span>
		<TransactionList />
	</div>
);

Wallet.propTypes = {
	confirmedbalance: PropTypes.string.isRequired,
	unconfirmedbalance: PropTypes.string.isRequired
};

export default Wallet;