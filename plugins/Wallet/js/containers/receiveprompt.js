import ReceivePromptView from '../components/receiveprompt.js'
import { connect } from 'react-redux'
import { hideReceivePrompt, setAddressDescription, getNewReceiveAddress, saveAddress } from '../actions/wallet.js'
import { bindActionCreators } from 'redux'

const mapStateToProps = (state) => ({
	address: state.receiveprompt.get('address'),
	addresses: state.receiveprompt.get('addresses'),
	description: state.receiveprompt.get('description'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideReceivePrompt, getNewReceiveAddress, saveAddress, setAddressDescription}, dispatch),
})

const ReceivePrompt = connect(mapStateToProps, mapDispatchToProps)(ReceivePromptView)
export default ReceivePrompt
