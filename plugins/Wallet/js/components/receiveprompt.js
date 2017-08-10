import PropTypes from 'prop-types'
import React from 'react'

const ReceivePrompt = ({address, actions}) => {
	const handleDismissClick = () => actions.hideReceivePrompt()
	const handleGenerateClick = () => actions.getNewReceiveAddress()
	return (
		<div className="modal">
			<div className="receive-prompt">
				You can receive Siacoins using the following address:
				<div className="wallet-address-view">
					<div className="wallet-address">{address}</div>
					<div className="generate-address-button"><span>Generate new address*</span><i onClick={handleGenerateClick} className="fa fa-refresh" /></div>
				</div>
				<div className="footnote">* any previously generated addresses will remain valid and be able to receive coins.</div>
				<button className="receiveprompt-dismissbtn" onClick={handleDismissClick}>OK</button>
			</div>
		</div>
	)
}
ReceivePrompt.propTypes = {
	address: PropTypes.string,
}
export default ReceivePrompt
