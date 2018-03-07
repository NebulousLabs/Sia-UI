import PropTypes from 'prop-types'
import React from 'react'
import Modal from './modal'
import ConfirmationDialog from '../containers/confirmationdialog.js'

const NewWalletDialog = ({password, seed, showConfirmationDialog, actions}) => {
	const handleDismissClick = () => actions.showConfirmationDialog()
	return (
		<div className="newwallet-dialog">
			<div className="dialog">
				<Modal open={showConfirmationDialog}>
					{showConfirmationDialog ? <ConfirmationDialog /> : null}
				</Modal>
				<h3 className="dialog__title">
					Congratulations, your wallet has been created!
				</h3>
				<div className="dialog__content">
					<p className="dialog__content-text"> Please write down the seed and password in a safe place.  If you forget your password, you won't be able to access your wallet. </p>
					<h2> Seed: </h2>
					<div className="newwallet-seed">
						{seed}
					</div>
					<h2> Password: </h2>
					<div className="newwallet-password">
						{password}
					</div>
				</div>
				<button className="newwallet-dismiss button" onClick={handleDismissClick}> I have written these down in a safe place </button>
			</div>
		</div>
	)
}

NewWalletDialog.propTypes = {
	password: PropTypes.string.isRequired,
	seed: PropTypes.string.isRequired,
}

export default NewWalletDialog
