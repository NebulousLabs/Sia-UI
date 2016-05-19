import React from 'react'

const NewWalletButton = ({actions}) => (
	<div onClick={actions.createNewWallet} className="new-wallet-button">
		<i className="fa fa-asterisk fa-4x"></i>
		New Wallet
	</div>
);

export default NewWalletButton
