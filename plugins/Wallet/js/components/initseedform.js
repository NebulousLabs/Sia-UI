import React from 'react'

const InitSeedForm = ({ initializingSeed, useCustomPassphrase, hideInitSeedForm, createNewWallet }) => {
	if (initializingSeed) {
		return (
			<div className="new-wallet-form">
				<h3> Initializing seed... </h3>
				<i className="fa fa-circle-o-notch fa-spin fa-4x" />
			</div>
		)
	}
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
			<p> This will initialize your wallet from the provided seed, rescanning the blockchain to find all your money. This rescan process can take a while. The blockchain must also be synced. </p>
			<input type="text" name="seed" placeholder="Seed" autoFocus />
			{useCustomPassphrase ? <input type="password" placeholder="Desired password" name="password" /> : null}
			<div className="new-wallet-form-buttons">
				<button type="submit">Confirm</button>
				<button onClick={handleCancelClick}>Cancel</button>
			</div>
		</form>
	)
}

export default InitSeedForm

