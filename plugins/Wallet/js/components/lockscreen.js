import React, { PropTypes } from 'react'
import PasswordPrompt from '../containers/passwordprompt.js'
import NewWalletButton from '../containers/newwalletbutton.js'

const LockScreen = ({unlocked, unlocking, encrypted}) => {
	if (unlocked && encrypted && !unlocking) {
		// Wallet is unlocked and encrypted, return an empty lock screen.
		return (
			<div></div>
		)
	}
	let lockscreenContents
	if (!unlocked && encrypted && !unlocking) {
		lockscreenContents = (
			<PasswordPrompt />
		)
	} else  if (!encrypted && !unlocking) {
		// Wallet is not encrypted, return a lockScreen that initializes a new wallet.
		lockscreenContents = (
			<NewWalletButton />
		)
	}
	return (
		<div className="modal">
			<div className="lockscreen">
				{lockscreenContents}
			</div>
		</div>
	)
}
LockScreen.propTypes = {
	unlocked: PropTypes.bool,
	unlocking: PropTypes.bool,
	encrypted: PropTypes.bool,
}

export default LockScreen
