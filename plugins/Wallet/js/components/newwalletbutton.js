import React from 'react'

const NewWalletButton = ({actions}) => {
	const handleNewWalletClick = () => actions.createNewWallet()
	return (
		<div onClick={handleNewWalletClick} className="new-wallet-button">
			<h3>Create a new Sia Wallet</h3>
			<i className="fa fa-plus-circle fa-4x" />
		</div>
	)
}

export default NewWalletButton
