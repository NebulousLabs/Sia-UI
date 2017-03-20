import React, { PropTypes } from 'react'

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
			<div className="modal">
				<div className="recovery-status">
					<i className="fa fa-circle-o-notch fa-spin fa-4x" aria-hidden="true" />
					<h3> Recovering seed, this may take a long time... </h3>
				</div>
			</div>
		)
	}

	return (
		<div className="modal">
			<form className="recovery-form" onSubmit={handleRecoverClick}>
				<h3> Enter a seed to recover funds from. </h3>
				<input type="text" name="seed" autoFocus />
				<div className="recovery-form-buttons">
					<button type="submit">Recover</button>
					<button onClick={handleCancelClick}>Cancel</button>
				</div>
			</form>
		</div>
	)
}

RecoveryDialog.propTypes = {
	recovering: PropTypes.bool.isRequired,
}

export default RecoveryDialog

