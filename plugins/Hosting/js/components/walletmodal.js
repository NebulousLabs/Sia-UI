import React from 'react'

const WalletUnlockModal = ({ walletLocked }) => (
	<div className={'hosting-options-modal modal' + (walletLocked ? '': ' hidden')}>
		<div className="hosting-options modal-message">
			<h3>You must unlock the wallet to host files.</h3>
			<i className="fa fa-lock fa-4x" />
		</div>
	</div>
)

export default WalletUnlockModal
