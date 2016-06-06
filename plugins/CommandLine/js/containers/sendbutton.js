import SendButtonView from '../components/sendbutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { startSendPrompt } from '../actions/wallet.js'

const mapStateToProps = () => ({
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ startSendPrompt }, dispatch),
})

const SendButton = connect(mapStateToProps, mapDispatchToProps)(SendButtonView)
export default SendButton
