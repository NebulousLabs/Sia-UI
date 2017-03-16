import NewWalletFormView from '../components/newwalletform.js'
import { createNewWallet } from '../actions/wallet.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const mapStateToProps = () => ({
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ createNewWallet }, dispatch),
})

const NewWalletForm = connect(mapStateToProps, mapDispatchToProps)(NewWalletFormView)
export default NewWalletForm
