import PropTypes from 'prop-types'
import React from 'react'

const BackupPrompt = ({primarySeed, actions}) => {
	const handleOkClick = () => actions.hideBackupPrompt()
	return (
		<div className="modal">
			<div className="backupprompt">
				<h3> Write down your primary seed to back up your wallet. You can restore this seed at any time. </h3>
				<h4> Primary Seed: </h4>
				<p className="primary-seed">{primarySeed}</p>
				<button className="ok-button" onClick={handleOkClick}>OK</button>
			</div>
		</div>
	)
}
BackupPrompt.propTypes = {
	primarySeed: PropTypes.string.isRequired,
}

export default BackupPrompt 
