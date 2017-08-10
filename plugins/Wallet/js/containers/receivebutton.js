import ReceiveButtonView from '../components/receivebutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showReceivePrompt } from '../actions/wallet.js'

const mapStateToProps = () => ({
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showReceivePrompt }, dispatch),
})

const ReceiveButton = connect(mapStateToProps, mapDispatchToProps)(ReceiveButtonView)
export default ReceiveButton
