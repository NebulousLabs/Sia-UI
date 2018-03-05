import PropTypes from 'prop-types'
import React from 'react'

const RecoveryDialog = ({recovering, actions}) => {
	const handleRecoverClick = (e) => {
		e.preventDefault()
		actions.recoverSeed(e.target.seed.value)
	}
	const handleCancelClick = (e) => {
		e.preventDefault()
		actions.hideSeedRecoveryDialog()
	}

	if (recovering) {
		return (
			<div className="recovery-status">
				<i className="fa fa-circle-o-notch fa-spin fa-4x" aria-hidden="true" />
				<h3> Recovering seed, this may take a long time... </h3>
			</div>
		)
	}

	return (
		<div className="dialog">
			<form className="recovery-form" onSubmit={handleRecoverClick}>
				<h3 className="dialog__title"> Enter a seed to recover funds from. </h3>
				<div className="dialog__content">
					<p className="dialog__content-text">
						The entire blockchain will be scanned for outputs belonging to the seed. This takes a while.
					</p>
					<p> After the scan completes, these outputs will be sent to your wallet. </p>
					<input className="input" type="text" name="seed" autoFocus />
				</div>
				<div className="dialog__actions recovery-form-buttons">
					<button className="button" type="submit">Recover</button>
					<button className="button" onClick={handleCancelClick}>Cancel</button>
				</div>
			</form>
		</div>
	)
}

RecoveryDialog.propTypes = {
	recovering: PropTypes.bool.isRequired,
}

export default RecoveryDialog

