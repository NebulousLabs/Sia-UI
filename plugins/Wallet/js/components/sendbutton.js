import React from 'react'

const SendButton = ({actions}) => {
	const handleSendButtonClick = () => actions.startSendPrompt()
	return (
		<div onClick={handleSendButtonClick} className="send-button">
			<i className="fa fa-paper-plane fa-2x"></i>
			<span>Send Siacoin</span>
		</div>
	)
}

export default SendButton
