import React from 'react'

const RecoveryDialog = ({actions}) => {
	const handleRecoverClick = (e) => {
		e.preventDefault()
		actions.recoverSeed(e.target.seed.value)
	}
	const handleCancelClick = (e) => {
		e.preventDefault()
		actions.hideSeedRecoveryDialog()
	}
	return (
		<form className="recovery-form" onSubmit={handleRecoverClick}>
			<h3> Enter a seed to recover funds from. </h3>
			<input type="text" name="seed" autoFocus />
			<div className="recovery-form-buttons">
				<button type="submit">Recover</button>
				<button onClick={handleCancelClick}>Cancel</button>
			</div>
		</form>
	)
}

export default RecoveryDialog

