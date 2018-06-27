import React from 'react'

const RecoverButton = ({ actions }) => {
	const handleRecoverButtonClick = () => actions.showSeedRecoveryDialog()
	return (
		<div
			className="wallet-button recover-button"
			onClick={handleRecoverButtonClick}
		>
			<i className="fa fa-key fa-2x" />
			<span>Recover Seed</span>
		</div>
	)
}

export default RecoverButton
