import SendPromptView from '../components/sendprompt.js'
import {
	setSendError,
	setSendAddress,
	setSendAmount,
	closeSendPrompt,
	sendCurrency,
} from '../actions/wallet.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	sendAddress: state.sendprompt.get('sendaddress'),
	sendAmount: state.sendprompt.get('sendamount'),
	currencytype: state.sendprompt.get('currencytype'),
	feeEstimate: state.sendprompt.get('feeEstimate'),
	sendError: state.sendprompt.get('error'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(
		{
			closeSendPrompt,
			setSendError,
			setSendAddress,
			setSendAmount,
			sendCurrency,
		},
		dispatch
	),
})

const SendPrompt = connect(mapStateToProps, mapDispatchToProps)(SendPromptView)
export default SendPrompt
