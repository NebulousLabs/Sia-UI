import PropTypes from 'prop-types'
import React from 'react'

const SendPrompt = ({currencytype, sendAddress, sendAmount, actions}) => {
	const handleSendAddressChange = (e) => actions.setSendAddress(e.target.value)
	const handleSendAmountChange = (e) => actions.setSendAmount(e.target.value)
	const handleSendClick = () => actions.sendCurrency(sendAddress, sendAmount, currencytype)
	const handleCancelClick = () => actions.closeSendPrompt()
	return (
		<div className="modal">
			<div className="sendprompt">
				<div className="sendamount">
					<h3>Send Amount {currencytype === 'siacoins' ? '(SC)' : '(SF)'} </h3>
					<input onChange={handleSendAmountChange} value={sendAmount} />
				</div>
				<div className="sendaddress">
					<h3> To Address </h3>
					<input onChange={handleSendAddressChange} value={sendAddress} />
				</div>
				<div className="send-prompt-buttons">
					<button className="send-siacoin-button" onClick={handleSendClick}>Send</button>
					<button className="cancel-send-button" onClick={handleCancelClick}>Cancel</button>
				</div>
			</div>
		</div>
	)
}
SendPrompt.propTypes = {
	sendAddress: PropTypes.string.isRequired,
	sendAmount: PropTypes.string.isRequired,
	currencytype: PropTypes.string.isRequired,
}

export default SendPrompt
