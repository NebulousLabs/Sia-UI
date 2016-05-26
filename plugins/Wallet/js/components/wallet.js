import React, { PropTypes } from 'react';
import TransactionList from '../containers/transactionlist.js';
import SendButton from '../containers/sendbutton.js';
import SendPrompt from '../containers/sendprompt.js';
import ReceiveButton from '../containers/receivebutton.js';
import ReceivePrompt from '../containers/receiveprompt.js';
import NewWalletDialog from '../containers/newwalletdialog.js';

const Wallet = ({confirmedbalance, unconfirmedbalance }) => (
	<div className="wallet">
		<div className="wallet-toolbar">
			<div className="balance-info">
				<span>Confirmed Balance: {confirmedbalance} SC </span>
				<span>Unconfirmed Delta: {unconfirmedbalance} SC </span>
			</div>
			<SendButton />
			<ReceiveButton />
		</div>
		<NewWalletDialog />
		<SendPrompt />
		<ReceivePrompt />
		<TransactionList />
	</div>
);

Wallet.propTypes = {
	confirmedbalance: PropTypes.string.isRequired,
	unconfirmedbalance: PropTypes.string.isRequired
};

export default Wallet;