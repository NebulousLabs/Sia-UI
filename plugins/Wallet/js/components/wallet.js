import React, { PropTypes } from 'react'
import TransactionList from '../containers/transactionlist.js'
import SendButton from '../containers/sendbutton.js'
import SendPrompt from '../containers/sendprompt.js'
import ReceiveButton from '../containers/receivebutton.js'
import ReceivePrompt from '../containers/receiveprompt.js'
import NewWalletDialog from '../containers/newwalletdialog.js'

const Wallet = ({confirmedbalance, unconfirmedbalance, showReceivePrompt, showSendPrompt, showNewWalletDialog }) => (
	<div className="wallet">
		<div className="wallet-toolbar">
			<div className="balance-info">
				<span>Confirmed Balance: {confirmedbalance} SC </span>
				<span>Unconfirmed Delta: {unconfirmedbalance} SC </span>
			</div>
			<SendButton />
			<ReceiveButton />
		</div>
		{showNewWalletDialog ? <NewWalletDialog /> : null}
		{showSendPrompt ? <SendPrompt /> : null}
		{showReceivePrompt ? <ReceivePrompt /> : null}
		<TransactionList />
	</div>
)

Wallet.propTypes = {
	confirmedbalance: PropTypes.string.isRequired,
	unconfirmedbalance: PropTypes.string.isRequired,
	showNewWalletDialog: PropTypes.bool,
	showSendPrompt: PropTypes.bool,
	showReceivePrompt: PropTypes.bool,
}

export default Wallet
