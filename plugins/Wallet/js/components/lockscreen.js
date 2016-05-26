import React, { PropTypes } from 'react';
import PasswordPrompt from '../containers/passwordprompt.js';
import NewWalletButton from '../containers/newwalletbutton.js';

const LockScreen = ({unlocked, encrypted}) => {
	if (!unlocked && encrypted) {
		return (
			<div className="modal">
				<div className="lockscreen">
					<span> Enter your wallet unlock password to continue. </span>
					<PasswordPrompt />
				</div>
			</div>
		)
	}
	if (unlocked && encrypted) {
		// Wallet is unlocked and encrypted, return an empty lock screen.
		return (
			<div></div>
		)
	}
	if (!encrypted) {
		// Wallet is not encrypted, return a lockScreen that initializes a new wallet.
		return (
			<div className="modal">
				<div className="lockscreen">
					<NewWalletButton />
				</div>
			</div>
		);
	}
}
LockScreen.propTypes = {
	unlocked: PropTypes.bool,
	encrypted: PropTypes.bool,
}

export default LockScreen;
