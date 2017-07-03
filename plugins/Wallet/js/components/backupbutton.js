import React from 'react'

const BackupButton = ({actions}) => {
	const handleClick = () => actions.showBackupPrompt()
	return (
		<div onClick={handleClick} className="backup-button">
			<i className="fa fa-sticky-note fa-2x" />
			<span>Backup Wallet</span>
		</div>
	)
}

export default BackupButton 
