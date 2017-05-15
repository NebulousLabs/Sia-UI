import PropTypes from 'prop-types'
import React from 'react'
import TransactionList from '../containers/transactionlist.js'
import SendButton from './sendbutton.js'
import SendPrompt from '../containers/sendprompt.js'
import ReceiveButton from '../containers/receivebutton.js'
import ReceivePrompt from '../containers/receiveprompt.js'
import NewWalletDialog from '../containers/newwalletdialog.js'
import LockButton from '../containers/lockbutton.js'
import RecoverButton from '../containers/recoverbutton.js'
import RecoveryDialog from '../containers/recoverydialog.js'

const Wallet = ({synced, confirmedbalance, unconfirmedbalance, siafundbalance, showReceivePrompt, showSendPrompt, showNewWalletDialog, showRecoveryDialog, actions }) => {
	const onSendClick = (currencytype) => () => actions.startSendPrompt(currencytype)
	return (
		<div className="wallet">
			<div className="wallet-toolbar">
				<div className="balance-info">
					<span>Confirmed Balance: {confirmedbalance} SC </span>
					<span>Unconfirmed Delta: {unconfirmedbalance} SC </span>
					{siafundbalance !== '0' ? (<span> Siafund Balance: {siafundbalance} SF </span>) : null}
					{!synced ? (
						<span style={{marginRight: '40px', color: 'rgb(255, 93, 93)'}} className="fa fa-exclamation-triangle">Your wallet is not synced, balances are not final.</span>
						) : null
					}
				</div>
				<LockButton />
				<RecoverButton />
				{siafundbalance !== '0' ? <SendButton currencytype="Siafund" onClick={onSendClick('siafunds')} />: null}
				<SendButton currencytype="Siacoin" onClick={onSendClick('siacoins')} />
				<ReceiveButton />
			</div>
			{showNewWalletDialog ? <NewWalletDialog /> : null}
			{showSendPrompt ? <SendPrompt /> : null}
			{showReceivePrompt ? <ReceivePrompt /> : null}
			{showRecoveryDialog ? <RecoveryDialog /> : null}
			<TransactionList />
		</div>
	)
}

Wallet.propTypes = {
	synced: PropTypes.bool.isRequired,
	confirmedbalance: PropTypes.string.isRequired,
	unconfirmedbalance: PropTypes.string.isRequired,
	siafundbalance: PropTypes.string.isRequired,
	showNewWalletDialog: PropTypes.bool,
	showSendPrompt: PropTypes.bool,
	showReceivePrompt: PropTypes.bool,
}

export default Wallet
