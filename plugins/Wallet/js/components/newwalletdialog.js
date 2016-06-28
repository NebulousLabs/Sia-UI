import React, { PropTypes } from 'react'

const NewWalletDialog = ({password, seed, actions}) => {
	const handleDismissClick = () => actions.dismissNewWalletDialog()
	return (
		<div className="newwallet-dialog">
			<p> You have created a new wallet!  Please write down the seed and password in a safe place.  If you forget your password, you won't be able to access your wallet. </p>
			<h2> Seed: </h2>
			<span className="newwallet-seed">
				{seed}
			</span>
			<h2> Password: </h2>
			<span className="newwallet-password">
				{password}
			</span>
			<button className="newwallet-dismiss" onClick={handleDismissClick}> I have written these down in a safe place </button>
		</div>
	)
}

NewWalletDialog.propTypes = {
	password: PropTypes.string.isRequired,
	seed: PropTypes.string.isRequired,
}

export default NewWalletDialog
