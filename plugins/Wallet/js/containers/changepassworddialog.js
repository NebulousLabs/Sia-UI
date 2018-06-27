import ChangePasswordDialogView from '../components/changepassworddialog.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
	hideChangePasswordDialog,
	changePassword,
	setChangePasswordError,
} from '../actions/wallet.js'

const mapStateToProps = (state) => ({
	changePasswordError: state.wallet.get('changePasswordError'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(
		{ hideChangePasswordDialog, changePassword, setChangePasswordError },
		dispatch
	),
})

const ChangePasswordDialog = connect(mapStateToProps, mapDispatchToProps)(
	ChangePasswordDialogView
)
export default ChangePasswordDialog
