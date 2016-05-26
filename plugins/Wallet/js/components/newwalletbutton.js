import React from 'react'

const NewWalletButton = ({actions}) => (
	<div onClick={actions.createNewWallet} className="new-wallet-button">
		<h3>Create a new Sia Wallet</h3>
		<i className="fa fa-asterisk fa-4x"></i>
	</div>
);

export default NewWalletButton
