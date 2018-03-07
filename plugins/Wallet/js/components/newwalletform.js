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
			<h3>Enter a password to encrypt your wallet.</h3>
			<p>Not entering a password will make your wallet seed the password</p>
			<input className="input" type="password" name="password" autoFocus />
			<div className="new-wallet-form-buttons">
				<button className="button" onClick={handleCancelClick}>Cancel</button>
				<button className="button button--primary" type="submit">Confirm</button>
			</div>
		</form>
	)
}

export default NewWalletForm

