import React from 'react'

const NewWalletForm = ({actions}) => {
	const handleCreateWalletClick = (e) => {
		e.preventDefault()
		actions.createNewWallet(e.target.password.value)
		actions.hideNewWalletForm()
	}
	const handleCancelClick = (e) => {
		e.preventDefault()
		actions.hideNewWalletForm()
	}
	return (
		<form className="new-wallet-form" onSubmit={handleCreateWalletClick}>
			<h3>Enter a password to encrypt your wallet. You can leave this empty to use a secure, automatically generated password.</h3>
			<input type="password" name="password" autoFocus />
			<div className="new-wallet-form-buttons">
				<button type="submit">Confirm</button>
				<button onClick={handleCancelClick}>Cancel</button>
			</div>
		</form>
	)
}

export default NewWalletForm

