import React, { PropTypes } from 'react'
import NewWalletForm from '../containers/newwalletform.js'

const UninitializedWalletDialog = ({showNewWalletForm, actions}) => {
	if (showNewWalletForm) {
		return (
			<NewWalletForm />
		)
	}

	const handleCreateWalletClick = () => actions.showNewWalletForm()
	return (
		<div className="uninitialized-wallet-dialog">
			<div className="create-wallet-button">
				<i className="fa fa-plus-circle fa-4x" onClick={handleCreateWalletClick} />
				<h3> Create a new wallet </h3>
			</div>
		</div>
	)
}

UninitializedWalletDialog.propTypes = {
	showNewWalletForm: PropTypes.bool.isRequired,
}

export default UninitializedWalletDialog

