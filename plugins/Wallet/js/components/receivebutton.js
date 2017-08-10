import React from 'react'

const ReceiveButton = ({actions}) => {
	const handleReceiveButtonClick = () => actions.showReceivePrompt()
	return (
		<div className="wallet-button receive-button" onClick={handleReceiveButtonClick}>
			<i className="fa fa-download fa-2x" />
			<span>Receive Siacoin</span>
		</div>
	)
}

export default ReceiveButton
