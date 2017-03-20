import RecoveryDialogView from '../components/recoverydialog.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { recoverSeed, hideSeedRecoveryDialog } from '../actions/wallet.js'

const mapStateToProps = (state) => ({
	recovering: state.wallet.get('recovering'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ recoverSeed, hideSeedRecoveryDialog }, dispatch),
})

const RecoveryDialog = connect(mapStateToProps, mapDispatchToProps)(RecoveryDialogView)
export default RecoveryDialog
