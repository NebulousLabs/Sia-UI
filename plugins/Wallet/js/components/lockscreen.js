import React, { PropTypes } from 'react';
import PasswordPrompt from '../containers/passwordprompt.js';
import NewWalletButton from '../containers/newwalletbutton.js';
import NewWalletDialog from '../containers/newwalletdialog.js';

const LockScreen = ({unlocked, unlocking, encrypted}) => {
	if (!unlocked && encrypted && !unlocking) {
		return (
			<div className="modal">
				<div className="lockscreen">
					<span> Enter your wallet unlock password to continue. </span>
					<PasswordPrompt />
				</div>
			</div>
		)
	}
	if (unlocked && encrypted && !unlocking) {
		// Wallet is unlocked and encrypted, return an empty lock screen.
		return (
			<div></div>
		)
	}
	if (!encrypted && !unlocking) {
		// Wallet is not encrypted, return a lockScreen that initializes a new wallet.
		return (
			<div className="modal">
				<div className="lockscreen">
					<NewWalletButton />
				</div>
			</div>
		);
	}
	if (unlocking) {
		return (
			<div className="modal">
				<div className="lockscreen">
					<span> Unlocking your wallet... </span>
				</div>
			</div>
		)
	}
}
LockScreen.propTypes = {
	unlocked: PropTypes.bool,
	unlocking: PropTypes.bool,
	encrypted: PropTypes.bool,
}

export default LockScreen;
