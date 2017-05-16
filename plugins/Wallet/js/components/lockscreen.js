import PropTypes from 'prop-types'
import React from 'react'
import PasswordPrompt from '../containers/passwordprompt.js'
import UninitializedWalletDialog from '../containers/uninitializedwalletdialog.js'
import RescanDialog from './rescandialog.js'

const LockScreen = ({unlocked, unlocking, encrypted, rescanning}) => {
	if (unlocked && encrypted && !unlocking && !rescanning) {
		// Wallet is unlocked and encrypted, return an empty lock screen.
		return (
			<div />
		)
	}
	let lockscreenContents
	if (!unlocked && encrypted && !rescanning) {
		lockscreenContents = (
			<PasswordPrompt />
		)
	} else if (rescanning) {
		lockscreenContents = (
			<RescanDialog />
		)
	} else if (!encrypted) {
		// Wallet is not encrypted, return a lockScreen that initializes a new wallet.
		lockscreenContents = (
			<UninitializedWalletDialog />
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
	unlocked: PropTypes.bool.isRequired,
	unlocking: PropTypes.bool.isRequired,
	encrypted: PropTypes.bool.isRequired,
	rescanning: PropTypes.bool.isRequired,
}

export default LockScreen
