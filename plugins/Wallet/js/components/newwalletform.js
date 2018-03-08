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
				<button className="button button--danger button--tertiary" onClick={handleCancelClick}>Cancel</button>
				<input className="button button--primary" type="submit" value="Confirm" />
			</div>
		</form>
	)
}

export default NewWalletForm

