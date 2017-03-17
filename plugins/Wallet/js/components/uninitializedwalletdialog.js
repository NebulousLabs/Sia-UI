import React, { PropTypes } from 'react'
import NewWalletForm from '../containers/newwalletform.js'

const UninitializedWalletDialog = ({useCustomPassphrase, showNewWalletForm, actions}) => {
	if (showNewWalletForm && useCustomPassphrase) {
		return (
			<NewWalletForm />
		)
	}
	if (showNewWalletForm && !useCustomPassphrase) {
		actions.createNewWallet()
	}

	const handleCustomPasswordClick = () => {
		actions.setUseCustomPassphrase(!useCustomPassphrase)
	}
	const handleCreateWalletClick = () => actions.showNewWalletForm()
	return (
		<div className="uninitialized-wallet-dialog">
			<div className="create-wallet-button">
				<i className="fa fa-plus-circle fa-4x" onClick={handleCreateWalletClick} />
				<h3> Create a new wallet </h3>
				<div>
					<input type="checkbox" checked={useCustomPassphrase} onChange={handleCustomPasswordClick} />
					<span> Use custom passphrase </span>
				</div>
			</div>
		</div>
	)
}

UninitializedWalletDialog.propTypes = {
	useCustomPassphrase: PropTypes.bool.isRequired,
	showNewWalletForm: PropTypes.bool.isRequired,
}

export default UninitializedWalletDialog

