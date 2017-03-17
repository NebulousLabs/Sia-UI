import RecoverButtonView from '../components/recoverbutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showSeedRecoveryDialog } from '../actions/wallet.js'

const mapStateToProps = () => ({
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showSeedRecoveryDialog }, dispatch),
})

const RecoverButton = connect(mapStateToProps, mapDispatchToProps)(RecoverButtonView)
export default RecoverButton
