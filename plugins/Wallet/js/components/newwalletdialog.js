import PropTypes from 'prop-types'
import React from 'react'
import Modal from './modal'
import ConfirmationDialog from '../containers/confirmationdialog.js'
import PageStepper from './PageStepper'

const NewWalletDialog = ({password, seed, showConfirmationDialog, actions}) => {
	const handleDismissClick = () => actions.showConfirmationDialog()
	return (
		<PageStepper>
			{!showConfirmationDialog && (
				<div className="newwallet-dialog">
					<div className="dialog">
						<h2 className="dialog__title">
							Congratulations, your wallet has been created!
						</h2>
						<div className="dialog__content">
							<p className="dialog__content-text"> Please write down the seed and password in a safe place.  If you forget your password, you won't be able to access your wallet. </p>
							<h4> Seed: </h4>
							<div className="newwallet-seed">
								{seed}
							</div>
							<h4> Password: </h4>
							<div className="newwallet-password">
								{password}
							</div>
						</div>
						<button
							className="newwallet-dismiss button"
							onClick={handleDismissClick}
						>
							I have written these down in a safe place
						</button>
					</div>
				</div>
			)}
			{showConfirmationDialog ? <ConfirmationDialog /> : null}
		</PageStepper>
	)
}

NewWalletDialog.propTypes = {
	password: PropTypes.string.isRequired,
	seed: PropTypes.string.isRequired,
}

export default NewWalletDialog
