import React from 'react'

const LockButton = ({actions}) => {
	const handleLockButtonClick = () => actions.lockWallet()
	return (
		<div className="lock-button" onClick={handleLockButtonClick}>
			<i className="fa fa-lock fa-2x" />
			<span>Lock Wallet</span>
		</div>
	)
}

export default LockButton
