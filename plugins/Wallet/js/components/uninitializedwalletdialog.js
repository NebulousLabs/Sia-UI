import PropTypes from 'prop-types'
import React from 'react'
import NewWalletForm from '../containers/newwalletform.js'
import InitSeedForm from './initseedform.js'

const UninitializedWalletDialog = ({initializingSeed, useCustomPassphrase, showInitSeedForm, showNewWalletForm, actions}) => {
	if (showNewWalletForm && useCustomPassphrase) {
		return (
			<NewWalletForm />
		)
	}
	if (showInitSeedForm) {
		return (
			<InitSeedForm
				initializingSeed={initializingSeed}
				useCustomPassphrase={useCustomPassphrase}
				hideInitSeedForm={actions.hideInitSeedForm}
				createNewWallet={actions.createNewWallet}
			/>
		)
	}
	if (showNewWalletForm && !useCustomPassphrase) {
		actions.createNewWallet()
	}

	const handleCustomPasswordClick = () => actions.setUseCustomPassphrase(!useCustomPassphrase)
	const handleCreateWalletClick = () => actions.showNewWalletForm()
	const handleCreateWalletFromSeedClick = () => actions.showInitSeedForm()

	return (
		<div className="uninitialized-wallet-dialog">
			<div className="wallet-init-buttons">
				<button
					className="create-wallet-button button"
					onClick={handleCreateWalletClick}
				>
					<i className="fa fa-plus-circle fa-4x" />
					<h4> Create a new Sia wallet </h4>
				</button>
				<button
					className="create-wallet-button button"
					onClick={handleCreateWalletFromSeedClick}
				>
					<i className="fa fa-key fa-4x" />
					<h4> Recover wallet from seed </h4>
				</button>
			</div>
			<div className="use-passphrase-checkbox">
				<input type="checkbox" checked={useCustomPassphrase} onChange={handleCustomPasswordClick} />
				<span> Use custom passphrase </span>
			</div>
		</div>
	)
}

UninitializedWalletDialog.propTypes = {
	useCustomPassphrase: PropTypes.bool.isRequired,
	showNewWalletForm: PropTypes.bool.isRequired,
	initializingSeed: PropTypes.bool.isRequired,
}

export default UninitializedWalletDialog

