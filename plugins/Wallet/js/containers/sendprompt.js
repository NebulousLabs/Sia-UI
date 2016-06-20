import SendPromptView from '../components/sendprompt.js'
import { setSendAddress, setSendAmount, closeSendPrompt, sendCurrency } from '../actions/wallet.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	sendAddress: state.sendprompt.get('sendaddress'),
	sendAmount: state.sendprompt.get('sendamount'),
	currencytype: state.sendprompt.get('currencytype'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ closeSendPrompt, setSendAddress, setSendAmount, sendCurrency }, dispatch),
})

const SendPrompt = connect(mapStateToProps, mapDispatchToProps)(SendPromptView)
export default SendPrompt
