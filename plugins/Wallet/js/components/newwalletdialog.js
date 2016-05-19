import React, { PropTypes } from 'react';

const NewWalletDialog = ({visible, password, seed, actions}) => {
	if (!visible) {
		return (
			<div></div>
		);
	}
	return (
		<div className="newwallet-dialog">
			<p> You have created a new wallet!  Please save the seed and password in a safe place. </p>
			<h2> Seed: </h2>
			<p className="newwallet-seed">
				{seed}
			</p>
			<h2> Password: </h2>
			<p className="newwallet-password">
				{password}
			</p>
			<button className="newwallet-dismiss" onClick={actions.dismissNewWalletDialog}> Dismiss </button>
		</div>
	)
}

NewWalletDialog.propTypes = {
	visible: PropTypes.bool.isRequired,
	password: PropTypes.string,
	seed: PropTypes.string,
}

export default NewWalletDialog;
