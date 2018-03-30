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
import ChangePasswordButton from '../containers/changepasswordbutton.js'
import ChangePasswordDialog from '../containers/changepassworddialog.js'
import BackupButton from '../containers/backupbutton.js'
import BackupPrompt from '../containers/backupprompt.js'
import BalanceInfo from '../containers/balanceinfo.js'
import Modal from './modal'

const Wallet = ({showBackupPrompt, siafundbalance, showReceivePrompt, showChangePasswordDialog, showSendPrompt, showNewWalletDialog, showRecoveryDialog, actions }) => {
	const onSendClick = (currencytype) => () => actions.startSendPrompt(currencytype)
	return (
		<div className="wallet">
			<div className="wallet__actions">
				<BackupButton />
				<ChangePasswordButton />
				<LockButton />
				<RecoverButton />
			</div>
			<div className="wallet-toolbar">
				<BalanceInfo />
				{siafundbalance !== '0' ? <SendButton currencytype="Siafund" onClick={onSendClick('siafunds')} />: null}
				<SendButton currencytype="Siacoin" onClick={onSendClick('siacoins')} />
				<ReceiveButton />
			</div>
			<Modal open={showNewWalletDialog}>
				<NewWalletDialog />
			</Modal>
			<Modal open={showSendPrompt}>
				<SendPrompt />
			</Modal>
			<Modal open={showReceivePrompt}>
				<ReceivePrompt />
			</Modal>
			<Modal open={showRecoveryDialog}>
				<RecoveryDialog />
			</Modal>
			<Modal open={showChangePasswordDialog}>
				<ChangePasswordDialog />
			</Modal>
			<Modal open={showBackupPrompt}>
				<BackupPrompt />
			</Modal>
			<TransactionList />
		</div>
	)
}

Wallet.propTypes = {
	siafundbalance: PropTypes.string.isRequired,
	showNewWalletDialog: PropTypes.bool,
	showSendPrompt: PropTypes.bool,
	showReceivePrompt: PropTypes.bool,
	showChangePasswordDialog: PropTypes.bool,
	showBackupPrompt: PropTypes.bool,
}

export default Wallet
