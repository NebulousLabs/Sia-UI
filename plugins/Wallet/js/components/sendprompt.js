import React, { PropTypes } from 'react'

const SendPrompt = ({sendAddress, sendAmount, actions}) => {
	const handleSendAddressChange = (e) => actions.setSendAddress(e.target.value)
	const handleSendAmountChange = (e) => actions.setSendAmount(e.target.value)
	const handleSendClick = () => actions.sendSiacoin(sendAddress, sendAmount)
	const handleCancelClick = () => actions.closeSendPrompt()
	return (
		<div className="modal">
			<div className="sendprompt">
				<div className="sendamount">
					<h3>Send Amount (SC) </h3>
					<input onChange={handleSendAmountChange}></input>
				</div>
				<div className="sendaddress">
					<h3> To Address </h3>
					<input onChange={handleSendAddressChange}></input>
				</div>
				<div className="send-prompt-buttons">
					<button className="cancel-send-button" onClick={handleCancelClick}>Cancel</button>
					<button className="send-siacoin-button" onClick={handleSendClick}>Send</button>
				</div>
			</div>
		</div>
	)
}
SendPrompt.propTypes = {
	sendAddress: PropTypes.string,
	sendAmount: PropTypes.string,
}

export default SendPrompt
