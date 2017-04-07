import React from 'react'

const InitSeedForm = ({ useCustomPassphrase, hideInitSeedForm, createNewWallet }) => {
	const handleInitSeedClick = (e) => {
		e.preventDefault()
		if (useCustomPassphrase) {
			createNewWallet(e.target.password.value, e.target.seed.value)
		} else {
			createNewWallet(undefined, e.target.seed.value)
		}
	}
	const handleCancelClick = (e) => {
		e.preventDefault()
		hideInitSeedForm()
	}
	return (
		<form className="new-wallet-form" onSubmit={handleInitSeedClick}>
			<h3> Enter a seed to initialize your wallet from. </h3>
			<input type="text" name="seed" placeholder="Seed" autoFocus />
			{useCustomPassphrase ? <input type="password" placeholder="Password" name="password" /> : null}
			<div className="new-wallet-form-buttons">
				<button type="submit">Confirm</button>
				<button onClick={handleCancelClick}>Cancel</button>
			</div>
		</form>
	)
}

export default InitSeedForm

