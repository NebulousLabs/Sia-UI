import React from 'react'
import Modal from './modal'

const WalletUnlockModal = ({ walletLocked }) => (
	<Modal open={walletLocked}>
		<div className="hosting-options-modal dialog">
			<div className="hosting-options modal-message">
				<h3 className="dialog__title">You must unlock the wallet to host files</h3>
				<div className="dialog__content">
					<i className="fa fa-lock fa-4x" />
				</div>
			</div>
		</div>
	</Modal>
)

export default WalletUnlockModal
