import React, { PropTypes } from 'react';
import UnlockButton from '../containers/unlockbutton.js';
import PasswordPrompt from '../containers/passwordprompt.js';
import NewWalletButton from '../containers/newwalletbutton.js';
import NewWalletDialog from '../containers/newwalletdialog.js';

const LockScreen = ({unlocked, encrypted}) => {
	var lockScreen;
	if (!unlocked && encrypted) {
		return (
			<div className="lockscreen">
				<UnlockButton />
				<PasswordPrompt />
			</div>
		)
	}
	if (unlocked && encrypted) {
		// Wallet is unlocked and encrypted, return an empty lock screen.
		return (
			<div className="lockscreen unlocked"></div>
		)
	}
	if (!encrypted) {
		// Wallet is not encrypted, return a lockScreen that initializes a new wallet.
		return (
			<div className="lockscreen">
				<NewWalletButton />
				<NewWalletDialog />
			</div>
		)
	}
}
LockScreen.propTypes = {
	unlocked: PropTypes.bool,
	encrypted: PropTypes.bool,
}

export default LockScreen;
