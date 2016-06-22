import LockButtonView from '../components/lockbutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { lockWallet } from '../actions/wallet.js'

const mapStateToProps = () => ({
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ lockWallet }, dispatch),
})

const LockButton = connect(mapStateToProps, mapDispatchToProps)(LockButtonView)
export default LockButton
