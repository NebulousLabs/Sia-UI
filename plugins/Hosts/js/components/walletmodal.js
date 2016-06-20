import React, { PropTypes } from 'react'

const WalletUnlockModal = ({ shouldShowWalletUnlock, actions }) => {
	return (
		<div className={ 'hosting-options-modal modal' + (shouldShowWalletUnlock ? '': ' hidden') }>
			<div className="hosting-options modal-message">
                <h3>You must unlock the wallet to host files.</h3>
            </div>
		</div>
	)
}

export default WalletUnlockModal



