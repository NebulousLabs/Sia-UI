import React, { PropTypes } from 'react'

const ReceivePrompt = ({address, actions}) => (
	<div className="modal">
		<div className="receive-prompt">
			You can receive Siacoins using the following address:
			<div className="wallet-address">{ address }</div>
			<button className="receiveprompt-dismissbtn" onClick={actions.hideReceivePrompt}>OK</button>
		</div>
	</div>
)
ReceivePrompt.propTypes = {
	address: PropTypes.string,
};
export default ReceivePrompt;
