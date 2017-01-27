import React, { PropTypes } from 'react'
import ConfirmationDialog from '../containers/confirmationdialog.js'
const NewWalletDialog = ({password, seed, showConfirmationDialog, actions}) => {
	const handleDismissClick = () => actions.showConfirmationDialog()
	return (
		<div className="newwallet-dialog">
			{showConfirmationDialog ? <ConfirmationDialog /> : null}
			<p> You have created a new wallet!  Please write down the seed and password in a safe place.  If you forget your password, you won't be able to access your wallet. </p>
			<h2> Seed: </h2>
				<div id="new-wallet-seed"> <strong> {seed} </strong> </div>
			<h2> Password: </h2>
				<div id="new-wallet-seed"> <strong> {password} </strong> </div>
			<button className="newwallet-dismiss" onClick={handleDismissClick}> I have written these down in a safe place </button>
		</div>
	)
}

NewWalletDialog.propTypes = {
	password: PropTypes.string.isRequired,
	seed: PropTypes.string.isRequired,
}

export default NewWalletDialog
