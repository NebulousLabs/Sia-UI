import CommandInputView from '../components/commandinput.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
//import { startSendPrompt } from '../actions/wallet.js'

const mapStateToProps = () => ({
})

const mapDispatchToProps = (dispatch) => ({
	//actions: bindActionCreators({ startSendPrompt }, dispatch),
})

const CommandInput = connect(mapStateToProps, mapDispatchToProps)(CommandInputView)
export default CommandInput
