import PropTypes from 'prop-types'
import React from 'react'
import { Portal } from 'react-portal'
import Transition from 'react-addons-css-transition-group'
import PasswordPrompt from '../containers/passwordprompt.js'
import UninitializedWalletDialog from '../containers/uninitializedwalletdialog.js'
import RescanDialog from './rescandialog.js'

const LockScreen = ({unlocked, unlocking, encrypted, rescanning}) => {
	let lockscreenContents
	let isEmpty = false

	if (unlocked && encrypted && !unlocking && !rescanning) {
		// Wallet is unlocked and encrypted, return an empty lock screen.
		lockscreenContents = (
			<div key="empty" />
		)
		isEmpty = true
	} else if (!unlocked && encrypted && !rescanning) {
		lockscreenContents = (
			<div key="password" className="lockscreen">
				<PasswordPrompt />
			</div>
		)
	} else if (rescanning) {
		lockscreenContents = (
			<div key="rescan" className="lockscreen">
				<RescanDialog />
			</div>
		)
	} else if (!encrypted) {
		// Wallet is not encrypted, return a lockScreen that initializes a new wallet.
		lockscreenContents = (
			<div key="wallet" className="lockscreen">
				<UninitializedWalletDialog />
			</div>
		)
	}
	return (
		<Portal>
			<Transition
				style={{
					// make interaction pass through if empty
					pointerEvents: isEmpty ?  'none' : 'initial',
				}}
				className="lockscreen-container"
				transitionName="lockscreen-container"
				transitionEnterTimeout={400}
				transitionLeaveTimeout={400}
			>
				{lockscreenContents}
			</Transition>
		</Portal>
	)
}
LockScreen.propTypes = {
	unlocked: PropTypes.bool.isRequired,
	unlocking: PropTypes.bool.isRequired,
	encrypted: PropTypes.bool.isRequired,
	rescanning: PropTypes.bool.isRequired,
}

export default LockScreen
