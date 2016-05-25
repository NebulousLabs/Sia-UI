import React, { PropTypes } from 'react';

const NewWalletDialog = ({visible, password, seed, actions}) => {
	if (!visible) {
		return (
			<div></div>
		);
	}
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
			<button className="newwallet-dismiss" onClick={actions.dismissNewWalletDialog}> I have written these down in a safe place </button>
		</div>
	)
}

NewWalletDialog.propTypes = {
	visible: PropTypes.bool.isRequired,
	password: PropTypes.string,
	seed: PropTypes.string,
}

export default NewWalletDialog;
